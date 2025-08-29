"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Geist, Geist_Mono } from "next/font/google";
import { Dropdown } from "../Dropdown";
import { useEffect, useState } from "react";
import { Calendar } from "../ui/calendar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function BookModal() {
  const [purpose, setPurpose] = useState<string>("");
  const [fDetails, setFDetails] = useState<boolean>(false);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleBook = () => {
    if (purpose === "Factory Visit") {
      setFDetails(true);
    }
  };

  useEffect(() => {
    if (purpose !== "Factory Visit") {
      setFDetails(false);
    }
  }, [purpose]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex self-end bg-blue-950 text-white cursor-pointer"
        >
          Get Started
        </Button>
      </DialogTrigger>
      <DialogContent className={`${geistSans.className} antialiased w-full`}>
        <DialogHeader className="px-0 mt-4">
          <DialogTitle className="text-base">Personal Information</DialogTitle>

          <DialogDescription>
            Select the purpose of booking and fill in your your details.
          </DialogDescription>
        </DialogHeader>

        <Dropdown purpose={purpose} setPurpose={setPurpose} />

        {!fDetails && (
          <div className="grid gap-6 px-0 py-4">
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-firstname">First Name</Label>
              <Input id="tabs-demo-firstname" type="text" placeholder="John" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-lastname">Last Name</Label>
              <Input id="tabs-demo-lastname" type="text" placeholder="Doe" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-email">Email Address</Label>
              <Input
                id="tabs-demo-email"
                type="email"
                placeholder="myemail@gmail.com"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-phone">Phone Number</Label>
              <Input
                id="tabs-demo-phone"
                type="tel"
                placeholder="08129293939"
              />
            </div>
          </div>
        )}

        {fDetails && purpose === "Factory Visit" && (
          <div className="grid gap-6 px-0 overflow-y-scroll ">
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-factorname">Factory Name</Label>
              <Input
                id="tabs-demo-factoryname"
                type="text"
                placeholder="Factory Name"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-faddress">Factory Address</Label>
              <Input
                id="tabs-demo-faddress"
                type="text"
                placeholder="Factory Address"
              />
            </div>
            <div className="h-40 grid gap-3 border-0">
              <Label htmlFor="tabs-demo-visitdate">Visit Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
              />
            </div>
          </div>
        )}

        <DialogFooter className="items-end">
          {/* <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose> */}

          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer"
            onClick={handleBook}
            disabled={!purpose ? true : false}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
