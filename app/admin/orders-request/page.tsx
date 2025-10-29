import AdminTable from "@/components/Admin/AdminTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { CloudDownload, Search } from "lucide-react";

export default function page() {
  const headers = ["ReferenceId", "Amount", "Type", "User", "Date", "Status"];
  return (
    <div className="w-full flex flex-col px-4 py-4 space-y-4 border rounded-md">
      <h1 className="text-xl text-slate-500 text-left">
        Orders & Request List
      </h1>

      <div className="flex flex-row justify-between items-center max-sm:gap-2">
        <div className="flex flex-row gap-2 items-center border rounded-md py-1 px-2">
          <Search className="w-4 h-4 cursor-pointer" />

          <Input
            type="search"
            name="search"
            placeholder="Search by Reference Number, Category, Date..."
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

      <div className="border rounded-md">
        <AdminTable
          headers={headers}
          caption="A list of recent orders & requests."
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
    </div>
  );
}
