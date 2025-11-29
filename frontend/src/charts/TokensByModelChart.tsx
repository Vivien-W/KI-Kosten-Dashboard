import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface TokensByModelChartProps {
  data: {
    model: string;
    input_tokens: number;
    output_tokens: number;
  }[];
}

export default function TokensByModelChart({ data }: TokensByModelChartProps) {
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
          <Legend />
          <Bar
            dataKey="input_tokens"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          />{" "}
          {/* Blau */}
          <Bar
            dataKey="output_tokens"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
          />{" "}
          {/* Grün */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
