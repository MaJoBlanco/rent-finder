from pydantic import BaseModel, Field
from typing import Optional, List

class Property(BaseModel):
    id: Optional[str] = Field(alias="_id")  # Mongo usa _id como id
    name: Optional[str]
    summary: Optional[str]
    property_type: Optional[str]
    bedrooms: Optional[int]
    bathrooms: Optional[float]
    price: Optional[str]
    address: Optional[dict]
    amenities: Optional[List[str]]
    picture_url: Optional[str] = Field(default=None)

    class Config:
        allow_population_by_field_name = True  # Permite usar "id" en vez de "_id"

