"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  purpose: string;
  setPurpose: Dispatch<SetStateAction<string>>;
};

export function Dropdown({ purpose, setPurpose }: Props) {
  return (
    <div className="w-80">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {purpose === "" ? "Select purpose" : purpose} <ArrowDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {/* <DropdownMenuLabel>Please select purpose</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuRadioGroup value={purpose} onValueChange={setPurpose}>
            <DropdownMenuRadioItem value="Factory Visit">
              Factory Visit
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Tour Guide">
              Tour Guide
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
