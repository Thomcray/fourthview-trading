import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

type Props = {
  banner: StaticImageData;
  location?: string | boolean;
  bannerText?: string;
  topRight?: ReactNode;
};

export default function Banner({
  banner,
  location = "",
  bannerText = "",
  topRight,
}: Props) {
  return (
    <div className="w-full border-0 max-sm:overflow-y-scroll border-black flex flex-col space-y-6">
      {/* topRight positioned above the image, not inside it */}
      {topRight && (
        <div className="relative w-full flex justify-end px-4 pt-4 pb-2 z-20">
          {topRight}
        </div>
      )}

      <div className="w-full h-96 border-0 relative">
        <Image
          src={banner}
          alt="banner"
          fill
          placeholder="blur"
          className="w-full h-full object-cover border-0"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 60%)",
          }}
        />

        {location && (
          <div className="top-4 left-0 right-0 max-sm:px-2 absolute flex flex-row text-center border-0 w-full justify-center">
            <h1 className="w-2xl max-sm:text-4xl font-extrabold text-blue-950 sm:text-5xl leading-12 lg:text-5xl">
              {bannerText}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
