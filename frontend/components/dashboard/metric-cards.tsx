"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Users, Car, Calendar, Package } from "lucide-react";
import { useEffect, useState } from "react";

// const metrics = [
//   {
//     title: "Total Customers",
//     value: "1,234",
//     icon: Users,
//     description: "+20 this week",
//   },
//   {
//     title: "Total Vehicles",
//     value: "2,345",
//     icon: Car,
//     description: "60% SUVs",
//   },
//   {
//     title: "Appointments",
//     value: "345",
//     icon: Calendar,
//     description: "45 scheduled today",
//   },
//   {
//     title: "Inventory Items",
//     value: "789",
//     icon: Package,
//     description: "12 low on stock",
//   },
// ];

type Metric = {
  title: string;
  value: string;
  icon: any;
  // description?: string;
};

export default function MetricCards() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/metrics").then((response) => {
      setLoading(false);
      console.log(response.data);
      setMetrics([
        {
          title: "Total Inventory",
          value: response.data.inventory_count,
          icon: Package,
        },
        {
          title: "Total Customers",
          value: response.data.customer_count,
          icon: Users,
        },
        {
          title: "Total Vehicles",
          value: response.data.vehicle_count,
          icon: Car,
        },
        {
          title: "Appointments",
          value: response.data.appointment_count,
          icon: Calendar,
        },
      ]);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className="bg-white border-purple-200 shadow-md hover:shadow-lg transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {metric.value}
            </div>
            {/* <p className="text-xs text-purple-600">{metric.description}</p> */}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
