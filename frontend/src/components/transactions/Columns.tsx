import { ColumnDef } from "@tanstack/react-table"
export type Transaction = {
  id: string
  amount: number
  type: "withdraw" | "deposit"
}

// export const transaction: Payment[] = [
//   {
//     id: "728ed52f",
//     amount: 100,
//     type: "withdraw",
//   },
//   {
//     id: "489e1d42",
//     amount: 125,
//     type: "deposit",
//   },
// ]

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left">Id</div>,
  },
  //   {
  //     accessorKey: "type",
  //     header: () => <div className="">Tipo de transaccion</div>,
  //     cell: ({ row }) => {
  //       const type = row.getValue("type")

  //       if (type === "withdraw") {
  //         return <div className="font-medium">Retiro</div>
  //       }
  //       return <div className="font-medium">Deposito</div>
  //       //   return <div className="font-medium">{type}</div>
  //     },
  //   },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
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
