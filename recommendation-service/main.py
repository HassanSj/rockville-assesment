from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NEST_BACKEND_URL = "http://localhost:4000"

@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: str, authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")

    try:
        profile_res = requests.get(
            f"{NEST_BACKEND_URL}/me",
            headers={"Authorization": authorization}
        )
        profile_res.raise_for_status()
        profile = profile_res.json()
        categories = profile.get("categories", [])
        print(f"Categories for user {user_id}: {categories}")
        recommended_res = requests.get(
            f"{NEST_BACKEND_URL}/movies/recommended?userId={user_id}",
            headers={"Authorization": authorization}
        )
        recommended_res.raise_for_status()
        movies = recommended_res.json()

        return movies

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
