import AdminTable from "@/components/Admin/AdminTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { CloudDownload, EllipsisVertical, Search } from "lucide-react";
import Link from "next/link";

export default function Customers() {
  const headers = [
    "CustomerId",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "",
  ];
  return (
    <div className="w-full flex flex-col px-4 py-4 space-y-4 border rounded-md">
      <h1 className="text-xl text-slate-500 text-left">Customer List</h1>

      <div className="flex flex-row justify-between items-center max-sm:gap-2">
        <div className="flex flex-row gap-2 items-center border rounded-md py-1 px-2">
          <Search className="w-4 h-4 cursor-pointer" />

          <Input
            type="search"
            name="search"
            placeholder="Search by name, phone number or customer ID"
            className="w-80 max-sm:w-full text-base text-slate-500 py-4 border-none focus-within:outline-hidden 
            focus-within:border-0 focus-within:ring-none focus-within:shadow-none shadow-none placeholder:text-xs placeholder:font-light"
          />
        </div>

        <Button
          variant="outline"
          className="flex flex-row gap-2 items-center border rounded-md p-2 cursor-pointer"
        >
          <CloudDownload className="w-4 h-4 text-slate-500" />
          <p className="text-slate-500 text-xs max-sm:hidden">Export report</p>
        </Button>
      </div>

      <div className="w-full border rounded-md overflow-hidden">
        <AdminTable headers={headers} caption="A list of customers.">
          <TableRow className="text-slate-500 text-sm font-light">
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Terna</TableCell>
            <TableCell>Nanev</TableCell>
            <TableCell>ternathompson2@gmail.com</TableCell>
            <TableCell>+234 8128909551</TableCell>
            <TableCell className="">
              <Link href={`/admin/customers/INV001`}>
                <EllipsisVertical className="w-4 h-4 text-slate-500 cursor-pointer" />
              </Link>
            </TableCell>
          </TableRow>
        </AdminTable>
      </div>
    </div>
  );
}
