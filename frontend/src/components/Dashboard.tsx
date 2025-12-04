import { useEffect, useState } from "react";
import KPIBox from "./KPIBox.tsx";
import CostOverTimeChart from "../charts/CostOverTimeChart.tsx";
import CostByModelChart from "../charts/CostByModelChart.tsx";
import TokensByModelChart from "../charts/TokensByModelChart.tsx";
import SuccessRateChart from "../charts/SuccessRateChart.tsx";
import { fetchDashboardData } from "../services/api";
import type { DashboardApiResponse } from "../services/api";
import PromptInput from "./PromptInput";

// --- Dashboard State Typen ---
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
    successRate: [],
  });

  useEffect(() => {
    fetchDashboardData().then((res: DashboardApiResponse) => {
      // 1. TokensByModel Transformation (für input_tokens/output_tokens)
      const transformedTokensByModel = res.tokensByModel.map((item) => ({
        model: item.model,
        // ANNAHME: Die API liefert nur 'tokens'. Wir müssen sie splitten oder füllen.
        // Wenn die Aufteilung unbekannt ist, setzen wir hier exemplarische Werte:
        input_tokens: item.tokens, // Gesamttokens als Input setzen
        output_tokens: 0, // Output auf 0 setzen
      }));

      // 2. SuccessRate Transformation (bereits korrekt, aber hier zur Vollständigkeit)
      const transformedSuccessRate = [
        { name: "Erfolgreich", value: res.successRate.success },
        { name: "Fehlerhaft", value: res.successRate.error },
      ];

      setData({
        totalPrompts: res.totalPrompts,
        totalTokens: res.totalTokens,
        totalCost: res.totalCost,
        avgCost: res.avgCost,
        costOverTime: res.costOverTime,
        costByModel: res.costByModel,

        // ✅ Die transformierten Daten zuweisen
        tokensByModel: transformedTokensByModel,
        successRate: transformedSuccessRate,
      });
    });
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
        {/* Kostenentwicklung */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Kostenentwicklung
          </h2>
          <CostOverTimeChart data={data.costOverTime} />
        </div>

        {/* Kosten nach Modell */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Kosten nach Modell
          </h2>
          <CostByModelChart data={data.costByModel} />
        </div>

        {/* Tokens pro Modell */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Tokens pro Modell
          </h2>
          <TokensByModelChart data={data.tokensByModel} />
        </div>

        {/* Erfolgreich / Fehlerhaft */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Erfolgreich / Fehlerhaft
          </h2>
          <SuccessRateChart data={data.successRate} />
        </div>
      </div>
    </div>
  );
}
