"use client";

import Image from "next/image";

import nairaCurrency from "@/public/naira-image.png";
import yuanCurrency from "@/public/yuan-image.png";
import cryptoTether from "@/public/tether-image.png";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function MoneySection() {
  const currencyImages = [
    { src: nairaCurrency, alt: "Naira Currency", width: 150, height: 180 },
    { src: yuanCurrency, alt: "Yuan Currency", width: 160, height: 180 },
    { src: cryptoTether, alt: "Crypto Tether", width: 250, height: 250 },
  ];

  const router = useRouter();

  return (
    <section className="w-full border-0 px-8 max-sm:px-4 bg-blue-50">
      <div className="flex flex-row pt-12 space-x-4 max-sm:flex-col-reverse border-0 max-sm:gap-4 justify-between mx-auto">
        <div className="grid grid-cols-2 border-0 w-1/2 max-sm:w-full px-4 gap-4">
          {currencyImages.map((currency, index) =>
            currency.src !== cryptoTether ? (
              <div
                className="border-0 flex w-full items-center justify-center bg-white rounded-md"
                key={index}
              >
                <Image
                  src={currency.src}
                  alt={currency.alt}
                  width={currency.width}
                  height={currency.height}
                  placeholder="blur"
                />
              </div>
            ) : (
              <div
                className="col-span-2 flex justify-center items-center bg-white rounded-md w-1/2 max-sm:h-24 justify-self-center"
                key={index}
              >
                <Image
                  src={currency.src}
                  alt={currency.alt}
                  width={currency.width}
                  height={currency.height}
                  placeholder="blur"
                />
              </div>
            )
          )}
        </div>
        <div className="relative w-1/2 max-sm:w-full items-center flex flex-col border-0 py-8 lg:h-72 space-y-4">
          <h1 className="font-bold text-3xl w-60 text-center text-blue-950">
            Change money with us
          </h1>

          <p className="text-lg leading-8 text-left max-sm:text-center w-full">
            Experience hassle - free currency exchange at your finger tips.
            Whether you&apos;re traveling abroad, sending money to loved ones,
            or managing international payments, we offer a fast, transparent,
            and secure transactions.
          </p>

          <Button
            variant="outline"
            className="text-white bg-blue-950 absolute bottom-0 left-0"
            onClick={() => router.push("/change-money")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
