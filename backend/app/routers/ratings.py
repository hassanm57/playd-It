from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Game, Rating
from app.schemas import RateRequest, RatingResponse
from app.auth import require_user
from app.routers.games import fetch_rawg_game, get_or_cache_game

router = APIRouter(prefix="/api/games", tags=["ratings"])


@router.put("/{rawg_id}/rate", response_model=RatingResponse)
async def rate_game(
    rawg_id: int,
    req: RateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """Rate a game (upsert). Creates the game in our DB if needed."""
    # Validate half-star increments
    if req.rating * 2 != round(req.rating * 2):
        raise HTTPException(status_code=400, detail="Rating must be in 0.5 increments")

    game = db.query(Game).filter(Game.rawg_id == rawg_id).first()
    if not game:
        try:
            data = await fetch_rawg_game(rawg_id)
            game = get_or_cache_game(db, rawg_id, data)
        except Exception:
            raise HTTPException(status_code=404, detail="Game not found")

    existing = db.query(Rating).filter(
        Rating.user_id == user.id, Rating.game_id == game.id
    ).first()

    if existing:
        existing.rating = req.rating
        db.commit()
        db.refresh(existing)
        return existing
    else:
        rating = Rating(user_id=user.id, game_id=game.id, rating=req.rating)
        db.add(rating)
        db.commit()
        db.refresh(rating)
        return rating


@router.delete("/{rawg_id}/rate", status_code=204)
def unrate_game(
    rawg_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """Remove a rating."""
    game = db.query(Game).filter(Game.rawg_id == rawg_id).first()
    if not game:
        return
    rating = db.query(Rating).filter(
        Rating.user_id == user.id, Rating.game_id == game.id
    ).first()
    if rating:
        db.delete(rating)
        db.commit()
