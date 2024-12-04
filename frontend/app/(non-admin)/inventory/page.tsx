import { Metadata } from "next";
import InventoryList from "@/components/inventory/inventory-list";
import InventoryForm from "@/components/inventory/inventory-form";
import LowStockItems from "@/components/inventory/low-stock-items";

export const metadata: Metadata = {
  title: "Inventory Management | Auto Detailing Management System",
  description: "Manage inventory for auto detailing services.",
};

export default function InventoryPage() {
  return (
    <div className="py-8 px-4 h-screen bg-purple-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-8 text-purple-900">
          Inventory Management
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <InventoryList />
            <div className="mt-8">
              <LowStockItems />
            </div>
          </div>
          <div>
            <InventoryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
