from pydantic import BaseModel

class PropertyBase(BaseModel):
    title: str
    description: str
    price: float
    city: str
    address: str

class PropertyCreate(PropertyBase):
    pass

class PropertyOut(PropertyBase):
    id: int

    class Config:
        orm_mode = True
