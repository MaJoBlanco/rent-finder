# /app/routers/properties.py
from fastapi import APIRouter, Query
from typing import Optional, List
from app.database.mongo import collection
from app.models.property import Property
from fastapi import HTTPException
from bson import ObjectId
from app.crud.property_crud import update_property, delete_property


router = APIRouter()

def parse_id(property_id: str):
    return ObjectId(property_id) if ObjectId.is_valid(property_id) and len(property_id) == 24 else property_id

@router.get("/properties", response_model=List[Property])
async def get_properties(
    property_type: Optional[str] = None,
    min_bedrooms: Optional[int] = None,
    max_price: Optional[float] = None
):
    query = {}

    if property_type:
        query["property_type"] = property_type

    if min_bedrooms:
        query["bedrooms"] = {"$gte": min_bedrooms}

    if max_price:
        try:
            query["price"] = {
                "$lte": f"${max_price:.2f}"  # Mongo Atlas los guarda como "$123.00"
            }
        except Exception:
            pass

    results = []
    cursor = collection.find(query).limit(10)
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)

    return results




