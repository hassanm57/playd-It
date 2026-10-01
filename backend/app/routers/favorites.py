from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Game, Favorite
from app.schemas import FavoriteResponse
from app.auth import require_user
from app.routers.games import fetch_rawg_game, get_or_cache_game

router = APIRouter(prefix="/api/games", tags=["favorites"])


@router.put("/{rawg_id}/love", response_model=FavoriteResponse)
async def toggle_favorite(
    rawg_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """Toggle favorite status for a game."""
    game = db.query(Game).filter(Game.rawg_id == rawg_id).first()
    if not game:
        try:
            data = await fetch_rawg_game(rawg_id)
            game = get_or_cache_game(db, rawg_id, data)
        except Exception:
            raise HTTPException(status_code=404, detail="Game not found")

    existing = db.query(Favorite).filter(
        Favorite.user_id == user.id, Favorite.game_id == game.id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return FavoriteResponse(is_favorite=False)
    else:
        fav = Favorite(user_id=user.id, game_id=game.id)
        db.add(fav)
        db.commit()
        return FavoriteResponse(is_favorite=True)
