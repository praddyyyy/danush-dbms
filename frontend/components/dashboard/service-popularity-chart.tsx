"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Basic Wash", value: 400 },
  { name: "Full Detail", value: 300 },
  { name: "Interior Clean", value: 200 },
  { name: "Exterior Polish", value: 150 },
  { name: "Ceramic Coating", value: 100 },
];

export default function ServicePopularityChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:5000/service-usage");
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
          <CardTitle className="text-purple-700">Service Popularity</CardTitle>
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
        <CardTitle className="text-purple-700">Service Popularity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#6366F1" />
            <YAxis stroke="#6366F1" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#EDE9FE",
                borderColor: "#6366F1",
              }}
              labelStyle={{ color: "#6366F1" }}
            />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
