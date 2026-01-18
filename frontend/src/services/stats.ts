export interface DashboardData {
  totalPrompts: number;
  totalTokens: number;
  totalCost: number;
  avgCost: number;

  costOverTime: Array<{ date: string; cost: number }>;
  costByModel: Array<{ model: string; cost: number }>;
  tokensByModel: Array<{
    model: string;
    input_tokens: number;
    output_tokens: number;
  }>;

  avgLatencyByModel: Array<{
    model: string;
    avg_latency_ms: number;
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchDashboardData(): Promise<DashboardData> {
  const res = await fetch(`${API_BASE_URL}/api/prompts/dashboard`);

  if (!res.ok) {
    throw new Error(`Dashboard API Fehler (${res.status})`);
  }

  const data: DashboardData = await res.json();
  return data;
}
