import { useEffect, useState } from "react";
import { apiClient } from "@/shared/api/client";

interface UserData {
  id: string;
  email: string;
  is_active: boolean;
}

export function MePage() {
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Error: No token in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<UserData>("/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setData(response.data);
        setError(null);
      } catch (err: any) {
        if (err.response) {
          const detail = err.response.data?.detail || err.response.statusText;
          setError(`Backend error: ${err.response.status} — ${detail}`);
        } else {
          setError("Network error (CORS or connection issue)");
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border bg-background p-4 text-sm">
        ⏳ Checking JWT-token...
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-background p-6 shadow-sm max-w-md mx-auto my-4">
      <h3 className="text-lg font-semibold mb-4">Auth Status</h3>
      
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded border border-destructive/20">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b pb-1">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-mono">{data.id}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{data.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className={data.is_active ? "text-emerald-500 font-medium" : "text-amber-500"}>
              {data.is_active ? "active" : "no active"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
