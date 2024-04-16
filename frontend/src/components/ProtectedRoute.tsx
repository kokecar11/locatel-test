// Componente de orden superior para proteger las rutas
import React, { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
type ProtectedRouteProps = {
  children: ReactNode
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("access_token")
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!token) {
      navigate("/")
    }
  }, [token, navigate])

  return token ? children : null
}
