import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ItemDescTab() {
  return (
    <div className="flex w-full flex-col gap-6 px-2 border-0">
      <Tabs defaultValue="shipping">
        <TabsList className="py-6 px-4">
          <TabsTrigger value="shipping" className="py-4">
            Shipping
          </TabsTrigger>
          <TabsTrigger value="return">Return Policy</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <p>
                  General shipping at Fourth View is carried out twice a month
                  (on the 14 and 30th or 31st).
                </p>

                <ul className="list-disc list-inside space-y-1 px-4">
                  <li>
                    Orders placed before the 14th will be processed and sent out
                    by the 15th
                  </li>
                  <li>
                    Orders placed after the 15th will be processed and sent out
                    by the 30th or 31st.
                  </li>
                </ul>

                <p className="text-base font-normal text-black leading-7">
                  For special orders, please note that a special shipping fee
                  will apply to ensure expedited processing and delivery.
                </p>

                <p className="text-base font-normal text-black leading-7">
                  If you have any questions or require further assistance with
                  your order, feel free to contact our customer support team.
                  Enjoy your shopping experience with Fourth View.
                </p>
              </div>
            </CardContent>
            <CardFooter>{/* <Button>Save changes</Button> */}</CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="return">
          <Card></Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
