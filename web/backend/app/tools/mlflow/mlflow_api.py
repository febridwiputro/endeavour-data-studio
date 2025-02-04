from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"], 
)

@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

MLFLOW_SERVER = "http://127.0.0.1:8885"

@app.get("/experiments")
def get_experiments():
    """API untuk mendapatkan daftar eksperimen dari MLflow"""
    response = requests.post(
        f"{MLFLOW_SERVER}/api/2.0/mlflow/experiments/search",
        json={"max_results": 100},
    )
    return response.json()

@app.get("/runs/{experiment_id}")
def get_runs(experiment_id: str):
    """API untuk mendapatkan daftar runs berdasarkan experiment_id"""
    response = requests.post(
        f"{MLFLOW_SERVER}/api/2.0/mlflow/runs/search",
        json={"experiment_ids": [experiment_id], "max_results": 50},
    )
    return response.json()
