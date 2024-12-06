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
  SearchIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";

type Customer = {
  customer_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Phone must be in format: 123-456-7890",
  }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
});

export default function CustomerTable() {
  const { toast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Customer | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    async function fetchCustomers() {
      try {
        const response = await axios.get("http://localhost:5000/customers");
        const fetchedCustomers = response.data;
        console.log(fetchedCustomers);
        setCustomers(fetchedCustomers);
        setFilteredCustomers(fetchedCustomers);
      } catch (error) {
        console.error(error);
        setCustomers([]);
        setFilteredCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const handleFilter = (value: string) => {
    setFilterValue(value);
    if (customers.length === 0) {
      setFilteredCustomers([]);
      return;
    }
    const filtered = customers.filter((customer) =>
      Object.values(customer).some((field) =>
        field.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredCustomers(filtered);
  };

  const handleSort = (column: keyof Customer) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...filteredCustomers].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCustomers(sorted);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/customers",
        values
      );
      setCustomers([...customers, response.data.data]);
      setFilteredCustomers([...filteredCustomers, response.data.data]);
      setIsAddCustomerOpen(false);
      toast({
        title: "Success",
        description: "The customer has been added to the database.",
      });
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const onEditCustomer = async (
    values: z.infer<typeof formSchema>,
    customer_id: number
  ) => {
    console.log(values, customer_id);
    try {
      const response = await axios.put(
        `http://localhost:5000/customers/${customer_id}`,
        values
      );
      const updatedCustomer = response.data.data;
      const updatedCustomers = customers.map((customer) =>
        customer.customer_id === customer_id ? updatedCustomer : customer
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      toast({
        title: "Success",
        description: "The customer details have been updated.",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCustomer = async (customer_id: number) => {
    try {
      await axios.delete(`http://localhost:5000/customers/${customer_id}`);
      const updatedCustomers = customers.filter(
        (customer) => customer.customer_id !== customer_id
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      toast({
        title: "Success",
        description: "The customer has been deleted.",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4 py-8 h-screen bg-purple-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-900">
        Customer Management
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Input
              placeholder="Search customers..."
              value={filterValue}
              onChange={(e) => handleFilter(e.target.value)}
              className="pl-10 bg-purple-100 text-purple-900 placeholder-purple-400"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </div>
          <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                <PlusIcon className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-purple-50">
              <DialogHeader>
                <DialogTitle className="text-purple-900">
                  Add New Customer
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123-456-7890"
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">
                          Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main St"
                            {...field}
                            className="bg-white text-purple-900"
                          />
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
                      Add Customer
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        {loading ? (
          <p className="text-center text-xl text-purple-900">Loading...</p>
        ) : customers.length === 0 ? (
          <p className="text-center text-xl text-purple-900">
            No customers found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {(Object.keys(customers[0]) as Array<keyof Customer>)
                    .filter((column) => column !== "customer_id")
                    .map((column) => (
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
                    ))}
                  <TableHead className="bg-purple-100 text-purple-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.customer_id}
                    className="hover:bg-purple-50"
                  >
                    {(Object.keys(customer) as Array<keyof Customer>)
                      .filter((column) => column !== "customer_id")
                      .map((column) => (
                        <TableCell key={column} className="text-purple-900">
                          {customer[column]}
                        </TableCell>
                      ))}
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-600 text-purple-600 hover:bg-purple-100 mr-2"
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Delete Customer Data</DialogTitle>
                          </DialogHeader>
                          <Label>
                            Are you sure you want to delete this customer?
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-600 text-purple-600 hover:bg-purple-100"
                            onClick={() => deleteCustomer(customer.customer_id)}
                          >
                            Delete
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-600 text-purple-600 hover:bg-purple-100"
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Customer Details</DialogTitle>
                            {/* <DialogDescription>
                              Make changes to your profile here. Click save when
                              you&apos;re done.
                            </DialogDescription> */}
                          </DialogHeader>
                          <Form {...editForm}>
                            <form
                              onSubmit={editForm.handleSubmit((data) =>
                                onEditCustomer(data, customer.customer_id)
                              )}
                              className="space-y-4"
                            >
                              <FormField
                                control={editForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-purple-900">
                                      Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder={customer.name}
                                        {...field}
                                        className="bg-white text-purple-900"
                                        defaultValue={customer.name}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-purple-900">
                                      Email
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="email"
                                        placeholder={customer.email}
                                        {...field}
                                        className="bg-white text-purple-900"
                                        defaultValue={customer.email}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-purple-900">
                                      Phone
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder={customer.phone}
                                        {...field}
                                        defaultValue={customer.phone}
                                        className="bg-white text-purple-900"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name="address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-purple-900">
                                      Address
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder={customer.address}
                                        {...field}
                                        defaultValue={customer.address}
                                        className="bg-white text-purple-900"
                                      />
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
                                  Edit Customer
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
