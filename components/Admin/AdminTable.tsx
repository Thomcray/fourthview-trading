import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Props = {
  headers: string[];
  caption: string;
  children: React.ReactNode;
};

export default function AdminTable({ headers, caption, children }: Props) {
  return (
    <div className="w-full max-sm:w-80 border rounded-md">
      <Table className="table-auto border-collapse">
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            {headers.map((header, idx) => (
              <TableHead
                className="w-[100px] text-slate-500 text-sm font-normal"
                key={idx}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
