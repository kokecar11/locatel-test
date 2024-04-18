import { useEffect } from "react"
import useGlobalContext from "@/context/useGlobalContext"
import CardAccount from "@/components/account/CardAccount"
import { CreateAccountForm } from "@/components/account/CreateAccountForm"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  const { accounts, setAccounts } = useGlobalContext()
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/accounts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            accept: "application/json",
          },
        })
        const data = await response.json()
        const dataAdapted = data.map(
          (account: {
            id: number
            balance: number
            account_number: string
          }) => ({
            id: account.id,
            balance: account.balance,
            accountNumber: account.account_number,
          })
        )

        setAccounts(dataAdapted)
      } catch (error) {
        console.error("Error:", error)
      }
    }

    fetchAccounts()
  }, [setAccounts])

  return (
    <div className="h-screen w-full container">
      <h1 className="text-4xl text-center mt-10 font-bold">
        Mis cuentas de ahorro
      </h1>
      <div className="flex w-full my-8 space-x-2">
        <CreateAccountForm />
        <div className="flex-none">
          <Button
            variant={"destructive"}
            onClick={() => {
              localStorage.removeItem("access_token")
              window.location.href = "/"
            }}
          >
            Cerrar sesion
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {accounts.map((account) => (
          <CardAccount
            key={account.accountNumber}
            accountNumber={account.accountNumber}
            balance={account.balance}
          />
        ))}
      </div>
    </div>
  )
}
