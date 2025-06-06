from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str = "mongodb+srv://rentuser:12345@rentfinder-cluster.gr3nrgv.mongodb.net/?retryWrites=true&w=majority&appName=rentfinder-cluster"
    DB_NAME: str = "sample_airbnb"

settings = Settings()