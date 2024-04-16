import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { LoginForm } from "./pages/Login"
import { SignUpForm } from "./pages/SignUp"
import { Dashboard } from "./pages/Dashboard"
import { DetailAccount } from "./pages/DetailAccount"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { PublicOnlyRoute } from "./components/PublicRoute"
import { Toaster } from "./components/ui/toaster"
import "./globals.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicOnlyRoute>
        <div className="h-screen w-full grid place-items-center">
          <LoginForm />
        </div>
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <div className="h-screen w-full grid place-items-center">
          <SignUpForm />
        </div>
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/accounts",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/account/:accountNumber",
    element: (
      <ProtectedRoute>
        <DetailAccount />
      </ProtectedRoute>
    ),
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
)
