import { useEffect, useState } from "react";
// Importiert die eine Funktion, die alle Dashboard-Daten auf einmal lädt
import { fetchDashboardData } from "../services/stats";

// --- Typdefinitionen (Passen zur Backend-Antwort) ---

interface CostOverTimeData {
  date: string;
  cost: number;
}

interface CostByModelData {
  model: string;
  cost: number;
}

interface TokensByModelData {
  model: string;
  input_tokens: number;
  output_tokens: number;
}

interface LatencyData {
  model: string;
  avg_latency_ms: number;
}

// Typ des gesamten Daten-Containers
interface StatsData {
  totalPrompts: number;
  totalTokens: number;
  totalCost: number;
  avgCost: number;

  costOverTime: CostOverTimeData[];
  costByModel: CostByModelData[];
  tokensByModel: TokensByModelData[];
  avgLatencyByModel: LatencyData[];
}

// Initialer State für das Hook
const initialStats: StatsData = {
  totalPrompts: 0,
  totalTokens: 0,
  totalCost: 0,
  avgCost: 0,

  costOverTime: [],
  costByModel: [],
  tokensByModel: [],
  avgLatencyByModel: [], // Initialisiert als leeres Array
};

export function useStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>(initialStats);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        // 1. Alle Daten in einem Aufruf vom Backend abrufen
        const res = await fetchDashboardData();

        // 2. Datenstruktur vereinheitlichen und State setzen
        setStats({
          totalPrompts: res.totalPrompts,
          totalTokens: res.totalTokens,
          totalCost: res.totalCost,
          avgCost: res.avgCost,

          costOverTime: res.costOverTime,
          costByModel: res.costByModel,

          tokensByModel: res.tokensByModel,

          // NEU: Absicherung des Latenz-Arrays
          // Wichtig: 'res.avgLatencyByModel' muss der Schlüssel sein, den das Backend sendet
          avgLatencyByModel: res.avgLatencyByModel || [],
        });
      } catch (err) {
        console.error("Fehler beim Laden der Statistik:", err);
        // Im Fehlerfall trotzdem mit Initialdaten fortfahren
        setStats(initialStats);
      }

      setLoading(false);
    }

    load();
    // Leeres Array als Abhängigkeit, damit es nur einmal beim Mounten ausgeführt wird
  }, []);

  // Rückgabe der Lade-Status und aller Datenfelder
  return {
    loading,
    ...stats,
  };
}
