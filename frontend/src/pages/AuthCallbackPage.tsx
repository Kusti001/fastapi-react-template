// AuthCallbackPage.tsx
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  exchangeOAuthCode,
  oauthProviders,
  type OAuthProvider,
} from "@/shared/api/api"
import { useEffect, useRef } from "react"

export function AuthCallbackPage() {
  const { provider } = useParams<{ provider: OAuthProvider }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isSent = useRef(false)

  useEffect(() => {
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    const validProviders = oauthProviders.map((p) => p.id)

    if (!provider || !validProviders.includes(provider)) {
      navigate("/login", { replace: true })
      return
    }

    if (!code || !state || isSent.current) return
    isSent.current = true

    exchangeOAuthCode(provider, code, state)
      .then((token) => {
        localStorage.setItem("token", token)
        navigate("/", { replace: true })
      })
      .catch((err) => {
        console.error(err)
        setTimeout(() => navigate("/login", { replace: true }), 2000)
      })
  }, [searchParams, navigate, provider])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 animate-pulse text-sm text-muted-foreground">
        Проверяем сессию {provider}...
      </p>
    </div>
  )
}
