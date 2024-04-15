from pydantic import BaseModel

class AccountBase(BaseModel):
    account_number: str
    balance: int

class TransactionsBase(BaseModel):
    type: str
    account: int
    amount: int