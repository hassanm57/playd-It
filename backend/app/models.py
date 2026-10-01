from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, Date, ForeignKey, UniqueConstraint, CheckConstraint, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(500), default=None)
    bio = Column(String(300), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    ratings = relationship("Rating", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    rawg_id = Column(Integer, unique=True, nullable=False, index=True)
    title = Column(String(500), nullable=False, index=True)
    slug = Column(String(500), default="")
    description = Column(Text, default="")
    cover_url = Column(String(500), default=None)
    background_url = Column(String(500), default=None)
    release_date = Column(Date, default=None)
    developer = Column(String(300), default="")
    publisher = Column(String(300), default="")
    platforms = Column(JSON, default=list)
    genres = Column(JSON, default=list)
    cached_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    ratings = relationship("Rating", back_populates="game", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="game", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="game", cascade="all, delete-orphan")


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="ratings")
    game = relationship("Game", back_populates="ratings")

    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_user_game_rating"),
        CheckConstraint("rating >= 0.5 AND rating <= 5.0", name="ck_rating_range"),
    )


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="favorites")
    game = relationship("Game", back_populates="favorites")

    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_user_game_favorite"),
    )


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    body = Column(Text, nullable=False)
    contains_spoilers = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="reviews")
    game = relationship("Game", back_populates="reviews")

    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_user_game_review"),
    )
