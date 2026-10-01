from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, games, ratings, favorites, reviews, users, discover

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PLAYD API",
    description="Letterboxd for video games",
    version="0.1.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(games.router)
app.include_router(ratings.router)
app.include_router(favorites.router)
app.include_router(reviews.router)
app.include_router(users.router)
app.include_router(discover.router)


@app.get("/")
def root():
    return {"app": "PLAYD", "version": "0.1.0"}
