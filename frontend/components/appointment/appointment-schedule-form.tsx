"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Minus, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ServicePackage,
  Employee,
  AppointmentFormData,
  Inventory,
} from "@/types/schema";
import axios from "axios";

const formSchema = z.object({
  customer_id: z.string().min(1, "Customer name is required"),
  vehicle_id: z.string().min(1, "Vehicle is required"),
  package_id: z.string().min(1, "Please select a service package"),
  employee_id: z.string().min(1, "Please select an employee"),
  appointment_date: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Please select a valid date",
  }),
  appointment_time: z.string().min(1, "Please select a time"),
  service_details: z.string().min(1, "Service details are required"),
  service_duration: z.number().min(1, "Duration must be at least 1 minute"),
  inventory_items: z.array(
    z.object({
      inventory_id: z.string().min(1, "Please select an inventory item"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ),
});

type Vehicle = {
  vehicle_id: number;
  make_year: string;
  license_plate: string;
  customer_name: string;
};

type Customer = {
  customer_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function ImprovedAppointmentForm() {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inventoryItems, setInventoryItems] = useState<Inventory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [packages, setPackages] = useState<ServicePackage[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchUsers() {
      await axios
        .get("http://localhost:5000/customers")
        .then((response) => {
          console.log(response.data);
          setCustomers(response.data as Customer[]);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    async function fetchVehicles() {
      await axios
        .get("http://localhost:5000/vehicles")
        .then((response) => {
          console.log(response.data);
          setVehicles(response.data as Vehicle[]);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    async function fetchServicePackages() {
      await axios
        .get("http://localhost:5000/service_packages")
        .then((response) => {
          console.log(response.data);
          setServicePackages(response.data as ServicePackage[]);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    async function fetchEmployees() {
      await axios
        .get("http://localhost:5000/employees")
        .then((response) => {
          console.log(response.data);
          setEmployees(response.data as Employee[]);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    async function fetchInventoryItems() {
      await axios
        .get("http://localhost:5000/inventory")
        .then((response) => {
          console.log(response.data);
          setInventoryItems(response.data as Inventory[]);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchUsers();
    fetchVehicles();
    fetchServicePackages();
    fetchEmployees();
    fetchInventoryItems();
  }, []);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: "",
      appointment_date: new Date(),
      package_id: "",
      appointment_time: "",
      employee_id: "",
      service_details: "",
      service_duration: 1,
      inventory_items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inventory_items",
  });

  async function onSubmit(values: AppointmentFormData) {
    console.log("in submit");
    console.log(values);
    try {
      const formattedValues = {
        ...values,
        appointment_date: new Date(values.appointment_date).toISOString().split("T")[0], // Converts to 'YYYY-MM-DD'
      };
  
      console.log("Formatted Values for Submission:", formattedValues);
      await axios
        .post("http://localhost:5000/schedule_appointment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        })
        .then((response) => {
          console.log(response.data);
        });

      console.log("Appointment created successfully");
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  }

  return (
    <div className="overflow-y-auto max-h-screen pb-64">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer & Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem
                              key={customer.customer_id}
                              value={customer.customer_id.toString()}
                            >
                              <div className="flex justify-between items-center">
                                <span>{customer.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the customer for this appointment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicle_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Number</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem
                              key={vehicle.vehicle_id}
                              value={vehicle.vehicle_id.toString()}
                            >
                              <div className="flex justify-between items-center">
                                <span>{vehicle.license_plate}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the vehicle for this appointment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="package_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Package</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service package" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {servicePackages.map((pkg) => (
                          <SelectItem
                            key={pkg.service_package_id}
                            value={pkg.service_package_id.toString()}
                          >
                            <div className="flex justify-between items-center">
                              <span>{pkg.package_name}</span>
                              <span className="text-muted-foreground ml-4">
                                ${pkg.price} - {pkg.duration} week(s)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the service package for this appointment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="appointment_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() ||
                              date >
                                new Date(
                                  new Date().setMonth(new Date().getMonth() + 2)
                                )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appointment_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Employee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem
                            key={employee.employee_id}
                            value={employee.employee_id.toString()}
                          >
                            {employee.name} - {employee.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="service_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add service details or special instructions..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="service_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Duration (weeks)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mt-2"
                >
                  <FormField
                    control={form.control}
                    name={`inventory_items.${index}.inventory_id`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inventoryItems.map((item) => (
                              <SelectItem
                                key={item.inventory_id}
                                value={item.inventory_id.toString()}
                              >
                                {item.product_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`inventory_items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            className="w-20"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ inventory_id: "0", quantity: 1 })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Schedule Appointment
          </Button>
        </form>
      </Form>
    </div>
  );
}
