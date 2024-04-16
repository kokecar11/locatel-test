import React, { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

type PublicOnlyRouteProps = {
  children: ReactNode
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const token = localStorage.getItem("access_token")
  const navigate = useNavigate()

  React.useEffect(() => {
    if (token) {
      navigate("/accounts")
    }
  }, [token, navigate])

  return !token ? children : null
}
