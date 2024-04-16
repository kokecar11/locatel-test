from pydantic import BaseModel

class AccountBase(BaseModel):
    account_number: str
    balance: int

class AccountCreateBase(BaseModel):
    balance: int

class TransactionsBase(BaseModel):
    type: str
    account_number: int
    amount: int
    created_at: str

class TransactionsList(TransactionsBase):
    id: int

class TransactionCreateBase(BaseModel):
    type: str
    amount: int
    account_number: int