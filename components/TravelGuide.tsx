// components/TravelGuide.tsx
"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import factoryImage from "@/public/factoryImage.png";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Factory, MapPin, Star } from "lucide-react";

export default function TravelGuide() {
  const router = useRouter();

  const stats = [
    { value: "50+", label: "Factory Tours" },
    { value: "1000+", label: "Happy Travelers" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 sm:py-20">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center"
        >
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />

              {/* Image Container */}
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <Image
                  src={factoryImage}
                  placeholder="blur"
                  alt="Factory tour experience - See how products are made"
                  height={400}
                  width={600}
                  className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-1/2 flex flex-col gap-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
              <Compass className="w-4 h-4" />
              Explore with Us
            </div>

            {/* Heading */}
            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-blue-950 leading-tight">
              Travel Guide / Factory Visit
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
              Our platform connects you with unique, immersive factory visit
              experiences that reveal the artistry and innovation behind modern
              manufacturing.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Factory className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Factory Access
                  </p>
                  <p className="text-xs text-gray-500">
                    Behind-the-scenes tours
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Multiple Locations
                  </p>
                  <p className="text-xs text-gray-500">Across China</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              className="group bg-gradient-to-r from-blue-950 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
              onClick={() => router.push("/travel")}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
