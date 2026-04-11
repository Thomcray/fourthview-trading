"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Geist } from "next/font/google";
import { Dropdown } from "../Dropdown";
import { useEffect, useState } from "react";
import { Calendar } from "../ui/calendar";
import { toast } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function BookModal() {
  const [purpose, setPurpose] = useState("");
  const [fDetails, setFDetails] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    factoryName: "",
    factoryAddress: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (purpose !== "Factory Visit") setFDetails(false);
  }, [purpose]);

  const handleContinue = () => {
    if (purpose === "Factory Visit") setFDetails(true);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          purpose,
          visitDate: date?.toISOString() || null,
          factoryName: form.factoryName || null,
          factoryAddress: form.factoryAddress || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit booking");

      toast.success("Booking submitted successfully!");
      setOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        factoryName: "",
        factoryAddress: "",
      });
      setPurpose("");
      setFDetails(false);
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFactoryVisit = purpose === "Factory Visit";
  const canSubmit = isFactoryVisit ? fDetails : !!purpose;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Select the purpose of booking and fill in your details.
          </DialogDescription>
        </DialogHeader>

        <Dropdown purpose={purpose} setPurpose={setPurpose} type="booking" />

        {!fDetails && purpose && (
          <div className="grid gap-4 px-0 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="myemail@gmail.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="08129293939"
                required
              />
            </div>
          </div>
        )}

        {fDetails && isFactoryVisit && (
          <div className="grid gap-4 px-0 overflow-y-auto max-h-96">
            <div className="grid gap-2">
              <Label>Factory Name</Label>
              <Input
                name="factoryName"
                value={form.factoryName}
                onChange={handleChange}
                placeholder="Factory Name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Factory Address</Label>
              <Input
                name="factoryAddress"
                value={form.factoryAddress}
                onChange={handleChange}
                placeholder="Factory Address"
              />
            </div>
            <div className="grid gap-2">
              <Label>Visit Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
              />
            </div>
          </div>
        )}

        <DialogFooter className="items-end gap-2">
          {isFactoryVisit && !fDetails && (
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
              onClick={handleContinue}
              disabled={!purpose}
            >
              Continue
            </Button>
          )}
          {canSubmit && (
            <Button
              type="button"
              className="cursor-pointer bg-blue-950 text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Booking"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
