import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8).max(100),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new URLSearchParams()
    formData.append("username", values.username)
    formData.append("password", values.password)
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      const data = await response.json()
      localStorage.setItem("access_token", data.access_token)
      form.reset()
      window.location.href = "/accounts"
    } catch (error) {
      console.error("Error:", error)
    }
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Inicio de sesión</CardTitle>
        <CardDescription>
          Inicia sesión para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        placeholder="maxrobinson"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        id="password"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="my-4">
                <Button type="submit" className="w-full">
                  Iniciar sesión
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="mt-4 text-center text-sm">
          ¿No tiene una cuenta?{" "}
          <Link to="/register" className="underline">
            Registro
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
