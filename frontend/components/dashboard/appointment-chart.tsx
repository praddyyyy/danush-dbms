"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AppointmentChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    async function fetchAppointments() {
      try {
        const res = await axios.get(
          "http://localhost:5000/monthy_appointments"
        );
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white border-purple-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-purple-700">Appointment Trends</CardTitle>
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
        <CardTitle className="text-purple-700">Appointment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#6366F1" />
            <YAxis stroke="#6366F1" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#EDE9FE",
                borderColor: "#6366F1",
              }}
              labelStyle={{ color: "#6366F1" }}
            />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="#6366F1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
