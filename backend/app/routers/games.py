from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import httpx
import asyncio
import time
from datetime import datetime, timezone

from app.database import get_db
from app.config import settings
from app.models import Game, Rating, Review, Favorite, User
from app.schemas import GameDetail, GameStats, GameSearchResult, UserGameStatus, ReviewResponse, UserPublic
from app.auth import get_current_user

router = APIRouter(prefix="/api/games", tags=["games"])


async def fetch_rawg_search(query: str, page: int = 1, page_size: int = 10):
    """Search RAWG API for games."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.RAWG_BASE_URL}/games",
            params={
                "key": settings.RAWG_API_KEY,
                "search": query,
                "page": page,
                "page_size": page_size,
                "search_precise": True,
            },
            timeout=10.0,
        )
        response.raise_for_status()
        return response.json()


async def fetch_rawg_game(rawg_id: int):
    """Fetch a single game from RAWG by ID."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.RAWG_BASE_URL}/games/{rawg_id}",
            params={"key": settings.RAWG_API_KEY},
            timeout=10.0,
        )
        response.raise_for_status()
        return response.json()


def rawg_to_game(data: dict) -> dict:
    """Convert RAWG API response to our Game model fields."""
    developers = data.get("developers", [])
    publishers = data.get("publishers", [])
    platforms = []
    for p in data.get("platforms", []) or []:
        plat = p.get("platform", {})
        if plat.get("name"):
            platforms.append(plat["name"])
    genres = [g["name"] for g in (data.get("genres", []) or [])]

    rel_date = None
    released_str = data.get("released")
    if released_str:
        try:
            rel_date = datetime.strptime(str(released_str), "%Y-%m-%d").date()
        except (ValueError, TypeError):
            rel_date = None

    return {
        "rawg_id": data["id"],
        "title": data.get("name", ""),
        "slug": data.get("slug", ""),
        "description": data.get("description_raw", data.get("description", "")),
        "cover_url": data.get("background_image", None),
        "background_url": data.get("background_image_additional", data.get("background_image", None)),
        "release_date": rel_date,
        "developer": developers[0]["name"] if developers else "",
        "publisher": publishers[0]["name"] if publishers else "",
        "platforms": platforms,
        "genres": genres,
        "cached_at": datetime.now(timezone.utc),
    }


def get_or_cache_game(db: Session, rawg_id: int, rawg_data: dict = None) -> Game:
    """Get game from DB cache, or create from RAWG data."""
    game = db.query(Game).filter(Game.rawg_id == rawg_id).first()
    if game:
        return game
    if rawg_data is None:
        return None
    fields = rawg_to_game(rawg_data)
    game = Game(**fields)
    db.add(game)
    db.commit()
    db.refresh(game)
    return game


@router.get("/search", response_model=list[GameSearchResult])
async def search_games(q: str = Query(min_length=1, max_length=200)):
    """Search for games via RAWG API."""
    try:
        data = await fetch_rawg_search(q, page_size=12)
    except Exception:
        raise HTTPException(status_code=502, detail="Failed to search games")

    results = []
    for game in data.get("results", []):
        platforms = []
        for p in game.get("platforms", []) or []:
            plat = p.get("platform", {})
            if plat.get("name"):
                platforms.append(plat["name"])
        results.append(GameSearchResult(
            rawg_id=game["id"],
            title=game.get("name", ""),
            slug=game.get("slug", ""),
            cover_url=game.get("background_image", None),
            release_date=game.get("released", None),
            platforms=platforms,
        ))
    return results


