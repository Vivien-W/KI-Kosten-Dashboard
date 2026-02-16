import { useEffect, useState } from "react";
import type { ModelEntry, SimulateResponse } from "../services/prompts";
import { fetchModels, simulatePrompt } from "../services/prompts";

/* 🔹 Zahlenformatierung */
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 5,
});

export default function PromptInput() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState<ModelEntry[]>([]);
  const [result, setResult] = useState<SimulateResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- Modelle laden ---- */
  useEffect(() => {
    fetchModels()
      .then((data) => {
        setModels(data);
        if (data.length > 0) setModel(data[0].model);
      })
      .catch(() => {
        setError("Modelle konnten nicht geladen werden.");
      });
  }, []);

  /* ---- Prompt Simulation ---- */
  async function handleSimulate() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await simulatePrompt(prompt, model);
      setResult(data);
    } catch {
      setError("Prompt konnte nicht simuliert werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700 space-y-4">
      <h2 className="text-2xl font-semibold">Prompt Simulation</h2>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Prompt */}
      <textarea
        className="w-full p-3 border rounded-xl bg-gray-100 dark:bg-gray-800"
        rows={4}
        placeholder="Prompt eingeben..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Modell */}
      <label htmlFor="model-select" className="block mb-2 font-medium">
        KI-Modell auswählen
      </label>

      <select
        id="model-select"
        className="p-3 border rounded-xl bg-gray-100 dark:bg-gray-800 w-full"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        disabled={models.length === 0}
      >
        {models.length === 0 && <option>Modelle werden geladen…</option>}

        {models.map((m) => (
          <option key={m.model} value={m.model}>
            {m.model}
          </option>
        ))}
      </select>

      {/* Button */}
      <button
        type="button"
        onClick={handleSimulate}
        disabled={loading || !prompt.trim()}
        aria-busy={loading}
        className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Simuliere…" : "Simulieren"}
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
            <b>Kosten:</b> {currencyFormatter.format(result.cost)}
          </p>

          <p>
            <b>Latenz:</b> {result.latency_ms} ms
          </p>
        </div>
      )}
    </div>
  );
}
