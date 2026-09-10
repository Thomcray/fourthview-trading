import UpdateCar from "@/components/Admin/UpdateCar/UpdateCar";
import React from "react";

export default function CarView({ params }: { params: { carId: string } }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <UpdateCar params={params} />
    </div>
  );
}