async def fetch_rawg_trending(page_size: int = 18):
    """Fetch all-time popular games from RAWG."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.RAWG_BASE_URL}/games",
            params={
                "key": settings.RAWG_API_KEY,
                "ordering": "-added",
                "page_size": page_size,
            },
            timeout=10.0,
        )
        response.raise_for_status()
        return response.json()


@router.get("/trending", response_model=list[GameSearchResult])
async def get_trending_games(limit: int = Query(18, ge=1, le=50)):
    """Get popular/trending games to populate discovery & home."""
    try:
        data = await fetch_rawg_trending(page_size=limit)
    except Exception:
        return []

    results = []
    for game in data.get("results", []):
        platforms = []
        for p in game.get("platforms", []) or []:
            plat = p.get("platform", {})
            if plat.get("name"):
                platforms.append(plat["name"])
        results.append(GameSearchResult(
            rawg_id=game["id"],
            title=game.get("name", ""),
            slug=game.get("slug", ""),
            cover_url=game.get("background_image", None),
            release_date=game.get("released", None),
            platforms=platforms,
        ))
    return results


_feed_cache = None
_feed_cache_time = 0


def _parse_game_results(data: dict) -> list[GameSearchResult]:
    results = []
    for game in data.get("results", []) or []:
        platforms = []
        for p in game.get("platforms", []) or []:
            plat = p.get("platform", {})
            if plat.get("name"):
                platforms.append(plat["name"])
        results.append(GameSearchResult(
            rawg_id=game["id"],
            title=game.get("name", ""),
            slug=game.get("slug", ""),
            cover_url=game.get("background_image", None),
            release_date=game.get("released", None),
            platforms=platforms,
        ))
    return results


@router.get("/home-feed")
async def get_home_feed():
    """Fetch multi-category Netflix-style game shelves for the homepage."""
    global _feed_cache, _feed_cache_time
    now = time.time()
    if _feed_cache and (now - _feed_cache_time < 600):
        return _feed_cache

    k = settings.RAWG_API_KEY
    async with httpx.AsyncClient() as client:
        try:
            req_trending = client.get(
                f"{settings.RAWG_BASE_URL}/games",
                params={"key": k, "ordering": "-added", "page_size": 14},
                timeout=12.0,
            )
            req_latest = client.get(
                f"{settings.RAWG_BASE_URL}/games",
                params={"key": k, "dates": "2023-01-01,2026-10-01", "ordering": "-added", "page_size": 14},
                timeout=12.0,
            )
            req_rpg = client.get(
                f"{settings.RAWG_BASE_URL}/games",
                params={"key": k, "genres": "role-playing-games-rpg", "ordering": "-added", "page_size": 14},
                timeout=12.0,
            )
            req_action = client.get(
                f"{settings.RAWG_BASE_URL}/games",
                params={"key": k, "genres": "action", "ordering": "-added", "page_size": 14},
                timeout=12.0,
            )
            req_top = client.get(
                f"{settings.RAWG_BASE_URL}/games",
                params={"key": k, "ordering": "-rating", "page_size": 14},
                timeout=12.0,
            )

            resps = await asyncio.gather(req_trending, req_latest, req_rpg, req_action, req_top, return_exceptions=True)

            trending = _parse_game_results(resps[0].json()) if not isinstance(resps[0], Exception) else []
            latest = _parse_game_results(resps[1].json()) if not isinstance(resps[1], Exception) else []
            rpg = _parse_game_results(resps[2].json()) if not isinstance(resps[2], Exception) else []
            action = _parse_game_results(resps[3].json()) if not isinstance(resps[3], Exception) else []
            top_rated = _parse_game_results(resps[4].json()) if not isinstance(resps[4], Exception) else []

            feed = {
                "featured": trending[:5],
                "trending": trending,
                "latest": latest,
                "rpg": rpg,
                "action": action,
                "top_rated": top_rated,
            }
            _feed_cache = feed
            _feed_cache_time = now
            return feed
        except Exception:
            return _feed_cache or {
                "featured": [],
                "trending": [],
                "latest": [],
                "rpg": [],
                "action": [],
                "top_rated": [],
            }


@router.get("/{rawg_id}", response_model=GameDetail)
async def get_game(rawg_id: int, db: Session = Depends(get_db)):
    """Get game detail. Fetches from RAWG if not cached."""
    game = db.query(Game).filter(Game.rawg_id == rawg_id).first()
    if game:
        return game

    # Fetch from RAWG and cache
    try:
        data = await fetch_rawg_game(rawg_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Game not found")

    game = get_or_cache_game(db, rawg_id, data)
    return game


@router.get("/{rawg_id}/stats", response_model=GameStats)
def get_game_stats(rawg_id: int, db: Session = Depends(get_db)):
    """Get community stats for a game."""
    game = db.query(Game).filter(Game.rawg_id == rawg_id).first()
    if not game:
        return GameStats()

    avg = db.query(func.avg(Rating.rating)).filter(Rating.game_id == game.id).scalar()
    total_ratings = db.query(func.count(Rating.id)).filter(Rating.game_id == game.id).scalar()
    total_reviews = db.query(func.count(Review.id)).filter(Review.game_id == game.id).scalar()
    total_favorites = db.query(func.count(Favorite.id)).filter(Favorite.game_id == game.id).scalar()

    return GameStats(
        avg_rating=round(avg, 2) if avg else None,
        total_ratings=total_ratings or 0,
        total_reviews=total_reviews or 0,
        total_favorites=total_favorites or 0,
    )


@router.get("/{rawg_id}/status", response_model=UserGameStatus)
def get_user_game_status(
    rawg_id: int,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user),
):
    """Get the current user's rating, favorite, and review for a game."""
    if not user:
        return UserGameStatus()

    game = db.query(Game).filter(Game.rawg_id == rawg_id).first()
    if not game:
        return UserGameStatus()

    rating_obj = db.query(Rating).filter(Rating.user_id == user.id, Rating.game_id == game.id).first()
    fav = db.query(Favorite).filter(Favorite.user_id == user.id, Favorite.game_id == game.id).first()
    review = db.query(Review).filter(Review.user_id == user.id, Review.game_id == game.id).first()

    review_resp = None
    if review:
        review_resp = ReviewResponse(
            id=review.id,
            user_id=review.user_id,
            game_id=review.game_id,
            body=review.body,
            contains_spoilers=review.contains_spoilers,
            created_at=review.created_at,
            updated_at=review.updated_at,
            user=UserPublic.model_validate(user),
        )

    return UserGameStatus(
        rating=rating_obj.rating if rating_obj else None,
        is_favorite=fav is not None,
        review=review_resp,
    )
