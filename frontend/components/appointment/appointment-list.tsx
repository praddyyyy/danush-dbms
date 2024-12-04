"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronUpIcon, ChevronDownIcon, Edit, SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Appointment = {
  appointment_id: number;
  vehicle_id: string;
  service_package_id: string;
  appointment_date: string;
  appointment_time: string;
  license_plate: string;
  package_name: string;
  status: "scheduled" | "completed" | "canceled";
};

const formSchema = z.object({
  appointment_date: z.string().nonempty({ message: "Date is required" }),
  appointment_time: z.string().nonempty({ message: "Time is required" }),
  status: z.enum(["scheduled", "completed", "canceled"]),
});

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [filterValue, setFilterValue] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Appointment | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointment_date: "",
      appointment_time: "",
      status: "scheduled",
    },
  });

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await axios.get("http://localhost:5000/appointments");
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const handleFilter = (value: string) => {
    setFilterValue(value);
    const filtered = appointments.filter((appointment) =>
      Object.values(appointment).some((field) =>
        field.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredAppointments(filtered);
  };

  const handleSort = (column: keyof Appointment) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...filteredAppointments].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredAppointments(sorted);
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    form.reset({
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      status: appointment.status,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!editingAppointment) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/appointments/${editingAppointment.appointment_id}`,
        values
      );
      const updatedAppointment = response.data;
      setAppointments(
        appointments.map((app) =>
          app.appointment_id === updatedAppointment.appointment_id
            ? updatedAppointment
            : app
        )
      );
      setFilteredAppointments(
        filteredAppointments.map((app) =>
          app.appointment_id === updatedAppointment.appointment_id
            ? updatedAppointment
            : app
        )
      );
      setEditingAppointment(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-xl text-purple-900">
        Loading appointments...
      </p>
    );
  }

  if (appointments.length === 0) {
    return (
      <p className="text-center text-xl text-purple-900">
        No appointments found.
      </p>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Input
            placeholder="Search appointments..."
            value={filterValue}
            onChange={(e) => handleFilter(e.target.value)}
            className="pl-10 bg-purple-100 text-purple-900 placeholder-purple-400"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
        </div>
      </div>
      <div className="rounded-md border border-purple-200">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(appointments[0]).map((column) => (
                <TableHead
                  key={column}
                  onClick={() => handleSort(column as keyof Appointment)}
                  className="cursor-pointer bg-purple-100 text-purple-900"
                >
                  {column.charAt(0).toUpperCase() +
                    column.slice(1).replace("_", " ")}
                  {sortColumn === column &&
                    (sortDirection === "asc" ? (
                      <ChevronUpIcon className="inline ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="inline ml-2 h-4 w-4" />
                    ))}
                </TableHead>
              ))}
              {/* <TableHead className="bg-purple-100 text-purple-900">
                Actions
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow
                key={appointment.appointment_id}
                className="hover:bg-purple-50"
              >
                {Object.entries(appointment).map(([key, value]) => (
                  <TableCell key={key} className="text-purple-900">
                    {value}
                  </TableCell>
                ))}
                {/* <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(appointment)}
                        className="text-purple-600 border-purple-600 hover:bg-purple-100"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-purple-50">
                      <DialogHeader>
                        <DialogTitle className="text-purple-900">
                          Edit Appointment
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="appointment_date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-purple-900">
                                  Date
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...field}
                                    className="bg-white text-purple-900"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="appointment_time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-purple-900">
                                  Time
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                    className="bg-white text-purple-900"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-purple-900">
                                  Status
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-white text-purple-900">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="scheduled">
                                      Scheduled
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      Completed
                                    </SelectItem>
                                    <SelectItem value="canceled">
                                      Canceled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button
                              type="submit"
                              className="bg-purple-600 text-white hover:bg-purple-700"
                            >
                              Update Appointment
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
