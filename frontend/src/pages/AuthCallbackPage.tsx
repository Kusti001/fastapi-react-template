import { useEffect, useRef } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { apiClient } from "@/shared/api/client"

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const isSent = useRef(false)

  useEffect(() => {
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code || !state || isSent.current) return

    isSent.current = true

    const exchangeCode = async () => {
      try {
        const response = await apiClient.get("/api/v1/auth/google/callback", {
          params: { code, state },
        })

        const token = response.data.token || response.data.access_token

        if (token) {
          localStorage.setItem("token", token)
          console.log("Авторизация успешна!")
          navigate("/", { replace: true })
        } else {
          throw new Error("Токен не пришел в ответе бэкенда")
        }
      } catch (error) {
        console.error("Ошибка на бэкенде:", error)
        setTimeout(() => navigate("/login", { replace: true }), 2000)
      }
    }

    exchangeCode()
  }, [searchParams, navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="mt-4 animate-pulse text-sm text-muted-foreground">
        Проверяем сессию Google...
      </p>
    </div>
  )
}
