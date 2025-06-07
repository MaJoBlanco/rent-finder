import decimal
from typing import Optional, Dict, Any

from fastapi import FastAPI, HTTPException, status

from app.database import mongo
from app.models.property import Property, PaginatedPropertyResponse, PaginationInfo

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hola desde FastAPI!"}


def parse_property(doc: Dict[str, Any]) -> Dict[str, Any]:
    # Convierte ObjectId y Decimal128 a tipos compatibles
    doc["_id"] = str(doc["_id"])
    if "bathrooms" in doc and isinstance(doc["bathrooms"], decimal.Decimal):
        doc["bathrooms"] = float(doc["bathrooms"])
    if "price" in doc and isinstance(doc["price"], decimal.Decimal):
        doc["price"] = str(doc["price"])
    return doc


async def get_paginated_properties(
        query: Dict[str, Any],
        page: int,
        page_size: int
) -> PaginatedPropertyResponse:
    skip = (page - 1) * page_size
    total_count = await mongo.collection.count_documents(query)
    results = []
    cursor = mongo.collection.find(query).skip(skip).limit(page_size)
    async for doc in cursor:
        doc = parse_property(doc)
        property_instance = Property(**doc)
        results.append(property_instance)
    pagination = PaginationInfo(
        page=page,
        page_size=page_size,
        total_count=total_count,
        total_pages=(total_count + page_size - 1) // page_size,
        has_next=page * page_size < total_count,
        has_previous=page > 1
    )
    return PaginatedPropertyResponse(
        pagination=pagination,
        properties=results
    )


@app.get("/search", response_model=PaginatedPropertyResponse)
async def search_properties(
        property_type: Optional[str] = None,
        min_bedrooms: Optional[int] = None,
        max_price: Optional[float] = None,
        page: int = 1,
        page_size: int = 10
):
    query = {}
    if property_type:
        query["property"] = property_type  # Usamos "property" como está en la BD
    if min_bedrooms:
        query["bedrooms"] = {"$gte": min_bedrooms}
    if max_price:
        query["price"] = {
            "$lte": max_price}  # Pero cuidado: el campo price es un string tipo "$120.00", habría que convertirlo si quieres filtrar bien
    return await get_paginated_properties(query, page, page_size)


@app.get("/properties", response_model=PaginatedPropertyResponse)
async def get_all_properties(
        page: int = 1,
        page_size: int = 10
):
    """Obtiene todas las propiedades sin filtros"""
    return await get_paginated_properties({}, page, page_size)


@app.post("/properties", response_model=Property, status_code=status.HTTP_201_CREATED)
async def create_property(property_in: Property):
    property_dict = property_in.model_dump(by_alias=True, exclude_unset=True)
    property_dict.pop("id", None)  # No guardar el campo id, Mongo usa _id
    result = await mongo.collection.insert_one(property_dict)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="No se pudo crear la propiedad")
    property_dict["_id"] = str(result.inserted_id)
    return Property(**property_dict)