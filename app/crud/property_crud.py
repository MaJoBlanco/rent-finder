from app.database import mongo

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
