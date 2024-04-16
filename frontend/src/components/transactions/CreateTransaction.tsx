import { Minus, Plus } from "lucide-react"
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
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "../ui/use-toast"

const formSchema = z.object({
  amount: z.coerce.number().positive().nonnegative(),
})

interface CreateTransactionFormProps {
  accountNumber?: string
  type: "deposit" | "withdraw"
}

export function CreateTransactionForm({
  accountNumber,
  type,
}: CreateTransactionFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const dataAdapted = {
      account_number: Number(accountNumber!),
      amount: values.amount,
      type: type,
    }

    const jsonData = JSON.stringify(dataAdapted)
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: jsonData,
        }
      )
      await response.json()
      form.reset()
      setOpen(false)
      toast({
        title: "Transacción exitosa",
        description: `Se ha realizado ${
          type === "deposit" ? "un deposito" : "un retiro"
        } de $ ${values.amount} correctamente`,
      })
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          {type === "deposit" ? (
            <Plus className="mr-2 h-4 w-4" />
          ) : (
            <Minus className="mr-2 h-4 w-4" />
          )}{" "}
          {type === "deposit" ? "Depositar dinero" : "Retirar dinero"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "deposit" ? "Depositar" : "Retirar"}
          </DialogTitle>
          <DialogDescription>
            Realice {type === "deposit" ? "depositos" : "retiros"} de su cuenta
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
                      placeholder="Monto a retirar"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ingrese el monto a{" "}
                    {type === "deposit" ? "depositar" : "retirar"}.
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
                {type === "deposit" ? "Depositar" : "Retirar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
