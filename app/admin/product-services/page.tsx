import AddProduct from "@/components/Admin/AddProduct/AddProduct";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export default function page() {
  return (
    <div className="w-full flex flex-col px-4 py-4 space-y-4 border rounded-md">
      <div className="flex w-full flex-col gap-6 border-0">
        <Tabs defaultValue="change money">
          <TabsList>
            <TabsTrigger value="change money">Change Money</TabsTrigger>
            <TabsTrigger value="shop">Shop With Us</TabsTrigger>
          </TabsList>

          <TabsContent value="change money">
            <p>Nothing to see here yet!</p>
          </TabsContent>
          <TabsContent value="shop">
            <AddProduct />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
