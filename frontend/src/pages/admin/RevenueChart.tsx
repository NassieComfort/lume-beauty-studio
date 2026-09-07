import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 145000 },
  { month: "Mar", revenue: 132000 },
  { month: "Apr", revenue: 158000 },
  { month: "May", revenue: 170000 },
  { month: "Jun", revenue: 185000 },
  { month: "Jul", revenue: 162000 },
  { month: "Aug", revenue: 198000 },
];

const RevenueChart = () => {
  return (
    <div className="rounded-2xl bg-lume-chocolate p-6 shadow-lume">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl text-lume-cream">
          Revenue Overview
        </h3>
        <span className="text-xs text-lume-cream/50">This Month</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={revenueData}>
          <CartesianGrid stroke="#F7F3ED" strokeOpacity={0.08} vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#77716D"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#77716D"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₦${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: "#3B2119",
              border: "none",
              borderRadius: 8,
              color: "#F7F3ED",
              fontSize: 13,
            }}
            formatter={(value) => [
              typeof value === "number"
                ? `₦${value.toLocaleString()}`
                : String(value ?? ""),
              "Revenue",
            ]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#F7F3ED"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;