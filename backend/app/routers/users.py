from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.database import get_db
from app.models import User, Rating, Favorite, Review, Game
from app.schemas import UserProfile, UserPublic, UpdateProfileRequest, GameBase, ReviewResponse
from app.auth import require_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/{username}", response_model=UserProfile)
def get_user_profile(username: str, db: Session = Depends(get_db)):
    """Get a user's public profile."""
    user = db.query(User).filter(User.username == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    games_rated = db.query(func.count(Rating.id)).filter(Rating.user_id == user.id).scalar() or 0
    avg_rating = db.query(func.avg(Rating.rating)).filter(Rating.user_id == user.id).scalar()

    return UserProfile(
        id=user.id,
        username=user.username,
        avatar_url=user.avatar_url,
        bio=user.bio,
        created_at=user.created_at,
        games_rated=games_rated,
        avg_rating=round(avg_rating, 2) if avg_rating else None,
    )


@router.patch("/me", response_model=UserPublic)
def update_profile(
    req: UpdateProfileRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """Update your profile."""
    if req.bio is not None:
        user.bio = req.bio
    if req.avatar_url is not None:
        user.avatar_url = req.avatar_url
    db.commit()
    db.refresh(user)
    return user


@router.get("/{username}/ratings")
def get_user_ratings(
    username: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Get a user's rated games."""
    user = db.query(User).filter(User.username == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    ratings = (
        db.query(Rating)
        .options(joinedload(Rating.game))
        .filter(Rating.user_id == user.id)
        .order_by(Rating.updated_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return [
        {
            "rating": r.rating,
            "created_at": r.created_at,
            "game": {
                "id": r.game.id,
                "rawg_id": r.game.rawg_id,
                "title": r.game.title,
                "slug": r.game.slug,
                "cover_url": r.game.cover_url,
                "release_date": r.game.release_date,
                "platforms": r.game.platforms,
                "genres": r.game.genres,
            }
        }
        for r in ratings
    ]


@router.get("/{username}/favorites")
def get_user_favorites(
    username: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Get a user's favorite games."""
    user = db.query(User).filter(User.username == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    favorites = (
        db.query(Favorite)
        .options(joinedload(Favorite.game))
        .filter(Favorite.user_id == user.id)
        .order_by(Favorite.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return [
        {
            "created_at": f.created_at,
            "game": {
                "id": f.game.id,
                "rawg_id": f.game.rawg_id,
                "title": f.game.title,
                "slug": f.game.slug,
                "cover_url": f.game.cover_url,
                "release_date": f.game.release_date,
                "platforms": f.game.platforms,
                "genres": f.game.genres,
            }
        }
        for f in favorites
    ]


@router.get("/{username}/reviews", response_model=list[ReviewResponse])
def get_user_reviews(
    username: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Get a user's reviews."""
    user = db.query(User).filter(User.username == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reviews = (
        db.query(Review)
        .options(joinedload(Review.user))
        .filter(Review.user_id == user.id)
        .order_by(Review.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return reviews
