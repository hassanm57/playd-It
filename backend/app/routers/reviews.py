from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import User, Game, Review
from app.schemas import CreateReviewRequest, UpdateReviewRequest, ReviewResponse
from app.auth import require_user, get_current_user
from app.routers.games import fetch_rawg_game, get_or_cache_game
from typing import Optional

router = APIRouter(tags=["reviews"])


@router.get("/api/games/{rawg_id}/reviews", response_model=list[ReviewResponse])
def get_game_reviews(
    rawg_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Get reviews for a game."""
    game = db.query(Game).filter(Game.rawg_id == rawg_id).first()
    if not game:
        return []

    reviews = (
        db.query(Review)
        .options(joinedload(Review.user))
        .filter(Review.game_id == game.id)
        .order_by(Review.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return reviews


@router.post("/api/games/{rawg_id}/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(
    rawg_id: int,
    req: CreateReviewRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """Create a review for a game."""
    game = db.query(Game).filter(Game.rawg_id == rawg_id).first()
    if not game:
        try:
            data = await fetch_rawg_game(rawg_id)
            game = get_or_cache_game(db, rawg_id, data)
        except Exception:
            raise HTTPException(status_code=404, detail="Game not found")

    existing = db.query(Review).filter(
        Review.user_id == user.id, Review.game_id == game.id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="You already reviewed this game")

    review = Review(
        user_id=user.id,
        game_id=game.id,
        body=req.body,
        contains_spoilers=req.contains_spoilers,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # Reload with user relationship
    review = db.query(Review).options(joinedload(Review.user)).filter(Review.id == review.id).first()
    return review


@router.put("/api/reviews/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    req: UpdateReviewRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """Update your review."""
    review = db.query(Review).options(joinedload(Review.user)).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not your review")

    if req.body is not None:
        review.body = req.body
    if req.contains_spoilers is not None:
        review.contains_spoilers = req.contains_spoilers

    db.commit()
    db.refresh(review)
    return review


@router.delete("/api/reviews/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """Delete your review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not your review")

    db.delete(review)
    db.commit()
