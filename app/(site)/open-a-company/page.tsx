"use client";

import AppCarousel from "@/components/Slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

type RequiredDocumentsType = {
  id: number;
  document: string;
};
export default function page() {
  const requiredDocuments: RequiredDocumentsType[] = [
    { id: 1, document: "International passport with notarized documents" },
    {
      id: 2,
      document:
        "Scanned copies of original, legalized degree (stamped at the Chinese embassy in your country)",
    },
    {
      id: 3,
      document:
        "Scanned copies of original, legalized police non-criminal record certificate. (stamped at the Chinese embassy at your country)",
    },
    {
      id: 4,
      document:
        "Scanned copy of a work experience letter. (work timeline must not overlap with study time, if you dont have one, we can help with making one with a fee).",
    },
    {
      id: 5,
      document: "Upload payment receipt and Receive QR code (if needed).",
    },
  ];
  return (
    <div className="w-full border-0 flex flex-col space-y-6">
      <div className="max-sm:px-4 flex items-center sm:px-6 lg:px-12 flex-col space-y-4">
        <AppCarousel />

        <h2 className="font-bold text-3xl w-full max-sm:w-80 text-center text-blue-950">
          Start your Business Journey in China
        </h2>

        <p className="lg:text-lg leading-8 sm:text-base text-center max-sm:text-center w-full">
          Unlock access to the world&apos;s largest markets. From comapny
          registration to legal compliance, Our experts team guides you through
          every step of setting up your business in China efficiently,
          transparently, and with full local suppprt.
        </p>
      </div>

      <div className="w-full flex flex-col justify-center space-y-6 items-center border-0 pb-12 bg-blue-950">
        <p className="text-white font-semibold text-xl text-center px-4 py-4">
          Required Documents
        </p>

        <div className="grid grid-cols-3 max-sm:grid-cols-1 border-0 max-sm:w-full gap-y-4">
          {requiredDocuments.map((required) => (
            <div
              key={required.id}
              className="flex flex-col items-center px-4 max-sm:w-full border-0"
            >
              <div className="w-8 h-8 rounded-full border flex items-center justify-center">
                <p className="text-white">{required.id}</p>
              </div>

              <div className="w-56 h-40 max-sm:w-80 max-sm:justify-center rounded-md border flex items-center mt-2 px-2.5 py-2 ">
                <p className="text-white text-center text-sm">
                  {required.document}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-sm:px-4 flex items-center sm:px-6 lg:px-12 flex-col space-y-4">
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-3xl w-full max-sm:w-80 text-center text-blue-950">
            Personal Information
          </h2>

          <div className="w-full flex flex-col space-y-2 py-2">
            <Label className="text-red-500">Required </Label>
            <Input
              type="email"
              // value=""
              placeholder="Email Address"
              className="py-5px-4"
            />

            <Label className="text-red-500">Required </Label>
            <Input
              type="email"
              // value=""
              placeholder="WhatsApp Phone Number"
              className="py-5 px-4"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <h2 className="font-bold text-3xl w-full max-sm:w-80 text-center text-blue-950">
            Upload Document
          </h2>

          <div className="w-full flex flex-col space-y-2 py-2">
            <Label htmlFor="passport" className="text-slate-500">
              Passport Profile Page
            </Label>
            <Input
              type="file"
              // value=""
              placeholder="Passport profile page"
              className="cursor-pointer"
            />

            <Label htmlFor="degree" className="text-slate-500">
              College Degree
            </Label>
            <Input
              type="file"
              // value=""
              placeholder="College degree"
              className="cursor-pointer"
            />

            <Label htmlFor="police-record" className="text-slate-500">
              Police Non-criminal Record Certificate
            </Label>
            <Input
              type="file"
              // value=""
              placeholder="Police Non-criminal Record Certificate"
              className="cursor-pointer"
            />

            <Label htmlFor="work-experience" className="text-slate-500">
              Work Experience Letter
            </Label>
            <Input
              type="file"
              // value=""
              placeholder="Work Experience Letter"
              className="cursor-pointer"
            />

            <Button
              variant="outline"
              className="w-fit bg-blue-950 text-white flex self-end"
            >
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
