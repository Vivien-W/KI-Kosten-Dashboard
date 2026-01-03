import { useEffect, useState } from "react";
import KPIBox from "./KPIBox.tsx";
import CostOverTimeChart from "../charts/CostOverTimeChart.tsx";
import CostByModelChart from "../charts/CostByModelChart.tsx";
import TokensByModelChart from "../charts/TokensByModelChart.tsx";
import LatencyByModelChart from "../charts/LatencyByModelChart.tsx";
import PromptInput from "./PromptInput";
import { useDarkMode } from "../context/DarkModeContext";
import { Moon, Sun } from "lucide-react";

import { fetchDashboardData } from "../services/stats";

interface DashboardData {
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

export default function Dashboard() {
  const { darkMode, setDarkMode } = useDarkMode();

  const [data, setData] = useState<DashboardData>({
    totalPrompts: 0,
    totalTokens: 0,
    totalCost: 0,
    avgCost: 0,

    costOverTime: [],
    costByModel: [],
    tokensByModel: [],

    avgLatencyByModel: [],
  });

  useEffect(() => {
    fetchDashboardData()
      .then((res: any) =>
        setData({
          totalPrompts: res.totalPrompts,
          totalTokens: res.totalTokens,
          totalCost: res.totalCost,
          avgCost: res.avgCost,
          costOverTime: res.costOverTime,
          costByModel: res.costByModel,
          tokensByModel: res.tokensByModel,
          avgLatencyByModel: res.avgLatencyByModel,
        })
      )
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      {/* ⭐ Dark Mode Toggle oben rechts oder links */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-xl border hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <PromptInput />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIBox title="Total Prompts" value={data.totalPrompts} />
        <KPIBox title="Total Tokens" value={data.totalTokens} />
        <KPIBox title="Total Cost" value={`$${data.totalCost.toFixed(4)}`} />
        <KPIBox
          title="Avg. Cost per Prompt"
          value={`$${data.avgCost.toFixed(5)}`}
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
