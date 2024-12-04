import { CalendarDays } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between p-4 bg-purple-600 text-white">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="flex items-center space-x-2">
        <CalendarDays className="h-5 w-5" />
        <span className="text-sm">{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}
