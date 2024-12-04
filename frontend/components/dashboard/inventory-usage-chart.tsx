"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Cleaning Solutions", value: 400 },
  { name: "Microfiber Cloths", value: 300 },
  { name: "Wax", value: 200 },
  { name: "Polishing Compounds", value: 100 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD"];

export default function InventoryUsageChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:5000/inventory-usage");
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white border-purple-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-purple-700">Inventory Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Loading...</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-white border-purple-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-purple-700">Inventory Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#EDE9FE",
                borderColor: "#6366F1",
              }}
              labelStyle={{ color: "#6366F1" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
