import requests
from fastapi import APIRouter, HTTPException, status
from app.utils.response_utils import standard_response

router = APIRouter()
MLFLOW_SERVER = "http://127.0.0.1:8885"

@router.get("/experiments")
def get_experiments():
    """API untuk mendapatkan daftar eksperimen dari MLflow"""
    try:
        response = requests.post(
            f"{MLFLOW_SERVER}/api/2.0/mlflow/experiments/search",
            json={"max_results": 100},
        )
        response.raise_for_status()
        data = response.json().get("experiments", [])
        return standard_response("success", status.HTTP_200_OK, "experiments_fetched", data)
    except requests.RequestException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to fetch experiments: {str(e)}")

@router.get("/runs/{experiment_id}")
def get_runs(experiment_id: str):
    """API untuk mendapatkan daftar runs berdasarkan experiment_id"""
    try:
        response = requests.post(
            f"{MLFLOW_SERVER}/api/2.0/mlflow/runs/search",
            json={"experiment_ids": [experiment_id], "max_results": 50},
        )
        response.raise_for_status()
        data = response.json().get("runs", [])
        return standard_response("success", status.HTTP_200_OK, "runs_fetched", data)
    except requests.RequestException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to fetch runs: {str(e)}")
