"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExerciseChart({
  title,
  description,
  chartData,
  trendDescription,
}) {
  const keys = Object.keys(chartData[0]);
  const xKey = keys[0];
  const lineKeys = keys.slice(1);

  function getMaxValueFromKeys(data, keyIndexes = [1, 2]) {
    if (!Array.isArray(data) || data.length === 0) return 0;

    return Math.max(
      ...data.flatMap((item) => {
        const keys = Object.keys(item);
        return keyIndexes.map((index) => Number(item[keys[index]]) || 0);
      })
    );
  }

  const yAxisMax = getMaxValueFromKeys(chartData) * 1.1;

  return (
    <div style={styles.card} className="w-full bg-white">
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>{title}</h2>
        <p style={styles.cardDescription}>{description}</p>
      </div>
      <div style={styles.cardContent}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} stroke="#eee" />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis domain={[0, yAxisMax]} hide={true} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={lineKeys[0]}
              stroke="#1f77b4"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={lineKeys[1]}
              stroke="#ff7f0e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={styles.cardFooter}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {trendDescription}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
    fontFamily: "sans-serif",
  },
  cardHeader: {
    marginBottom: "12px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "550",
  },
  cardDescription: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },
  cardContent: {
    marginBottom: "12px",
  },
  cardFooter: {
    fontSize: "14px",
    color: "#374151",
  },
};
