export interface Appointment {
  aid: number;
  cid: number; // customer id
  vid: number; // vehicle id
  pid: number; // package id
  appointment_date: string;
  appointment_time: string;
  status: "scheduled" | "completed" | "canceled";
}

export interface ServicePackage {
  service_package_id: number;
  package_name: string;
  package_description: string;
  price: number;
  duration: number;
}

export interface ServiceRecord {
  sid: number;
  aid: number; // appointment id
  eid: number; // employee id
  details: string;
  duration: number;
}

export interface Inventory {
  inventory_id: number;
  product_name: string;
  quantity: number;
  price: number;
  reorder_level: number;
}

export interface ServiceProductUsage {
  sid: number; // service record id
  iid: number; // inventory id
  quantity_used: number;
}

export interface Employee {
  employee_id: number;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export interface Customer {
  customer_id: number;
  name: string;
  email: string;
}

export interface Vehicle {
  vehicle_id: number;
  customer_id: number;
  make: string;
  model: string;
  year: number;
}

export interface InventoryItem {
  inventory_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface AppointmentFormData {
  customer_id: string;
  vehicle_id: string;
  package_id: string;
  employee_id: string;
  appointment_date: Date;
  appointment_time: string;
  service_details: string;
  service_duration: number;
  inventory_items: {
    inventory_id: string;
    quantity: number;
  }[];
}
