import { apiClient } from "@/shared/api/client"

// --- Types ---

export interface User {
  id: string
  email: string
  is_active: boolean
}

// --- Auth ---

export const oauthProviders = [
  { id: "google", label: "Google" },
] as const

export type OAuthProvider = typeof oauthProviders[number]["id"]

export async function getOAuthUrl(provider: OAuthProvider): Promise<string> {
  const response = await apiClient.get<{ authorization_url: string }>(
    `/api/v1/auth/${provider}/authorize`
  )
  return response.data.authorization_url
}

export async function exchangeOAuthCode(
  provider: OAuthProvider,
  code: string,
  state: string
): Promise<string> {
  const response = await apiClient.get<{
    token?: string
    access_token?: string
  }>(`/api/v1/auth/${provider}/callback`, { params: { code, state } })

  const token = response.data.token ?? response.data.access_token
  if (!token) throw new Error("No token in response")

  return token
}

export function logout() {
  localStorage.removeItem("token")
}

export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Unauthorized — please sign in")

  const response = await apiClient.get<User>("/api/v1/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.data
}
