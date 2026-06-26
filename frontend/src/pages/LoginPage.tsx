import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/shared/api/client"

export function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get("/api/v1/auth/google/authorize")

      const { authorization_url } = response.data
      window.location.href = authorization_url
    } catch (error) {
      alert("Ошибка при подключении к бэкенду. Проверь, запущен ли сервер API.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-2 text-center text-2xl font-semibold">
          Вход в систему
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Используйте ваш аккаунт для доступа к платформе
        </p>

        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 py-5 font-medium"
          >
            {loading ? "Загрузка..." : "Войти через Google"}
          </Button>

          <Button
            variant="link"
            className="block w-full text-center text-xs text-muted-foreground"
          >
            <Link to="/" className="block w-full text-center">
              Вернуться на главную
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
