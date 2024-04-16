import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import useGlobalContext from "@/context/useGlobalContext"

import { Wallet } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

import { useToast } from "../ui/use-toast"

const formSchema = z.object({
  amount: z.coerce.number().nonnegative().optional(),
})

export function CreateAccountForm() {
  const { setAccounts } = useGlobalContext()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  })

  const fetchAccounts = async () => {
    const response = await fetch("http://localhost:8000/api/v1/accounts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        accept: "application/json",
      },
    })
    const data = await response.json()
    const dataAdapted = data.map(
      (account: { id: number; balance: number; account_number: string }) => ({
        id: account.id,
        balance: account.balance,
        accountNumber: account.account_number,
      })
    )
    setAccounts(dataAdapted)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const dataAdapted = {
      balance: values.amount,
    }

    const jsonData = JSON.stringify(dataAdapted)
    try {
      const response = await fetch("http://localhost:8000/api/v1/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: jsonData,
      })
      await response.json()
      form.reset()
      fetchAccounts()
      setOpen(false)
      toast({
        title: "Cuenta creada",
        description: "La cuenta se ha creado correctamente",
      })
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <Wallet className="w-4 h-4 mr-1" />
          Crear cuenta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Cuenta de ahorros</DialogTitle>
          <DialogDescription>
            Complete el formulario para crear una cuenta de ahorros y agregue un
            monto
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Monto a depositar"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ingrese el monto a depositar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <DialogClose asChild>
                <Button className="w-full" variant={"outline"} type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button className="w-full" variant={"default"} type="submit">
                Crear cuenta
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
