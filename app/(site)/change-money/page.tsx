import React from "react";
import Image from "next/image";

import currencyImage from "@/public/currencyImage.png";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, PhoneIncoming } from "lucide-react";
import { ExchangeModal } from "@/components/ExchangeModal";
import exchangerates from "@/components/ChangeMoney/exCurr";

type Steps = {
  id: number;
  step: string;
};
export default function page() {
  const steps: Steps[] = [
    { id: 1, step: "Choose currencies you wish to change" },
    {
      id: 2,
      step: "Enter amount you wish to convert (you'll get an automatic feedback on the amount you'll recieve)",
    },
    { id: 3, step: "Select payment method of our provider option" },
    {
      id: 4,
      step: "Make transfer and tahe a screenshot of payment or printout receipts",
    },
    { id: 5, step: "Upload payment receipt and Receive Barcode " },
  ];

  return (
    <section className="w-full border-0 max-sm:px-4 bg-white">
      <div className="flex flex-col py-16 px-8 space-y-8 border-0 max-sm:px-0">
        <div className="flex items-center justify-center">
          <Image src={currencyImage} alt="currency" priority className="" />
        </div>

        <div className="flex flex-col justify-center items-center border-0">
          <h1 className="font-semibold text-3xl text-[#081F5C] w-72 text-center">
            Fourth View Currency Exchange
          </h1>
          <p className="font-base text-[#081F5C] tracking-widest text-center border-0">
            With live rates and Updates
          </p>
        </div>

        <div className="flex flex-col justify-center items-center border-0 space-y-2 px-4 max-sm:px-0 w-full">
          <h1 className="font-semibold text-xl text-[#081F5C] w-72 text-center">
            Current Rates
          </h1>
          <div
            className="w-full grid lg:grid-cols-6 md:grid-cols-4 space-x-4 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-4 justify-center items-center 
            border-0 max-sm:grid max-sm:grid-cols-2 md:space-x-4 max-sm:pb-12 px-4 max-sm:px-2"
          >
            {exchangerates.map((rate) => (
              <div key={`${rate.from}-${rate.to}`}>
                <div className="flex flex-col space-y-2 items-center justify-center border-0 px-6 py-4">
                  <p className="text-sm font-normal text-[#081F5C">
                    {rate.from} to {rate.to}
                  </p>

                  <Button
                    variant="outline"
                    className="w-full bg-blue-950 text-white"
                  >
                    {rate.rate}
                  </Button>

                  <p
                    className={`${
                      rate.available
                        ? "text-sm font-normal text-green-500"
                        : "text-sm font-normal text-red-500"
                    }`}
                  >
                    {rate.available ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center space-y-6 items-center border-0 pb-12 bg-blue-950">
        <p className="text-white font-semibold text-xl text-center px-4 py-4">
          Receive, Change, Send Money in 5 Easy Steps
        </p>

        <div className="grid grid-cols-3 max-sm:grid-cols-1 border-0 max-sm:w-full gap-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center px-4 max-sm:w-full"
            >
              <div className="w-8 h-8 rounded-full border flex items-center justify-center">
                <p className="text-white">{step.id}</p>
              </div>

              <div className="w-48 h-28 max-sm:w-80 max-sm:justify-center rounded-md border flex items-center mt-2 px-2.5 py-2 ">
                <p className="text-white text-center text-sm">{step.step}</p>
              </div>
            </div>
          ))}
        </div>

        <ExchangeModal />

        <p className="text-white font-semibold text-xl text-center px-4 py-4">
          For further enquiries, reach us on
        </p>
        <div className="flex flex-row space-x-4 max-sm:flex-col border-0">
          <div className="flex flex-row space-x-3 items-center justify-center p-2">
            <PhoneIncoming className="w-4 h-4" color="white" />
            <p className="text-white text-sm">+234 813 123 4567</p>
          </div>
          <div className="flex flex-row space-x-3 items-center justify-center p-2">
            <Mail className="w-4 h-4" color="white" />
            <p className="text-white text-sm">support@gmail.com</p>
          </div>
          <div className="flex flex-row space-x-3 items-center justify-center p-2">
            <MessageCircle className="w-4 h-4" color="white" />
            <p className="text-white text-sm">Live Chat</p>
          </div>
        </div>
      </div>
    </section>
  );
}
