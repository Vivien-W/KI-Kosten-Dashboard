const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ModelEntry {
  model: string;
  input_price_per_million: number;
  output_price_per_million: number;
}

export interface SimulateResponse {
  prompt: string;
  response: string;
  model: string;
  latency_ms: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  success: boolean;
}

export async function fetchModels(): Promise<ModelEntry[]> {
  const res = await fetch(`${API_BASE_URL}/api/prompts/models`);
  if (!res.ok) throw new Error("Model fetch failed");
  return res.json();
}

export async function simulatePrompt(
  prompt: string,
  model: string,
): Promise<SimulateResponse> {
  const res = await fetch(`${API_BASE_URL}/api/prompts/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model }),
  });

  if (!res.ok) throw new Error("Simulation failed");

  const json = await res.json();
  return json.data;
}
