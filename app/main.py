from typing import Optional

from fastapi import FastAPI
from app.routers import properties
from app.database import mongo
app = FastAPI()
app.include_router(properties.router)

@app.get("/")
def root():
    return {"message": "Hola desde FastAPI!"}

@app.get("/search")
async def search_properties(
    property_type: Optional[str] = None,
    min_bedrooms: Optional[int] = None,
    max_price: Optional[float] = None
):
    query = {}

    if property_type:
        query["property_type"] = property_type

    if min_bedrooms:
        query["bedrooms"] = { "$gte": min_bedrooms }

    if max_price:
        query["price"] = { "$lte": max_price }

    # Pero cuidado: el campo `price` es un string tipo "$120.00", habría que convertirlo si quieres filtrar bien

    results = []
    cursor = mongo.collection.find(query).limit(10)
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])  # Convertimos ObjectId a string
        results.append(doc)

    return results


