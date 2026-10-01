from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date


# --- Auth ---
class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- User ---
class UserPublic(BaseModel):
    id: int
    username: str
    avatar_url: Optional[str] = None
    bio: str = ""
    created_at: datetime

    class Config:
        from_attributes = True

class UserProfile(UserPublic):
    games_rated: int = 0
    avg_rating: Optional[float] = None

class UpdateProfileRequest(BaseModel):
    bio: Optional[str] = Field(None, max_length=300)
    avatar_url: Optional[str] = None


# --- Game ---
class GameBase(BaseModel):
    id: int
    rawg_id: int
    title: str
    slug: str
    cover_url: Optional[str] = None
    release_date: Optional[date] = None
    platforms: list = []
    genres: list = []

    class Config:
        from_attributes = True

class GameDetail(GameBase):
    description: str = ""
    background_url: Optional[str] = None
    developer: str = ""
    publisher: str = ""

class GameStats(BaseModel):
    avg_rating: Optional[float] = None
    total_ratings: int = 0
    total_reviews: int = 0
    total_favorites: int = 0

class GameSearchResult(BaseModel):
    rawg_id: int
    title: str
    slug: str
    cover_url: Optional[str] = None
    release_date: Optional[str] = None
    platforms: list = []


# --- Rating ---
class RateRequest(BaseModel):
    rating: float = Field(ge=0.5, le=5.0)

class RatingResponse(BaseModel):
    id: int
    user_id: int
    game_id: int
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True


# --- Favorite ---
class FavoriteResponse(BaseModel):
    is_favorite: bool


# --- Review ---
class CreateReviewRequest(BaseModel):
    body: str = Field(min_length=1, max_length=5000)
    contains_spoilers: bool = False

class UpdateReviewRequest(BaseModel):
    body: Optional[str] = Field(None, min_length=1, max_length=5000)
    contains_spoilers: Optional[bool] = None

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    game_id: int
    body: str
    contains_spoilers: bool
    created_at: datetime
    updated_at: datetime
    user: UserPublic

    class Config:
        from_attributes = True


# --- User Game Status (combined for game page) ---
class UserGameStatus(BaseModel):
    rating: Optional[float] = None
    is_favorite: bool = False
    review: Optional[ReviewResponse] = None
