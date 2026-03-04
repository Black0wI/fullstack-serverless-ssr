import type { KpiData } from "@/lib/mock-data";

export function KpiCard({ data }: { data: KpiData }) {
  const trendClass =
    data.trend === "up"
      ? "kpi__trend--up"
      : data.trend === "down"
        ? "kpi__trend--down"
        : "kpi__trend--neutral";

  return (
    <div className="kpi glass">
      <div className="kpi__icon">{data.icon}</div>
      <div className="kpi__body">
        <span className="kpi__value">{data.value}</span>
        <span className="kpi__label">{data.label}</span>
      </div>
      <span className={`kpi__trend ${trendClass}`}>{data.trendValue}</span>
    </div>
  );
}
