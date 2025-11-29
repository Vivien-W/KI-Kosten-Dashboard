import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CostByModelChartProps {
  data: {
    model: string;
    cost: number;
  }[];
}

export default function CostByModelChart({ data }: CostByModelChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-300 dark:stroke-gray-700"
          />
          <XAxis dataKey="model" className="text-gray-700 dark:text-gray-300" />
          <YAxis className="text-gray-700 dark:text-gray-300" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              color: "#000",
            }}
          />
          <Bar dataKey="cost" fill="#10b981" radius={[6, 6, 0, 0]} />{" "}
          {/* Grün */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
