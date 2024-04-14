from pydantic import BaseModel
# from .user import UserAccountBase

class AccountBase(BaseModel):
    account_number: str
    balance: int
    # user: UserAccountBase

class TransactionsBase(BaseModel):
    type: str
    account: int
    amount: int