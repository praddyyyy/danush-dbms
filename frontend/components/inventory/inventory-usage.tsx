"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryUsage } from "@/types/inventory";

export default function InventoryUsageComponent() {
  const [usage, setUsage] = useState<InventoryUsage[]>([]);

  useEffect(() => {
    fetch("/api/inventory/usage")
      .then((res) => res.json())
      .then(setUsage);
  }, []);

  return (
    <Card className="bg-white border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-900">
          Recent Inventory Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-purple-100 text-purple-900">
                Date
              </TableHead>
              <TableHead className="bg-purple-100 text-purple-900">
                Product
              </TableHead>
              <TableHead className="bg-purple-100 text-purple-900">
                Quantity Used
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usage.map((item) => (
              <TableRow key={`${item.service_record_id}-${item.inventory_id}`}>
                <TableCell className="text-purple-900">
                  {item.appointment_date}
                </TableCell>
                <TableCell className="text-purple-900">
                  {item.product_name}
                </TableCell>
                <TableCell className="text-purple-900">
                  {item.quantity_used}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
