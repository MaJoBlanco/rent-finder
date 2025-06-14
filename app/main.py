# /app/main.py
import decimal
from typing import Optional, Dict, Any

from fastapi import FastAPI, HTTPException, status

from app.database import mongo
from app.models.property import Property, PaginatedPropertyResponse, PaginationInfo
from app.routers import properties
from app.crud.property_crud import update_property, delete_property

from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Dirección del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hola desde FastAPI!"}

def parse_id(property_id: str):
    return ObjectId(property_id) if ObjectId.is_valid(property_id) and len(property_id) == 24 else property_id

def parse_property(doc: Dict[str, Any]) -> Dict[str, Any]:
    # Convierte ObjectId y Decimal128 a tipos compatibles
    doc["_id"] = str(doc["_id"])
    if "bathrooms" in doc and isinstance(doc["bathrooms"], decimal.Decimal):
        doc["bathrooms"] = float(doc["bathrooms"])
    if "price" in doc and isinstance(doc["price"], decimal.Decimal):
        doc["price"] = str(doc["price"])
        # Extrae images.picture_url y lo mapea a pictures_url
    if "images" in doc and isinstance(doc["images"], dict):
        doc["picture_url"] = doc["images"].get("picture_url")
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
        name: Optional[str] = None,
        id: Optional[str] = None,
        min_bedrooms: Optional[int] = None,
        max_price: Optional[float] = None,
        bathrooms: Optional[float] = None,
        page: int = 1,
        page_size: int = 10
):
    query = {}
    if property_type:
        query["property_type"] = property_type  # Usamos "property" como está en la BD
    if name:
        query["name"] = name
    if id:
        query["_id"] = parse_id(id)
        return await get_paginated_properties(query, 1, 1)
    if min_bedrooms:
        query["bedrooms"] = {"$gte": min_bedrooms}
    if max_price:
        query["price"] = {
            "$lte": max_price}  # Pero cuidado: el campo price es un string tipo "$120.00", habría que convertirlo si quieres filtrar bien
    if bathrooms is not None:
        query["bathrooms"] = bathrooms
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

@app.put("/properties/{property_id}", response_model=Property)
async def update_existing_property(property_id: str, updated_data: dict):
    updated = await update_property(property_id, updated_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada o sin cambios")
    updated["_id"] = str(updated["_id"])
    return updated

@app.delete("/properties/{property_id}")
async def delete_existing_property(property_id: str):
    success = await delete_property(property_id)
    if not success:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    return {"message": "Propiedad eliminada exitosamente"}

@app.get("/properties/{property_id}", response_model=Property)
async def get_property_by_id(property_id: str):
    query_id = parse_id(property_id)
    result = await mongo.collection.find_one({"_id": parse_id(property_id)})
    if not result:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    result["_id"] = str(result["_id"])
    return Property(**result)