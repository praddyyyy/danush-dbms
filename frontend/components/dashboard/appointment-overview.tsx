"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AppointmentOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const res = await axios.get(
          "http://localhost:5000/upcoming-appointments"
        );
        console.log(res.data);
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
  return (
    <Card className="flex-1 bg-white border-purple-200 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-x-2 text-purple-700">
          Upcoming Appointments
          <Link href="/appointments">
            <ExternalLink size={16} className="text-purple-500" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-purple-700">Date & Time</TableHead>
              <TableHead className="text-purple-700">Customer</TableHead>
              <TableHead className="text-purple-700">Vehicle</TableHead>
              <TableHead className="text-purple-700">Service</TableHead>
              <TableHead className="text-purple-700">Status</TableHead>
              <TableHead className="text-purple-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-purple-900">
                  No upcoming appointments.
                </TableCell>
              </TableRow>
            )}
            {data.length > 0 &&
              data.map((appointment) => (
                <TableRow key={appointment.date_time}>
                  <TableCell className="text-purple-900">
                    {appointment.date_time}
                    <br />
                    {appointment.time}
                  </TableCell>
                  <TableCell className="text-purple-900">
                    {appointment.customer}
                  </TableCell>
                  <TableCell className="text-purple-900">
                    {appointment.vehicle}
                  </TableCell>
                  <TableCell className="text-purple-900">
                    {appointment.service}
                  </TableCell>
                  <TableCell className="text-purple-900">
                    {appointment.status}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-300 hover:bg-purple-100"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
