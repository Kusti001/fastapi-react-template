import { logout } from "@/shared/api/api"
import { useNavigate } from "react-router-dom"

export function LogoutButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => {
        logout()
        navigate("/login")
      }}
    >
      Logout
    </button>
  )
}