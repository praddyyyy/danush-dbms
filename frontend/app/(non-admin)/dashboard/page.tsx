import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import MetricCards from "@/components/dashboard/metric-cards";
import ActionableInsights from "@/components/dashboard/actionable-insights";
import AppointmentChart from "@/components/dashboard/appointment-chart";
import ServicePopularityChart from "@/components/dashboard/service-popularity-chart";

import AppointmentOverview from "@/components/dashboard/appointment-overview";
import InventoryUsageChart from "@/components/dashboard/inventory-usage-chart";

export const metadata: Metadata = {
  title: "Dashboard | Auto Detailing Management System",
  description:
    "Overview of key metrics and functionalities for your auto detailing business.",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCards />
        </div>
        {/* <div className="grid gap-6 md:grid-cols-2">
          <ActionableInsights />
          <QuickLinks />
        </div> */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AppointmentChart />
          <ServicePopularityChart />
          <InventoryUsageChart />
        </div>
        <div className="flex gap-x-6">
          <AppointmentOverview />
          <ActionableInsights />
        </div>
      </div>
    </div>
  );
}
