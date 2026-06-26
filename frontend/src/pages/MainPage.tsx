import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function MainPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <h1 className="mb-4 text-4xl font-bold">Главная страница</h1>

      <Button>
        <Link to="/login">Войти в аккаунт</Link>
      </Button>

      <Button
        variant="link"
        className="block w-full text-center text-xs text-muted-foreground"
      >
        <Link to="/me" className="block w-full text-center">
          /me
        </Link>
      </Button>
    </div>
  )
}
