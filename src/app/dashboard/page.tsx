import type { Metadata } from "next";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { FeedCard } from "@/components/dashboard/FeedCard";
import { TrendingCard } from "@/components/dashboard/TrendingCard";
import { JobsCard } from "@/components/dashboard/JobsCard";
import {
  mockKpis,
  mockTechFeed,
  mockTrendingRepos,
  mockJobOffers,
} from "@/lib/mock-data";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Dashboard Intel | Tech Portal",
  description:
    "Tableau de bord de veille technologique et pédagogique — GitHub Trending, Hacker News, offres d'emploi.",
};

export default function DashboardPage() {
  const now = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard">
      <div className="container">
        {/* ── Header ── */}
        <div className="dashboard__header animate-fade-in-up">
          <div>
            <h1 className="dashboard__title">
              Intel <span className="dashboard__title-accent">Portal</span>
            </h1>
            <p className="dashboard__subtitle">
              Veille technologique & pédagogique — {now}
            </p>
          </div>
          <div className="dashboard__status">
            <span className="badge">
              <span className="badge__dot" />
              Données mockées — Phase 1
            </span>
          </div>
        </div>

        {/* ── KPI Bar ── */}
        <div className="dashboard__kpis animate-fade-in-up animate-delay-1">
          {mockKpis.map((kpi) => (
            <KpiCard key={kpi.label} data={kpi} />
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="dashboard__grid">
          <div className="animate-fade-in-up animate-delay-2">
            <FeedCard title="📰 Tech Feed" items={mockTechFeed} />
          </div>
          <div className="animate-fade-in-up animate-delay-3">
            <TrendingCard title="🔥 GitHub Trending" repos={mockTrendingRepos} />
          </div>
          <div className="dashboard__grid-full animate-fade-in-up animate-delay-4">
            <JobsCard title="💼 Emploi & Formation" jobs={mockJobOffers} />
          </div>
        </div>
      </div>
    </div>
  );
}
