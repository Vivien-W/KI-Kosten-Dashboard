import { useEffect, useState } from "react";
import KPIBox from "./KPIBox.tsx";
import CostOverTimeChart from "../charts/CostOverTimeChart.tsx";
import CostByModelChart from "../charts/CostByModelChart.tsx";
import TokensByModelChart from "../charts/TokensByModelChart.tsx";
import SuccessRateChart from "../charts/SuccessRateChart.tsx";
import PromptInput from "./PromptInput";

import { fetchDashboardData } from "../services/stats";

// Typen vom Backend
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

  // jetzt als Array, da das Chart .map() braucht
  successRate: Array<{ name: string; value: number }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalPrompts: 0,
    totalTokens: 0,
    totalCost: 0,
    avgCost: 0,

    costOverTime: [],
    costByModel: [],
    tokensByModel: [],

    // Chart-kompatibel
    successRate: [],
  });

  useEffect(() => {
    fetchDashboardData()
      .then((res) => {
        setData({
          totalPrompts: res.totalPrompts,
          totalTokens: res.totalTokens,
          totalCost: res.totalCost,
          avgCost: res.avgCost,
          costOverTime: res.costOverTime,
          costByModel: res.costByModel,
          tokensByModel: res.tokensByModel,
          successRate: [
            { name: "Erfolgreich", value: res.successRate.success },
            { name: "Fehlerhaft", value: res.successRate.error },
          ],
        });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
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
            Erfolgreich / Fehlerhaft
          </h2>
          <SuccessRateChart data={data.successRate} />
        </div>
      </div>
    </div>
  );
}
