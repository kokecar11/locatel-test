import { useEffect, useState } from "react"
import CardAccount from "@/components/account/CardAccount"
import { CreateAccountForm } from "@/components/account/CreateAccountForm"

export function Dashboard() {
  const [accounts, setAccounts] = useState<
    { id: number; balance: number; accountNumer: string }[]
  >([])

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
            accountNumer: account.account_number,
          })
        )

        setAccounts(dataAdapted)
      } catch (error) {
        console.error("Error:", error)
      }
    }

    fetchAccounts()
  }, [])

  return (
    <div className="h-screen w-full container">
      <h1 className="text-4xl text-center mt-10 font-bold">
        Mis cuentas de ahorro
      </h1>
      <div className="flex w-full my-8">
        <CreateAccountForm />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {accounts.map((account) => (
          <CardAccount
            key={account.accountNumer}
            accountNumber={account.accountNumer}
            balance={account.balance}
          />
        ))}
      </div>
    </div>
  )
}

{
  /* <div className="w-1/2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Cuentas</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-center">
                  <Button className="w-1/2">Crear cuenta</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */
}
