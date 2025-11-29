import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface SuccessRateChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = ["#10b981", "#ef4444"]; // Grün = Erfolg, Rot = Fehler

export default function SuccessRateChart({ data }: SuccessRateChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              color: "#000",
            }}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            fill="#3b82f6"
            label
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
