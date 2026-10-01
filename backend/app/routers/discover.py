from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Game, Rating, Review, Favorite

router = APIRouter(prefix="/api/discover", tags=["discover"])


def game_to_dict(game):
    return {
        "id": game.id,
        "rawg_id": game.rawg_id,
        "title": game.title,
        "slug": game.slug,
        "cover_url": game.cover_url,
        "release_date": game.release_date,
        "platforms": game.platforms,
        "genres": game.genres,
    }


@router.get("/popular")
def get_popular_games(
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Games with the most ratings."""
    results = (
        db.query(Game, func.count(Rating.id).label("rating_count"))
        .join(Rating, Rating.game_id == Game.id)
        .group_by(Game.id)
        .order_by(func.count(Rating.id).desc())
        .limit(limit)
        .all()
    )
    return [
        {**game_to_dict(game), "rating_count": count}
        for game, count in results
    ]


@router.get("/top-rated")
def get_top_rated_games(
    limit: int = Query(20, ge=1, le=50),
    min_ratings: int = Query(3, ge=1),
    db: Session = Depends(get_db),
):
    """Highest rated games with a minimum number of ratings."""
    results = (
        db.query(
            Game,
            func.avg(Rating.rating).label("avg_rating"),
            func.count(Rating.id).label("rating_count"),
        )
        .join(Rating, Rating.game_id == Game.id)
        .group_by(Game.id)
        .having(func.count(Rating.id) >= min_ratings)
        .order_by(func.avg(Rating.rating).desc())
        .limit(limit)
        .all()
    )
    return [
        {**game_to_dict(game), "avg_rating": round(avg, 2), "rating_count": count}
        for game, avg, count in results
    ]


@router.get("/recent")
def get_recently_reviewed(
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Recently rated or reviewed games."""
    results = (
        db.query(Game, func.max(Rating.updated_at).label("last_activity"))
        .join(Rating, Rating.game_id == Game.id)
        .group_by(Game.id)
        .order_by(func.max(Rating.updated_at).desc())
        .limit(limit)
        .all()
    )
    return [game_to_dict(game) for game, _ in results]
