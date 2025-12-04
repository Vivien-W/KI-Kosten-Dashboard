import { useEffect, useState } from "react";

interface ModelEntry {
  model: string;
  input_price_per_million: number;
  output_price_per_million: number;
}

interface SimulateResponse {
  prompt: string;
  response: string;
  model: string;
  latency_ms: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: string;
  success: boolean;
}

export default function PromptInput() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState<ModelEntry[]>([]);
  const [result, setResult] = useState<SimulateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // ---- Modelle vom Backend laden ----
  useEffect(() => {
    fetch("http://localhost:4000/api/prompts/models")
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        if (data.length > 0) setModel(data[0].model);
      })
      .catch((err) =>
        console.error("Modelle konnten nicht geladen werden:", err)
      );
  }, []);

  // ---- Prompt Simulation senden ----
  async function sendPrompt() {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:4000/api/prompts/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });

      const data = await res.json();
      setResult(data.data);
    } catch (err) {
      console.error("Fehler:", err);
    }

    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700 space-y-4">
      <h2 className="text-2xl font-semibold text-black dark:text-white">
        Prompt Simulation
      </h2>

      {/* Prompt Input */}
      <textarea
        className="w-full p-3 border rounded-xl bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        rows={4}
        placeholder="Prompt eingeben..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Modell-Auswahl */}
      <select
        className="p-3 border rounded-xl bg-gray-100 dark:bg-gray-800 text-black dark:text-white w-full"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        {models.length === 0 && <option>Modelle werden geladen...</option>}

        {models.map((m) => (
          <option key={m.model} value={m.model}>
            {m.model}
          </option>
        ))}
      </select>

      {/* Button */}
      <button
        onClick={sendPrompt}
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500"
      >
        {loading ? "Simuliere..." : "Simulieren"}
      </button>

      {/* Ergebnis */}
      {result && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl space-y-2">
          <h3 className="font-semibold text-lg">Ergebnis</h3>

          <p>
            <b>Model:</b> {result.model}
          </p>

          <p>
            <b>Response:</b> {result.response}
          </p>

          <p>
            <b>Tokens:</b> {result.total_tokens} (Input: {result.input_tokens},
            Output: {result.output_tokens})
          </p>

          <p>
            <b>Kosten:</b> ${Number(result.cost).toFixed(5)}
          </p>

          <p>
            <b>Latenz:</b> {result.latency_ms} ms
          </p>
        </div>
      )}
    </div>
  );
}
