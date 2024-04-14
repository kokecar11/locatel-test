from fastapi import APIRouter, HTTPException, status
from sqlalchemy import update, and_

from dependencies import db_dependency, user_dependency
from models.account import Transaction, Account
from schemas.account import TransactionsBase

transactionsRouter = APIRouter()

@transactionsRouter.get("/transactions")
async def get_all_transactions_by_account(user:user_dependency, account_number: int, db: db_dependency)  -> list[TransactionsBase]:
    account = db.query(Account).filter(and_(Account.account_number == str(account_number), Account.user == user.get('id'))).first()
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    transantions = db.query(Transaction).filter(Transaction.account == account.id).all()
    return transantions

@transactionsRouter.get("/transactions/{transaction_id}")
async def get_transaction_by_id(user: user_dependency, account_number: int, transaction_id:int, db: db_dependency) -> TransactionsBase:
    account = db.query(Account).filter(and_(Account.account_number == str(account_number), Account.user == user.get('id'))).first()
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    transantion = db.query(Transaction).filter(Transaction.account == account.id, Transaction.id == transaction_id).first()
    if not transantion:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transantion

@transactionsRouter.post("/transactions")
async def create_transaction(user: user_dependency, transaction: TransactionsBase, db: db_dependency) -> TransactionsBase:
    account = db.query(Account).filter(and_(Account.account_number == str(transaction.account), Account.user == user.get('id'))).first()
    if not account:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    
    if transaction.type == "withdraw" and account.balance < transaction.amount:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient funds")
    # if transaction.type == "withdraw":
    #     account.balance -= transaction.amount
    # if transaction.type == "deposit":
    #     account.balance += transaction.amount
    account.balance += transaction.amount if transaction.type == "deposit" else -transaction.amount

    db_transaction = Transaction(type=transaction.type, account=account.id, amount=transaction.amount)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    stmt = (
        update(Account).
        where(Account.account_number == str(transaction.account)).
        values(balance=account.balance)
    )
    db.execute(stmt)
    db.commit()
    return transaction


