"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const insights = [
  "You have 5 appointments scheduled for today.",
  "3 inventory items are running low (e.g., cleaning supplies).",
  "2 employees are inactive. Consider assigning them to tasks.",
];

export default function ActionableInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const res = await axios.get(
          "http://localhost:5000/actionable-insights"
        );
        setInsights(res.data);
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
      <Card className="w-full lg:w-96 bg-white border-purple-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-purple-700">Actionable Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Loading...</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full lg:w-96 bg-white border-purple-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-purple-700">Actionable Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-purple-900">
              You have {insights["appointments_today"]} appointments scheduled
              for today.
            </span>
          </li>
          <li className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-purple-900">
              {insights["low_inventory"]} inventory items are running low.
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
