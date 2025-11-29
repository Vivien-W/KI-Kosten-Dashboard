import { useEffect, useState } from "react";
import KPIBox from "./KPIBox.tsx";
import CostOverTimeChart from "../charts/CostOverTimeChart.tsx";
import CostByModelChart from "../charts/CostByModelChart.tsx";
import TokensByModelChart from "../charts/TokensByModelChart.tsx";
import SuccessRateChart from "../charts/SuccessRateChart.tsx";
import { fetchDashboardData } from "../../services/api.tsx";

interface DashboardData {
  totalPrompts: number;
  totalTokens: number;
  totalCost: number;
  avgCost: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalPrompts: 0,
    totalTokens: 0,
    totalCost: 0,
    avgCost: 0,
  });

  useEffect(() => {
    fetchDashboardData().then(setData);
  }, []);

  return (
    <div className="space-y-8">
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
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Kostenentwicklung
          </h2>
          <CostOverTimeChart />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Kosten nach Modell
          </h2>
          <CostByModelChart />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Tokens pro Modell
          </h2>
          <TokensByModelChart />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Erfolgreich / Fehlerhaft
          </h2>
          <SuccessRateChart />
        </div>
      </div>
    </div>
  );
}
