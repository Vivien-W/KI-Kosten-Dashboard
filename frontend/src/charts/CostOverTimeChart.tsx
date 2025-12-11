import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function CostOverTimeChart({ data }: { data: any[] }) {
  return (
    <LineChart width={500} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="cost" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  );
}
