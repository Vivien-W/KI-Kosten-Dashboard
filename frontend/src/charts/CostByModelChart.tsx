import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function CostByModelChart({ data }: { data: any[] }) {
  return (
    <BarChart width={500} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="model" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="cost" fill="#82ca9d" />
    </BarChart>
  );
}
