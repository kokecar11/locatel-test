from fastapi import APIRouter, HTTPException
from sqlalchemy import or_
from dependencies import db_dependency, bcrypt_context
from models.user import User
from schemas.user import UserBase

userRouter = APIRouter()

@userRouter.post("/user")
async def create_user(user:UserBase, db: db_dependency):
    user_exists = db.query(User).filter(or_(User.email == user.email, User.username == user.username)).first()
    if user_exists :
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = bcrypt_context.hash(user.password)
    new_user = User(
        name=user.name, 
        lastname=user.lastname, 
        username= user.username, 
        email=user.email, 
        password=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}
