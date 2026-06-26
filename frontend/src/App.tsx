import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainPage } from "./pages/MainPage"
import { LoginPage } from "./pages/LoginPage"
import { AuthCallbackPage } from "./pages/AuthCallbackPage"
import { AuthTest } from "./pages/AuthTest"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    // Сюда бэкенд будет присылать пользователя в самом конце
    path: "/auth/google/callback",
    element: <AuthCallbackPage />,
  },
  {
    // Сюда бэкенд будет присылать пользователя в самом конце
    path: "/me",
    element: <AuthTest />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
