// src/services/api.ts
export interface DashboardApiResponse {
  totalPrompts: number;
  totalTokens: number;
  totalCost: number;
  avgCost: number;
  costOverTime: Array<{ date: string; cost: number }>;
  costByModel: Array<{ model: string; cost: number }>;
  tokensByModel: Array<{ model: string; tokens: number }>;
  successRate: { success: number; error: number };
}

const API_BASE = "http://localhost:4000/api";

export async function fetchDashboardData(): Promise<DashboardApiResponse> {
  const res = await fetch(`${API_BASE}/dashboard`);

  if (!res.ok) {
    throw new Error("Fehler beim Abrufen der Dashboard-Daten");
  }

  return res.json();
}
