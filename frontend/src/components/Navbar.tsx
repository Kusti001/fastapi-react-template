import { Link } from "react-router-dom"
import { LogoutButton } from "@/components/LogoutButton"

export function Navbar() {
  return (
    <div className="flex gap-4 border-b p-3">
      <Link to="/">Home</Link>

      <Link to="/me">Me</Link>
      <LogoutButton />

      <Link to="/login">Login</Link>
    </div>
  )
}
