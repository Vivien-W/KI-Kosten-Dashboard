import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function TokensByModelChart({ data }: { data: any[] }) {
  const withTotals = data.map((d) => ({
    ...d,
    total_tokens: d.input_tokens + d.output_tokens,
  }));

  return (
    <BarChart width={500} height={250} data={withTotals}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="model" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="total_tokens" fill="#8884d8" />
    </BarChart>
  );
}
