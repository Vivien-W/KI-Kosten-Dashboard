import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CostOverTimeChartProps {
  data: {
    date: string;
    cost: number;
  }[];
}

export default function CostOverTimeChart({ data }: CostOverTimeChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-300 dark:stroke-gray-700"
          />
          <XAxis dataKey="date" className="text-gray-700 dark:text-gray-300" />
          <YAxis className="text-gray-700 dark:text-gray-300" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              color: "#000",
            }}
          />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#3b82f6" // Blau
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
