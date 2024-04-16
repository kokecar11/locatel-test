from fastapi import APIRouter, HTTPException, status
from sqlalchemy import update, and_, desc

from dependencies import db_dependency, user_dependency
from models.account import Transaction, Account
from schemas.account import TransactionsBase, TransactionsList, TransactionCreateBase

transactionsRouter = APIRouter()

@transactionsRouter.get("/transactions")
async def get_all_transactions_by_account(user:user_dependency, account_number: int, db: db_dependency)  -> list[TransactionsList]:
    account = db.query(Account).filter(and_(Account.account_number == str(account_number), Account.user == user.get('id'))).first()
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    transactions = db.query(Transaction).filter(Transaction.account_id == account.id).order_by(desc(Transaction.created_at)).all()
    return [TransactionsList(
        id=transaction.id,
        amount=transaction.amount,
        type=transaction.type,
        account_number=account_number,
        created_at=transaction.created_at.isoformat()) for transaction in transactions]

@transactionsRouter.get("/transactions/{transaction_id}")
async def get_transaction_by_id(user: user_dependency, account_number: int, transaction_id:int, db: db_dependency) -> TransactionsBase:
    account = db.query(Account).filter(and_(Account.account_number == str(account_number), Account.user == user.get('id'))).first()
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    transantion = db.query(Transaction).filter(Transaction.account == account.id, Transaction.id == transaction_id).first()
    if not transantion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transantion

@transactionsRouter.post("/transactions")
async def create_transaction(user: user_dependency, transaction: TransactionCreateBase, db: db_dependency) -> TransactionsBase:
    account = db.query(Account).filter(and_(Account.account_number == str(transaction.account_number), Account.user == user.get('id'))).first()
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    
    if transaction.type == "withdraw" and account.balance < transaction.amount:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient funds")
    
    account.balance += transaction.amount if transaction.type == "deposit" else -transaction.amount
    db_transaction = Transaction(type=transaction.type, account_id=account.id, amount=transaction.amount)
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    stmt = (
        update(Account).
        where(Account.account_number == str(transaction.account_number)).
        values(balance=account.balance)
    )
    db.execute(stmt)
    db.commit()
    return TransactionsBase(type=db_transaction.type, account_number=transaction.account_number, amount=db_transaction.amount, created_at=db_transaction.created_at.isoformat())


