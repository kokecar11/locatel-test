import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import CardAccount from "./CardAccount"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { CreateTransactionForm } from "../transactions/CreateTransaction"
import { DataTable } from "../transactions/DataTable"
import { Transaction, columns } from "../transactions/Columns"

export function DetailAccount() {
  const { accountNumber } = useParams<{ accountNumber: string }>()
  const [account, setAccount] = useState<{
    balance: number
    accountNumber: string
  }>({
    balance: 0,
    accountNumber: "0000000000",
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/accounts/${accountNumber}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              accept: "application/json",
            },
          }
        )
        const data = await response.json()
        setAccount({
          balance: data.balance,
          accountNumber: data.account_number,
        })
      } catch (error) {
        console.error("Error:", error)
      }
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/transactions?account_number=${accountNumber}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              accept: "application/json",
            },
          }
        )
        const data = await response.json()
        setTransactions(data)
      } catch (error) {
        console.error("Error:", error)
      }
    }

    fetchAccount()
    fetchTransactions()
  }, [accountNumber, account.balance])

  return (
    <div className="h-screen w-full container">
      <h1 className="text-4xl text-center mt-10 font-bold">
        Detalle de la cuenta de ahorros
      </h1>
      <div className="grid my-8 gap-4">
        <div className="flex justify-end space-x-2">
          <CreateTransactionForm type="deposit" accountNumber={accountNumber} />
          <CreateTransactionForm
            type="withdraw"
            accountNumber={accountNumber}
          />
        </div>
      </div>
      <div className="flex justify-center w-full space-x-4">
        <div className="w-1/2">
          <CardAccount
            accountNumber={account.accountNumber}
            balance={account.balance}
          />
        </div>
        <div className="w-full">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transacciones
              </CardTitle>
              <CardTitle className="text-sm font-light">
                No. {accountNumber}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={transactions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
