import random
from fastapi import APIRouter, HTTPException, status
from typing import List
from sqlalchemy import and_

from dependencies import db_dependency, user_dependency
from models.account import Account, Transaction
from schemas.account import AccountBase, AccountCreateBase

accountRouter = APIRouter()

@accountRouter.get("/accounts")
async def get_all_accounts(user:user_dependency, db: db_dependency) -> List[AccountBase]:
    accounts = db.query(Account).filter(Account.user == user.get('id')).all()
    return [AccountBase(**account.__dict__) for account in accounts]

@accountRouter.get("/accounts/{account_number}")
async def get_account_by_number(user:user_dependency, account_number:int, db: db_dependency) -> AccountBase:
    account = db.query(Account).filter(and_(Account.account_number == str(account_number), Account.user == user.get('id'))).first()
    if not account:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    return AccountBase(account_number=account.account_number, balance=account.balance)

@accountRouter.post("/accounts")
async def create_account(user:user_dependency, db: db_dependency, account: AccountCreateBase) -> AccountBase:
    random_number_account = random.randint(1000000000, 9999999999)
    new_account = Account(account_number=random_number_account, balance=account.balance, user=user.get('id'))
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    if account.balance > 0:
        transaction = Transaction(type='deposit', account_id=new_account.id, amount=new_account.balance)
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        
    return AccountBase(account_number=new_account.account_number, balance=new_account.balance)