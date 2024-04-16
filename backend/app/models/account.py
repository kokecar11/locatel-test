from datetime import datetime
from config.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy import Enum as SQLEnum
from enum import Enum

class Account(Base):
    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String, unique=True, index=True)
    user = Column(Integer, ForeignKey('users.id'))
    balance = Column(Integer)

class TransactionType(Enum):
    deposit = "deposit"
    withdraw = "withdraw"

class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True, index=True)
    type = Column(SQLEnum(TransactionType, name="transaction_type"))
    account_id = Column(Integer, ForeignKey('accounts.id'))
    created_at =  Column(DateTime, default=datetime.utcnow)
    amount = Column(Integer)

