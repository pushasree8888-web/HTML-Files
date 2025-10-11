from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Optional
import numpy as np

app = FastAPI()

# In-memory stubs; in production query MongoDB via server or direct read-only
USERS: Dict[str, Dict] = {}

class RecommendRequest(BaseModel):
    userId: str
    # Optional snapshot of all users; if provided, the service will compute on it
    usersSnapshot: Optional[Dict[str, Dict]] = None

class RecommendResponse(BaseModel):
    userId: str
    recommendations: List[Dict]

@app.post('/recommend', response_model=RecommendResponse)
async def recommend(req: RecommendRequest):
    # Very simple cosine similarity on one-hot skill vectors
    # Expect USERS[userId] = {"skillsOffered": [...], "skillsToLearn": [...]} populated elsewhere
    if req.usersSnapshot is not None:
        # Replace in-memory users with snapshot for deterministic scoring
        # Snapshot format: { userId: { skillsOffered: [...], skillsToLearn: [...], ratingsAverage?: number } }
        users_source = req.usersSnapshot
    else:
        users_source = USERS

    user = users_source.get(req.userId)
    if not user:
        return {"userId": req.userId, "recommendations": []}

    # Build vocabulary
    vocab = set()
    for u in users_source.values():
        vocab.update(u.get("skillsOffered", []))
        vocab.update(u.get("skillsToLearn", []))
    vocab = sorted(vocab)
    index = {s: i for i, s in enumerate(vocab)}

    def vectorize(offered: List[str], to_learn: List[str]):
        vec = np.zeros(len(vocab) * 2)
        for s in offered:
            if s in index:
                vec[index[s]] = 1
        for s in to_learn:
            if s in index:
                vec[len(vocab) + index[s]] = 1
        return vec

    target_vec = vectorize(user.get("skillsOffered", []), user.get("skillsToLearn", []))

    recs = []
    for other_id, other in users_source.items():
        if other_id == req.userId:
            continue
        other_vec = vectorize(other.get("skillsOffered", []), other.get("skillsToLearn", []))
        denom = (np.linalg.norm(target_vec) * np.linalg.norm(other_vec))
        score = float(np.dot(target_vec, other_vec) / denom) if denom else 0.0
        # Boost by ratings if provided
        score *= (1.0 + float(other.get("ratingsAverage", 0)) / 5.0)
        if score > 0:
            recs.append({"userId": other_id, "score": score})

    recs.sort(key=lambda r: r["score"], reverse=True)
    return {"userId": req.userId, "recommendations": recs[:20]}

class RecomputeRequest(BaseModel):
    userId: str

@app.post('/recompute')
async def recompute(req: RecomputeRequest):
    # Hook for server to notify changes; in real system reload embeddings/model
    return {"ok": True}

@app.get('/health')
async def health():
    return {"ok": True}
