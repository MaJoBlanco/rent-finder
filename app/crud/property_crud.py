from app.database import mongo
from bson import ObjectId

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
    result = await mongo.collection.update_one(
        {"_id": ObjectId(property_id)},
        {"$set": updated_data}
    )

    if result.modified_count == 0:
        return None

    updated_doc = await mongo.collection.find_one({"_id": ObjectId(property_id)})
    return updated_doc


async def delete_property(property_id: str):
    result = await mongo.collection.delete_one({"_id": ObjectId(property_id)})
    return result.deleted_count > 0


