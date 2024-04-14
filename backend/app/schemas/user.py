from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    lastname: str
    email: str
    username: str
    password: str

class UserAccountBase(BaseModel):
    name: str
    lastname: str
    email: str