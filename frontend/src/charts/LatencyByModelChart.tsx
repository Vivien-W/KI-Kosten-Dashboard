// src/charts/LatencyByModelChart.tsx (NEUE DATEI)

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LatencyData {
  model: string;
  avg_latency_ms: number;
}

// Stellt sicher, dass diese Komponente als 'LatencyByModelChart' in Dashboard.tsx importiert wird
export default function LatencyByModelChart({ data }: { data: LatencyData[] }) {
  // Optional: Daten sortieren, um die langsamsten/schnellsten Modelle hervorzuheben
  const sortedData = [...data].sort(
    (a, b) => b.avg_latency_ms - a.avg_latency_ms
  );

  return (
    // ResponsiveContainer stellt sicher, dass das Chart die Größe des Divs nutzt
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={sortedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* X-Achse zeigt die Modell-Namen */}
        <XAxis dataKey="model" angle={-15} textAnchor="end" height={50} />

        {/* Y-Achse zeigt die Millisekunden-Werte */}
        <YAxis
          label={{ value: "ms", angle: -90, position: "insideLeft" }}
          tickFormatter={(value) => value.toFixed(0)}
        />

        {/* Tooltip für Details beim Hovern */}
        <Tooltip
          formatter={(value: number) => [
            `${value.toFixed(2)} ms`,
            "Avg. Latenz",
          ]}
        />

        {/* Die Balken: dataKey muss 'avg_latency_ms' aus dem Backend-Objekt sein */}
        <Bar
          dataKey="avg_latency_ms"
          fill="#8884d8"
          name="Durchschnittliche Latenz"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
