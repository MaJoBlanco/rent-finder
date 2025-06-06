from fastapi import APIRouter, Query
from typing import Optional, List
from app.database.mongo import collection
from app.models.property import Property

router = APIRouter()

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
