import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#00c49f", "#ff4d4d"];

export default function SuccessRateChart({ data }: { data: any[] }) {
  return (
    <PieChart width={350} height={250}>
      <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
