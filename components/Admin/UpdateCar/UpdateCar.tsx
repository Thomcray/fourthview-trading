import React from "react";
import UpdateCarForm from "./UpdateCarForm";
import { getCarById } from "@/app/_lib/data-services";

type Params = {
  params: { carId: string };
};

type Car = {
  id: number;
  brandName: string;
  year: number;
  condition: string;
  mileage: number;
  price: number;
  shippingCost: number;
  clearingCost: number;
  totalPrice: number;
  imageUrl: string[];
};

export default async function UpdateCar({ params }: Params) {
  const getParams = await params;
  const car: Car | null = await getCarById(Number(getParams.carId));

  if (!car) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Car not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <UpdateCarForm car={car} />
    </div>
  );
}
