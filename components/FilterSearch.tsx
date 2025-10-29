import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function FilterSearch() {
  return (
    <div className="w-full flex flex-row items-center max-sm:flex-col-reverse max-sm:gap-3 border-0 justify-between">
      <div className="flex flex-row border rounded-md text-slate-500 text-sm">
        <Button
          variant="ghost"
          className="w-20 rounded-r-none border-r cursor-pointer"
        >
          12 months
        </Button>
        <Button
          variant="ghost"
          className="w-20 rounded-l-none rounded-r-none border-r cursor-pointer"
        >
          30 days
        </Button>
        <Button
          variant="ghost"
          className="w-20 rounded-l-none rounded-r-none border-r cursor-pointer"
        >
          7 days
        </Button>
        <Button
          variant="ghost"
          className="w-20 rounded-l-none border-r cursor-pointer"
        >
          24 hours
        </Button>
      </div>

      <div className="flex flex-row border-0">
        <Input
          type="search"
          name="search"
          className="rounded-r-none"
          placeholder="Search..."
        />
        <Button
          variant="ghost"
          className="rounded-l-none bg-blue-950 text-white cursor-pointer"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
