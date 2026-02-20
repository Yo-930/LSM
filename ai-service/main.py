from fastapi import FastAPI

import random

app = FastAPI()

@app.post("/verify")
def verify(data: dict):
    repo = data.get("githubRepo")

    #verify logic

    originality = random.randint(70, 100)
    confidence = random.randint(80, 100)

    return{
        "originality": originality,
        "confidence": confidence,
        "summary":f"Repository {repo} has an originality score of {originality}% and a confidence score of {confidence}%."
    }