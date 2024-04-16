// import { DollarSign } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
interface CardAccountProps {
  balance: number
  accountNumber: string
}

export default function CardAccount({
  balance = 0,
  accountNumber: accountNumber = "0000000000",
}: CardAccountProps) {
  return (
    <Link to={`/account/${accountNumber}`}>
      <Card className="hover:shadow-slate-700 transition-all ">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cuenta de ahorros
          </CardTitle>
          <CardTitle className="text-sm font-light">
            No. {accountNumber}
          </CardTitle>
          {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${balance}</div>
          <p className="text-xs text-muted-foreground">Disponible</p>
        </CardContent>
      </Card>
    </Link>
  )
}
