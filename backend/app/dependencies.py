from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Annotated
from passlib.context import CryptContext
from jose import JWTError, jwt

from config.database import get_db
from config.settings import get_settings

settings = get_settings()

print(settings.ALLOWED_HOSTS[0])
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

db_dependency = Annotated[Session, Depends(get_db)]
def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("id")
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
        return {"username": username, "id": user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

user_dependency = Annotated[dict, Depends(get_current_user)]