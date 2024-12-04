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
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";

const formSchema = z.object({
  product_name: z.string(),
  quantity: z.string(),
  reorder_level: z.string(),
});

export default function InventoryList() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      quantity: "",
      reorder_level: "",
    },
  });

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await axios.get("http://localhost:5000/inventory");
        setInventory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const { toast } = useToast();

  const onEditCustomer = async (
    data: z.infer<typeof formSchema>,
    id: number
  ) => {
    console.log(data, id);
    try {
      await axios.put(`http://localhost:5000/inventory/${id}`, data);
      const updatedInventory = inventory.map((item) => {
        if (item.inventory_id === id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      });
      setInventory(updatedInventory);
      editForm.reset();
      toast({
        title: "Success",
        description: "Inventory item updated successfully.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An error occurred while updating the inventory item.",
      });
    }
  };

  if (loading) {
    return (
      <p className="text-center text-xl text-purple-900">
        Loading inventory...
      </p>
    );
  }

  if (inventory.length === 0) {
    return (
      <p className="text-center text-xl text-purple-900">
        No inventory items found.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-purple-900">
        Inventory Items
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-purple-100 text-purple-900">
                Product Name
              </TableHead>
              <TableHead className="bg-purple-100 text-purple-900">
                Quantity
              </TableHead>
              <TableHead className="bg-purple-100 text-purple-900">
                Reorder Level
              </TableHead>
              <TableHead className="bg-purple-100 text-purple-900">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.inventory_id}>
                <TableCell className="text-purple-900">
                  {item.product_name}
                </TableCell>
                <TableCell className="text-purple-900">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-purple-900">
                  {item.reorder_level}
                </TableCell>
                <TableCell>
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
                        <DialogTitle>Edit Inventory Details</DialogTitle>
                        {/* <DialogDescription>
                              Make changes to your profile here. Click save when
                              you&apos;re done.
                            </DialogDescription> */}
                      </DialogHeader>
                      <Form {...editForm}>
                        <form
                          onSubmit={editForm.handleSubmit((data) =>
                            onEditCustomer(data, item.inventory_id)
                          )}
                          className="space-y-4"
                        >
                          <FormField
                            control={editForm.control}
                            name="product_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-purple-900">
                                  Product Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={item.product_name}
                                    {...field}
                                    className="bg-white text-purple-900"
                                    defaultValue={item.product_name}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editForm.control}
                            name="quantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-purple-900">
                                  Quantity
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder={item.quantity.toString()}
                                    {...field}
                                    className="bg-white text-purple-900"
                                    defaultValue={item.quantity}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editForm.control}
                            name="reorder_level"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-purple-900">
                                  Reorder Level
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={item.reorder_level.toString()}
                                    type="number"
                                    {...field}
                                    defaultValue={item.reorder_level}
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
                              Edit Inventory Item
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
    </div>
  );
}
