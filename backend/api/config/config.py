import os
from dotenv import load_dotenv

load_dotenv()

OPEN_ROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")
GITHUB_API_TOKEN = os.getenv("GITHUB_API_TOKEN")
DATABASE_URL = os.getenv("DATABASE_URL")
HUGGING_FACE_API = os.getenv("HUGGING_FACE_API")