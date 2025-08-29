type Services = string;
export default function ServicesOffered() {
  const services: Services[] = [
    "Airport Pickup",
    "Hotel Booking",
    "City Tours",
    "Factory Visits",
    "Cultural Experiences",
    "Shopping Assistance",
    "Currency Exchange",
    "Travel Insurance",
  ];
  return (
    <div className="bg-blue-950 w-full px-4 py-8 space-y-4 flex flex-col items-center justify-center">
      <h1 className="font-bold text-3xl w-96 max-sm:w-80 text-center text-white">
        Services Offered
      </h1>

      <div className="grid grid-cols-4 max-sm:grid-cols-2">
        {services.map((service, index) => (
          <div
            key={index}
            className="text-white text-center border border-white m-2 p-4 rounded-lg"
          >
            {service}
          </div>
        ))}
      </div>
    </div>
  );
}
