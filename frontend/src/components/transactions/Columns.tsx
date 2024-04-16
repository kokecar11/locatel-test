import { ColumnDef } from "@tanstack/react-table"
export type Transaction = {
  id: string
  amount: number
  created_at: string
  type: "withdraw" | "deposit"
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left">Id</div>,
  },
  {
    accessorKey: "created_at",
    header: () => <div className="">Fecha</div>,
    cell: ({ row }) => {
      const date: string = row.getValue("created_at")
      return (
        <div className="font-medium">{new Date(date).toLocaleString()}</div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Cantidad</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      if (row.original.type === "withdraw") {
        return (
          <div className="text-right font-medium text-red-500">
            - {formatted}
          </div>
        )
      }
      return (
        <div className="text-right font-medium text-green-500">
          + {formatted}
        </div>
      )
    },
  },
]
