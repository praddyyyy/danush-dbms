export interface InventoryItem {
  inventory_id: number;
  product_name: string;
  quantity: number;
  reorder_level: number;
}

export interface InventoryUsage {
  service_record_id: number;
  inventory_id: number;
  product_name: string;
  quantity_used: number;
  appointment_date: string;
}
