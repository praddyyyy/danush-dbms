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
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  ChevronsUpDown,
  Check,
  SearchIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

const formSchema = z.object({
  make_year: z.string().nonempty(),
  license_plate: z.string().nonempty(),
  customer_name: z.string().nonempty(),
});

export default function VehicleTable() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Vehicle | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make_year: "",
      license_plate: "",
      customer_name: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [vehiclesRes, customersRes] = await Promise.all([
          axios.get("http://localhost:5000/vehicles"),
          axios.get("http://localhost:5000/customers"),
        ]);
        setVehicles(vehiclesRes.data);
        setFilteredVehicles(vehiclesRes.data);
        setCustomers(customersRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleFilter = (value: string) => {
    setFilterValue(value);
    const filtered = vehicles.filter((vehicle) =>
      Object.values(vehicle).some((field) =>
        field.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredVehicles(filtered);
  };

  const handleSort = (column: keyof Vehicle) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...filteredVehicles].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredVehicles(sorted);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/vehicles",
        values
      );
      setVehicles([...vehicles, response.data.data]);
      setFilteredVehicles([...filteredVehicles, response.data.data]);
      setIsAddVehicleOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center text-xl text-purple-900">Loading...</p>;
  }

  return (
    <div className="px-4 py-8 h-screen bg-purple-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-900">
        Vehicle Management
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div className="relative w-64 mb-4">
            <Input
              placeholder="Search vehicles..."
              value={filterValue}
              onChange={(e) => handleFilter(e.target.value)}
              className="pl-10 bg-purple-100 text-purple-900 placeholder-purple-400"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </div>
          <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                <PlusIcon className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-purple-50">
              <DialogHeader>
                <DialogTitle className="text-purple-900">
                  Add New Vehicle
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="make_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">
                          Make Year
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="2000"
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
                    name="license_plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">
                          License Plate
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="AAA-123"
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
                    name="customer_name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-purple-900">
                          Customer Name
                        </FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between bg-white text-purple-900 border-purple-300",
                                    !field.value && "text-purple-400"
                                  )}
                                >
                                  {field.value
                                    ? customers.find(
                                        (customer) =>
                                          customer.name === field.value
                                      )?.name
                                    : "Select customer"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 bg-white">
                              <Command>
                                <CommandInput
                                  placeholder="Search customer..."
                                  className="text-purple-900"
                                />
                                <CommandList>
                                  <CommandEmpty className="text-purple-700">
                                    No Customer found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {customers.map((customer) => (
                                      <CommandItem
                                        value={customer.name}
                                        key={customer.name}
                                        onSelect={() => {
                                          form.setValue(
                                            "customer_name",
                                            customer.name
                                          );
                                        }}
                                        className="text-purple-900 hover:bg-purple-100"
                                      >
                                        {customer.name}
                                        <Check
                                          className={cn(
                                            "ml-auto text-purple-600",
                                            customer.name === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Add Vehicle
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-md border border-purple-200">
          <Table>
            <TableHeader>
              <TableRow>
                {vehicles.length > 0 &&
                  (Object.keys(vehicles[0]) as Array<keyof Vehicle>).map(
                    (column) => (
                      <TableHead
                        key={column}
                        onClick={() => handleSort(column)}
                        className="cursor-pointer bg-purple-100 text-purple-900"
                      >
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                        {sortColumn === column &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="inline ml-2 h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="inline ml-2 h-4 w-4" />
                          ))}
                      </TableHead>
                    )
                  )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow
                  key={vehicle.vehicle_id}
                  className="hover:bg-purple-50"
                >
                  {(Object.keys(vehicle) as Array<keyof Vehicle>).map(
                    (column) => (
                      <TableCell key={column} className="text-purple-900">
                        {vehicle[column]}
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
