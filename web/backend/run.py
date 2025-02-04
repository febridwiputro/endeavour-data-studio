import uvicorn
import subprocess
import time
import requests
from app.config.config import settings


def test_fastapi():
    """Mengirimkan beberapa request ke FastAPI untuk memastikan server berjalan."""
    api_url = f"http://{settings.SERVER_HOST}:{settings.SERVER_PORT}/docs"
    max_retries = 10

    print("\n🛠 Running FastAPI test...")

    for i in range(max_retries):
        try:
            response = requests.get(api_url)
            if response.status_code == 200:
                print(f"✅ FastAPI is running: {api_url}")
                return True
        except requests.ConnectionError:
            print(f"⏳ Waiting for FastAPI to start... ({i+1}/{max_retries})")
            time.sleep(2)

    print("❌ FastAPI failed to start.")
    return False

if __name__ == "__main__":
    try:
        print("🚀 Starting FastAPI Server...")
        fastapi_process = subprocess.Popen(
            [
                "uvicorn",
                "app.main:app",
                "--host", settings.SERVER_HOST,
                "--port", str(settings.SERVER_PORT),
                "--reload",
                "--workers", "2",
            ],
            stdout=None,
            stderr=None,
        )

        if test_fastapi():
            print("✅ FastAPI is running correctly.")
        else:
            print("❌ FastAPI did not start successfully.")

        fastapi_process.wait()

    except KeyboardInterrupt:
        print("\n🛑 Shutting down FastAPI...")
        fastapi_process.terminate()
        print("✅ Termination complete.")



# import uvicorn
# from app.config.config import settings


# if __name__ == "__main__":
#     try:
#         # Jalankan FastAPI
#         print("🚀 Starting FastAPI Server...")
#         uvicorn.run(
#             "app.main:app",
#             host=settings.SERVER_HOST,
#             port=settings.SERVER_PORT,
#             reload=True,
#             workers=2,
#         )
#     except KeyboardInterrupt:
#         print("🛑 Shutting down FastAPI Server...")



"""
alembic revision --autogenerate -m "Initial migration"
alembic revision --autogenerate -m "Initial annotations"
alembic upgrade head
"""

"""
https://www.svgrepo.com/show/65453/avatar.svg

"""