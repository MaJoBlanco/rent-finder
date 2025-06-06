from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from bson import Decimal128

class Location(BaseModel):
    type: Optional[str] = None
    coordinates: Optional[List[float]] = None
    is_location_exact: Optional[bool] = None

class Address(BaseModel):
    street: Optional[str] = None
    suburb: Optional[str] = None
    government_area: Optional[str] = None
    market: Optional[str] = None
    country: Optional[str] = None
    country_code: Optional[str] = None
    location: Optional[Location] = None

class Property(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")

    name: str # Título de la propiedad
    summary: Optional[str] # Descripción breve de la propiedad

    # AHORA los siguientes campos tendrán default=None → dejan de ser “requeridos”
    property_type: Optional[str] = Field(alias="property", default=None)
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    price: Optional[str] = None
    address: Optional[Address] = None
    pictures_url: Optional[str] = Field(alias="images.pictures_url", default=None)
    amenities: Optional[List[str]] = None
    review_scores_rating: Optional[float] = Field(alias="review_scores.review_scores_rating", default=None)

    # Validadores de Decimal128 (no cambian):
    @field_validator("bathrooms", mode="before")
    @classmethod
    def _normalize_bathrooms(cls, v):
        if isinstance(v, Decimal128):
            return float(v.to_decimal())
        return v

    @field_validator("price", mode="before")
    @classmethod
    def _normalize_price(cls, v):
        if isinstance(v, Decimal128):
            return str(v.to_decimal())
        return v

    class Config:
        populate_by_name = True  # Nuevo nombre en Pydantic V2

class PaginationInfo(BaseModel):
    page: int
    page_size: int
    total_count: int
    total_pages: int
    has_next: bool
    has_previous: bool

class PaginatedPropertyResponse(BaseModel):
    pagination: PaginationInfo
    properties: List[Property]