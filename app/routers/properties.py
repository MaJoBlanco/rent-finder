from fastapi import APIRouter
from app.crud import property_crud as crud

router = APIRouter(prefix="/properties", tags=["properties"])

@router.post("/")
async def create_property(property: dict):
    return await crud.create_property(property)

@router.get("/")
async def get_properties():
    return await crud.get_all_properties()
