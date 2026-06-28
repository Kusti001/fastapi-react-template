import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  getOAuthUrl,
  oauthProviders,
  type OAuthProvider,
} from "@/shared/api/api"

export function LoginPage() {
  const [loading, setLoading] = useState<OAuthProvider | null>(null)

  const handleLogin = async (provider: OAuthProvider) => {
    setLoading(provider)

    try {
      const url = await getOAuthUrl(provider)
      window.location.href = url
    } catch (error) {
      console.error(error)
      alert("Failed to connect to the server")
      setLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-2 text-center text-2xl font-semibold">
          Sign in
        </h2>

        <p className="mb-6 text-center text-sm text-muted-foreground">
          Choose a sign-in method
        </p>

        <div className="space-y-3">
          {oauthProviders.map((provider) => (
            <Button
              key={provider.id}
              variant="outline"
              onClick={() => handleLogin(provider.id)}
              disabled={loading !== null}
              className="w-full py-5 font-medium"
            >
              {loading === provider.id
                ? "Loading..."
                : `Sign in with ${provider.label}`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
