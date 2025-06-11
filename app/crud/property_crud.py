# /app/crud/property_crud.py
from app.database import mongo
from bson import ObjectId

def parse_id(property_id: str):
    """Convierte string a ObjectId si aplica"""
    return ObjectId(property_id) if ObjectId.is_valid(property_id) and len(property_id) == 24 else property_id

async def create_property(property_data: dict):
    result = await mongo["properties"].insert_one(property_data)
    new_property = await mongo["properties"].find_one({"_id": result.inserted_id})
    return new_property

async def get_all_properties():
    properties = []
    cursor = mongo["properties"].find({})
    async for document in cursor:
        properties.append(document)
    return properties


async def update_property(property_id: str, updated_data: dict):
    query_id = parse_id(property_id)
    result = await mongo.collection.update_one(
        {"_id": query_id},
        {"$set": updated_data}
    )

    if result.modified_count == 0:
        return None

    updated_doc = await mongo.collection.find_one({"_id": parse_id(property_id)})
    return updated_doc

async def delete_property(property_id: str):
    query_id = parse_id(property_id)
    result = await mongo.collection.delete_one({"_id": parse_id(property_id)})
    return result.deleted_count > 0


