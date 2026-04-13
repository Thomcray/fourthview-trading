// components/BookModal.tsx
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
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Factory,
  MapPin,
  Calendar as CalendarIcon,
  ArrowRight,
  CheckCircle,
  X,
} from "lucide-react";

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
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    factoryName: "",
    factoryAddress: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error for this field when user types
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  useEffect(() => {
    if (purpose !== "Factory Visit") {
      setFDetails(false);
      setStep(1);
    }
  }, [purpose]);

  const validatePersonalInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\+\-\s]{10,}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFactoryDetails = () => {
    const newErrors: Record<string, string> = {};

    if (!form.factoryName.trim())
      newErrors.factoryName = "Factory name is required";
    if (!form.factoryAddress.trim())
      newErrors.factoryAddress = "Factory address is required";
    if (!date) newErrors.date = "Please select a visit date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validatePersonalInfo()) {
      setStep(2);
      setFDetails(true);
    }
  };

  const handleBack = () => {
    setStep(1);
    setFDetails(false);
  };

  const handleSubmit = async () => {
    if (!validateFactoryDetails()) return;

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

      toast.success("Booking submitted successfully! We'll contact you soon.");
      setOpen(false);
      // Reset form
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
      setStep(1);
      setErrors({});
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFactoryVisit = purpose === "Factory Visit";
  const canSubmit = purpose && (isFactoryVisit ? step === 2 : true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
          Book Your Experience
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`${geistSans.className} antialiased sm:max-w-lg max-h-[90vh] overflow-y-auto`}
      >
        {/* Progress Indicator */}
        {isFactoryVisit && purpose && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              1
            </div>
            <div
              className={`w-12 h-0.5 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              2
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-950">
            {!purpose
              ? "Book Your Experience"
              : isFactoryVisit && step === 1
                ? "Personal Information"
                : "Factory Visit Details"}
          </DialogTitle>
          <DialogDescription>
            {!purpose
              ? "Tell us about your visit so we can prepare the best experience for you."
              : isFactoryVisit && step === 1
                ? "Please provide your contact details to continue."
                : "Let us know which factory you'd like to visit."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!purpose ? (
            <Dropdown
              purpose={purpose}
              setPurpose={setPurpose}
              type="booking"
            />
          ) : (
            <AnimatePresence mode="wait">
              {isFactoryVisit && step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className={`pl-10 ${errors.firstName ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-500 text-xs">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-500 text-xs">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="myemail@gmail.com"
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="08129293939"
                        className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs">{errors.phone}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {isFactoryVisit && step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>
                      Factory Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Factory className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        name="factoryName"
                        value={form.factoryName}
                        onChange={handleChange}
                        placeholder="Factory Name"
                        className={`pl-10 ${errors.factoryName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.factoryName && (
                      <p className="text-red-500 text-xs">
                        {errors.factoryName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Factory Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        name="factoryAddress"
                        value={form.factoryAddress}
                        onChange={handleChange}
                        placeholder="Factory Address"
                        className={`pl-10 ${errors.factoryAddress ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.factoryAddress && (
                      <p className="text-red-500 text-xs">
                        {errors.factoryAddress}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Preferred Visit Date{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-lg border"
                      disabled={(date) => date < new Date()}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs">{errors.date}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {!isFactoryVisit && purpose && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Ready to Book!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Click the button below to submit your booking request. We'll
                    get back to you within 24 hours.
                  </p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isFactoryVisit && step === 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="cursor-pointer"
            >
              Back
            </Button>
          )}
          {isFactoryVisit && step === 1 && purpose && (
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={handleContinue}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {canSubmit && (!isFactoryVisit || step === 2) && (
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Booking"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
