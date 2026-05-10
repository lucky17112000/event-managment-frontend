"use client";

import { BarChart } from "@/components/modules/Admin-mangment/analytics/BarChart";
import { DonutChart } from "@/components/modules/Admin-mangment/analytics/DonutChart";
import { KPICard } from "@/components/modules/Admin-mangment/analytics/KPICard";
import { QuickInsights } from "@/components/modules/Admin-mangment/analytics/QuickInsights";
import { QuickStats } from "@/components/modules/Admin-mangment/analytics/QuickStats";
import { RecentActivity } from "@/components/modules/Admin-mangment/analytics/RecentActivity";
import { getAdminDashboardStatsAction } from "@/services/admin.service";
import { getcategories } from "@/services/category.service";
import { getidea } from "@/services/idea.services";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, ShieldCheck, Users2 } from "lucide-react";
import { useEffect, useState } from "react";

const AdminAnalytics = () => {
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>(
    {},
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDashboardData"],
    queryFn: () => getAdminDashboardStatsAction(),
  });

  // Fetch categories and count ideas by category
  useEffect(() => {
    const fetchCategoriesAndIdeas = async () => {
      try {
        // Fetch all categories
        const categoriesRes = await getcategories();
        if (categoriesRes.data) {
          setCategories(categoriesRes.data);

          // Fetch all ideas to count by category
          const ideasRes = await getidea({ limit: 10000 }); // Fetch all ideas
          if (ideasRes.data) {
            const stats: Record<string, number> = {};

            // Initialize all categories with 0
            categoriesRes.data.forEach((cat) => {
              stats[cat.name] = 0;
            });

            // Count ideas by category
            ideasRes.data.forEach((idea: any) => {
              if (idea.category?.name) {
                stats[idea.category.name] =
                  (stats[idea.category.name] || 0) + 1;
              }
            });

            setCategoryStats(stats);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories or ideas:", error);
      }
    };
    fetchCategoriesAndIdeas();
  }, []);

  const stats = data?.data;

  const totalUsers = stats?.totalUsers ?? 0;
  const totalAdmins = stats?.totalAdmins ?? 0;
  const totalEvents = categories.reduce(
    (sum, cat) => sum + (categoryStats[cat.name] || 0),
    0,
  );

  /* ── KPI card config ─────────────────────────────────────────────────── */
  const kpiCards = [
    {
      title: "Total Event Creators",
      value: totalUsers,
      icon: Users2,
      trend: "+12% this month",
      trendUp: true,
      iconBg: "bg-zinc-50 dark:bg-zinc-950/40",
      iconColor: "text-zinc-600 dark:text-zinc-400",
      delay: "animate-delay-100",
    },
    {
      title: "Moderators",
      value: totalAdmins,
      icon: ShieldCheck,
      trend: "+2 new this week",
      trendUp: true,
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      delay: "animate-delay-200",
    },
    {
      title: "Total Events",
      value: totalEvents,
      icon: Lightbulb,
      trend: "+34 this month",
      trendUp: true,
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      iconColor: "text-amber-600 dark:text-amber-400",
      delay: "animate-delay-300",
    },
  ];

  /* ── Donut chart data ─────────────────────────────────────────────────── */
  const donutData = [
    { label: "Creators", value: totalUsers, color: "#10b981" },
    { label: "Moderators", value: totalAdmins, color: "#3b82f6" },
  ];

  /* ── Color palette for categories ─────────────────────────────────────── */
  const colors = [
    { color: "#d97706", lightColor: "#fbbf24" }, // amber
    { color: "#2563eb", lightColor: "#60a5fa" }, // blue
    { color: "#059669", lightColor: "#34d399" }, // emerald
    { color: "#7c3aed", lightColor: "#a78bfa" }, // violet
    { color: "#dc2626", lightColor: "#f87171" }, // red
    { color: "#0891b2", lightColor: "#06b6d4" }, // cyan
  ];

  /* ── Bar chart data from real categories ─────────────────────────────── */
  const barData = categories.map((cat, idx) => ({
    label: cat.name,
    value: categoryStats[cat.name] || 0,
    color: colors[idx % colors.length].color,
    lightColor: colors[idx % colors.length].lightColor,
  }));

  /* ── Quick insights data ─────────────────────────────────────────────── */
  const insightCategories = barData.map((item) => ({
    label: item.label,
    value: item.value,
    color: item.color,
  }));

  /* ── Quick stats data ─────────────────────────────────────────────────── */
  const quickStatsItems = barData.map((item) => ({
    label: `${item.label} events`,
    value: item.value,
    total: totalEvents,
    color: item.color,
  }));

  /* ── Loading skeleton ─────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-destructive">
          Failed to load analytics data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="animate-eco-fade-down">
        <h1 className="text-2xl font-bold tracking-tight">
          Event Hub Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform statistics and event performance at a glance.
        </p>
      </div>

      {/* ── KPI cards ───────────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kpiCards.map((card) => (
            <KPICard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              trendUp={card.trendUp}
              iconBg={card.iconBg}
              iconColor={card.iconColor}
              animationDelay={card.delay}
            />
          ))}
        </div>
      </section>

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="animate-eco-fade-in animate-delay-300 mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Charts
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DonutChart
            title="User Distribution"
            data={donutData}
            animationDelay="animate-delay-400"
          />
          <BarChart
            title="Events by Category"
            data={barData}
            animationDelay="animate-delay-500"
          />
        </div>
      </section>

      {/* ── Quick insights ──────────────────────────────────────────────── */}
      <section>
        <QuickInsights
          categories={insightCategories}
          animationDelay="animate-delay-500"
        />
      </section>

      {/* ── Quick stats + Recent activity ───────────────────────────────── */}
      <section>
        <h2 className="animate-eco-fade-in animate-delay-500 mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Details
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <QuickStats
            title="Event Category Breakdown"
            items={quickStatsItems}
            animationDelay="animate-delay-600"
          />
          <RecentActivity animationDelay="animate-delay-700" />
        </div>
      </section>
    </div>
  );
};

export default AdminAnalytics;
