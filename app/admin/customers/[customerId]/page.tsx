import AdminTable from "@/components/Admin/AdminTable";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  CreditCard,
  ListOrdered,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  const headers = ["RefernceId", "Amount", "Type", "Email", "Date", "Status"];

  return (
    <div className="w-full flex flex-col px-4 py-4 max-sm:px-1 items-center space-y-4 border-0 rounded-md">
      <div className="w-full flex lg:flex-row max-sm:flex-col md:flex-col sm:flex-col gap-4 border-0">
        <div className="lg:w-3/4 max-sm:w-full border flex flex-col rounded-md px-4 py-4 gap-4">
          <div className="flex border rounded-full w-40 h-40 items-center text-center justify-center">
            <p className="text-center text-xl">{customerId}</p>
          </div>

          <div className="w-full flex flex-col gap-2 border-0">
            <div className="flex flex-row justify-between text-slate-500 text-base">
              <label>First Name</label>
              <p className="font-light">Terna</p>
            </div>

            <div className="flex flex-row justify-between text-slate-500 text-base ">
              <label>Last Name</label>
              <p className="font-light">Nanev</p>
            </div>

            <div className="flex flex-row justify-between text-slate-500 text-base ">
              <label>Email</label>
              <p className="font-light">ternathompson2@gmail.com</p>
            </div>

            <div className="flex flex-row justify-between text-slate-500 text-base">
              <label>Phone</label>
              <p className="font-light">+234 8128909551</p>
            </div>
          </div>
        </div>

        <div className="w-full flex lg:flex-row max-sm:flex-col sm:flex-col gap-4 lg:justify-between border-0">
          <div className="w-62 max-sm:w-full sm:w-full flex flex-col h-max border rounded-md px-4 py-4 gap-2">
            <div className="flex flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">Total Transaction Amount</p>

              <CreditCard className="w-8 h-8" strokeWidth={1} color="green" />
            </div>

            <p className="text-2xl">N56,000.00</p>

            <div className="flex flex-row gap-1 items-center">
              <TrendingUp className="h-4 w-4" color="green" />

              <p className="text-xs text-green-500">45% from last month</p>
            </div>
          </div>

          <div className="w-62 max-sm:w-full sm:w-full flex flex-col h-max border rounded-md px-4 py-4 gap-2">
            <div className="flex flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">Orders</p>

              <ListOrdered className="w-8 h-8 text-blue-950" strokeWidth={1} />
            </div>

            <p className="text-2xl">15</p>

            <div className="flex flex-row gap-1 items-center">
              <TrendingDown className="h-4 w-4" color="red" />

              <p className="text-xs text-red-500">15% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <AdminTable
        headers={headers}
        caption={`List of tranactions made by customer ${customerId}`}
      >
        <TableRow className="text-slate-500 text-sm font-light">
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>600,000.00</TableCell>
          <TableCell>Purchase</TableCell>
          <TableCell>ternathompson2@gmail.com</TableCell>
          <TableCell>16-10-2025</TableCell>
          <TableCell className="">Success</TableCell>
        </TableRow>
      </AdminTable>
    </div>
  );
}
