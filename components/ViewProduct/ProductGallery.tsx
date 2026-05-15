"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { getPublicImageUrl } from "@/lib/images";
import { NormalizedProduct } from "@/types/product";

interface Props {
  product: NormalizedProduct;
  imageIdx: number;
  onImageLoad: () => void;
  imageLoading: boolean;
}

export default function ProductGallery({
  product,
  imageIdx,
  onImageLoad,
  imageLoading,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);

  const currentImage = product.imageUrl[imageIdx] ?? product.imageUrl[0];

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) setIsZoomed(true);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setMousePosition({ x: 50, y: 50 });
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 lg:w-2/5">
        <div
          className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in group"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={openModal}
        >
          {imageLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          <Image
            src={getPublicImageUrl(currentImage)}
            alt={product.name}
            fill
            className={`object-cover transition-opacity duration-200 ${
              isZoomed ? "opacity-0" : "opacity-100"
            }`}
            onLoad={onImageLoad}
            priority={imageIdx === 0}
            sizes="(max-width: 1024px) 50vw, 40vw"
          />

          {isZoomed && (
            <div
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: `url(${getPublicImageUrl(currentImage)})`,
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundSize: "250%",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 pointer-events-none">
            <ZoomIn className="w-4 h-4 text-slate-600" />
          </div>

          {product.discount != null && product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-30">
              -{product.discount}% OFF
            </span>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors cursor-pointer z-50"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative w-full max-w-4xl aspect-square max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getPublicImageUrl(currentImage)}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      )}
    </>
  );
}
