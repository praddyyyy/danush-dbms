"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  product_name: z.string().min(1, { message: "Product name is required" }),
  quantity: z.number().min(0, { message: "Quantity must be 0 or greater" }),
  reorder_level: z
    .number()
    .min(0, { message: "Reorder level must be 0 or greater" }),
});

export default function InventoryForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      quantity: 0,
      reorder_level: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      await axios.post("http://localhost:5000/inventory", {
        product_name: values.product_name,
        quantity: values.quantity,
        reorder_level: values.reorder_level,
      });
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 bg-purple-100 rounded-lg border border-purple-200">
      <h2 className="text-2xl font-semibold mb-6 text-purple-900">
        {isEditing ? "Edit" : "Add"} Inventory Item
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-900">Product Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product name"
                    {...field}
                    className="bg-white text-purple-900"
                  />
                </FormControl>
                <FormDescription className="text-purple-700">
                  The name of the inventory item.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-900">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-white text-purple-900"
                  />
                </FormControl>
                <FormDescription className="text-purple-700">
                  The current quantity of the item in stock.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reorder_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-900">Reorder Level</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-white text-purple-900"
                  />
                </FormControl>
                <FormDescription className="text-purple-700">
                  The quantity at which the item should be reordered.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>{isEditing ? "Update" : "Add"} Item</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
