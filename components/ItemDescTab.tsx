import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, RotateCcw, Star } from "lucide-react";

export default function ItemDescTab() {
  return (
    <div className="flex w-full flex-col gap-6 px-2">
      <Tabs defaultValue="shipping">
        <TabsList className="w-full justify-start gap-1 bg-slate-100 p-1 rounded-lg">
          <TabsTrigger
            value="shipping"
            className="flex flex-row items-center gap-1.5 py-2 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            <Package className="w-4 h-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger
            value="return"
            className="flex flex-row items-center gap-1.5 py-2 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            <RotateCcw className="w-4 h-4" />
            Return Policy
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex flex-row items-center gap-1.5 py-2 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            <Star className="w-4 h-4" />
            Reviews
          </TabsTrigger>
        </TabsList>

        {/* Shipping */}
        <TabsContent value="shipping">
          <Card className="border rounded-xl shadow-none mt-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-950" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-slate-600 leading-7">
              <p>
                General shipping at Fourth View is carried out{" "}
                <span className="font-medium text-slate-800">
                  twice a month
                </span>{" "}
                — on the{" "}
                <span className="font-medium text-slate-800">15th</span> and{" "}
                <span className="font-medium text-slate-800">30th/31st</span>.
              </p>

              <ul className="flex flex-col gap-2">
                <li className="flex flex-row gap-2 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  Orders placed before the 14th will be processed and sent out
                  by the 15th.
                </li>
                <li className="flex flex-row gap-2 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  Orders placed after the 15th will be processed and sent out by
                  the 30th or 31st.
                </li>
              </ul>

              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-blue-800 text-sm">
                For special orders, a special shipping fee will apply to ensure
                expedited processing and delivery.
              </div>

              <p className="text-slate-500 text-xs">
                For questions or assistance, contact our customer support team.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Return Policy */}
        <TabsContent value="return">
          <Card className="border rounded-xl shadow-none mt-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-950" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-slate-600 leading-7">
              <p>
                We accept returns within{" "}
                <span className="font-medium text-slate-800">7 days</span> of
                delivery for items in their original condition and packaging.
              </p>

              <ul className="flex flex-col gap-2">
                {[
                  "Item must be unused and in original packaging.",
                  "Returns are not accepted for special or custom orders.",
                  "Shipping costs for returns are the responsibility of the customer.",
                  "Refunds are processed within 5–7 business days after inspection.",
                ].map((point, idx) => (
                  <li key={idx} className="flex flex-row gap-2 items-start">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 text-yellow-800 text-sm">
                To initiate a return, please contact our support team with your
                order reference.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews">
          <Card className="border rounded-xl shadow-none mt-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-950" />
                Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                <Star className="w-10 h-10 stroke-1" />
                <p className="text-sm">No reviews yet.</p>
                <p className="text-xs">Be the first to review this product.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
