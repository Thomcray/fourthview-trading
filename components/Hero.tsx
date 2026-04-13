// components/Hero.tsx (Simpler version)
"use client";

import Image from "next/image";
import heroImage from "@/public/heroImage.png";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="w-full flex flex-col">
      {/* Hero Image Section */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            fill
            placeholder="blur"
            alt="hero-image"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              Fourth View has you covered
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              From the latest fashionable outfits to shoes and accessories,
              import to export of goods, factory visits, travel, guide, and
              currency exchange
            </p>
            <Button
              onClick={() => router.push("/shop")}
              className="mt-8 bg-white text-blue-950 hover:bg-gray-100 px-8 py-6 rounded-xl font-semibold shadow-lg"
            >
              Explore Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-blue-950 text-white text-center py-10 px-4 sm:px-6 lg:px-8">
        <p className="text-base sm:text-lg font-light mb-1">
          Our platform delivers a smooth, seamless experience
        </p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Even for first time users
        </h2>
      </div>
    </section>
  );
}
