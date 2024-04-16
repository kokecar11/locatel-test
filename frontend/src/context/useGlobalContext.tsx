import { Transaction } from "@/components/transactions/Columns"
import create from "zustand"

export type Account = {
  id: number
  balance: number
  accountNumber: string
}

type GlobalContext = {
  account: Account
  accounts: Account[]
  transactions: Transaction[]
  setAccount: (account: Account) => void
  setAccounts: (accounts: Account[]) => void
  setTransactions: (transactions: Transaction[]) => void
}

const useGlobalContext = create<GlobalContext>((set) => ({
  account: {
    id: 0,
    balance: 0,
    accountNumber: "0000000000",
  },
  accounts: [],
  transactions: [],
  setAccount: (account) => set({ account }),
  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
}))

export default useGlobalContext
