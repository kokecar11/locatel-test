from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import account as account_model, user as user_model
from routers.transactions import transactionsRouter
from routers.account import accountRouter
from routers.user import userRouter
from routers.auth import authRouter
from config.database import engine

app = FastAPI()

origins = [
    "http://localhost:5173",
]

account_model.Base.metadata.create_all(bind=engine)
user_model.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins, 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"])

app.include_router(transactionsRouter, prefix="/api/v1", tags=["Transactions"])
app.include_router(accountRouter, prefix="/api/v1", tags=["Account"])
app.include_router(userRouter, prefix="/api/v1", tags=["User"])
app.include_router(authRouter, prefix="/api/v1", tags=["Auth"])