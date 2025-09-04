import AppCarousel from "../Slider";

export default function TopSection() {
  return (
    <div className="w-full border-0 flex flex-col space-y-6">
      <div className="max-sm:px-4 flex items-center sm:px-6 lg:px-12 flex-col space-y-4">
        <AppCarousel />

        <h2 className="font-bold text-3xl w-96 max-sm:w-80 text-center text-blue-950">
          Discover More With Us
        </h2>

        <p className="lg:text-lg leading-8 sm:text-base text-center max-sm:text-center w-full">
          We specialize in providing personalized tour guide and factory visit
          services that connects you with the heart of the industry and culture.
          Whether you are exploring new business opportunities or simply curious
          about how things are made, our expertly guided tours offer an inside
          look you won&apos;t find anywhere else.
        </p>

        <p className="lg:text-lg leading-8 sm:text-base text-center max-sm:text-center w-full">
          Let us handle the pricing - you just enjoy the experience, the latest
          fashionable outfits to shoes and accessories. import to export of
          goods, factory visits, travel guide, and currency exchange.
        </p>
      </div>
    </div>
  );
}
