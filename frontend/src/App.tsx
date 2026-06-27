import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainPage } from "./pages/MainPage"
import { LoginPage } from "./pages/LoginPage"
import { AuthCallbackPage } from "./pages/AuthCallbackPage"
import { MePage } from "@/pages/MePage"
import { Navbar } from "./components/Navbar"
import { Outlet } from "react-router-dom"

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/me", element: <MePage /> },
      { path: "/auth/:provider/callback", element: <AuthCallbackPage /> }
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
