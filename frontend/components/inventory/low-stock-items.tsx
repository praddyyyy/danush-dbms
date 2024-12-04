"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import axios from "axios";

export default function LowStockItems() {
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    async function fetchLowStockItems() {
      await axios
        .get("http://localhost:5000/inventory")
        .then((res) => {
          console.log(res.data);
          setLowStockItems(
            res.data.filter(
              (item: InventoryItem) => item.quantity <= item.reorder_level
            )
          );
        })
        .catch((err) => console.error(err));
    }
    fetchLowStockItems();
  }, []);

  return (
    <Card className="bg-white border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-900">Low Stock Items</CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockItems.length === 0 && (
          <p className="text-sm text-purple-700">No low stock items found</p>
        )}
        <ul className="space-y-2">
          {lowStockItems.map((item) => (
            <li key={item.inventory_id} className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-purple-900">
                {item.product_name} (Qty: {item.quantity})
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
