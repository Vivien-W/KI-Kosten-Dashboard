import { useEffect, useState } from "react";
import KPIBox from "./KPIBox.tsx";
import CostOverTimeChart from "../charts/CostOverTimeChart.tsx";
import CostByModelChart from "../charts/CostByModelChart.tsx";
import TokensByModelChart from "../charts/TokensByModelChart.tsx";
import LatencyByModelChart from "../charts/LatencyByModelChart.tsx";
import PromptInput from "./PromptInput";

import { fetchDashboardData } from "../services/stats";
import type { DashboardData } from "../services/stats";

/* 🔹 Zahlenformatierung zentral definiert */
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
});

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .catch(() => {
        setError("Dashboard-Daten konnten nicht geladen werden.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* 🔹 Loading-State */
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        Lade Dashboard-Daten …
      </div>
    );
  }

  /* 🔹 Error-State */
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-100 text-red-700 border border-red-200">
        {error}
      </div>
    );
  }

  /* Type Guard – ab hier ist data garantiert vorhanden */
  if (!data) return null;

  return (
    <div className="space-y-8">
      <PromptInput />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIBox title="Total Prompts" value={data.totalPrompts} />
        <KPIBox title="Total Tokens" value={data.totalTokens} />
        <KPIBox
          title="Total Cost"
          value={currencyFormatter.format(data.totalCost)}
        />
        <KPIBox
          title="Avg. Cost per Prompt"
          value={currencyFormatter.format(data.avgCost)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-2">Kostenentwicklung</h2>
          <CostOverTimeChart data={data.costOverTime} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-2">Kosten nach Modell</h2>
          <CostByModelChart data={data.costByModel} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-2">Tokens pro Modell</h2>
          <TokensByModelChart data={data.tokensByModel} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-2">
            Durchschnittliche Latenz
          </h2>

          {data.avgLatencyByModel.length > 0 ? (
            <LatencyByModelChart data={data.avgLatencyByModel} />
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              Keine Latenzdaten verfügbar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
