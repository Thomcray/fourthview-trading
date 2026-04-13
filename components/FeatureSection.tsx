// components/FeatureSection.tsx
"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle, Star } from "lucide-react";

interface FeatureSectionProps {
  heading: string;
  body: string;
  href: string;
  image: StaticImageData;
  imageAlt: string;
  reverse?: boolean;
  paddingY?: string;
  badge?: string;
  buttonText?: string;
  rating?: string;
  features?: { icon: React.ElementType; title: string; description: string }[];
}

export default function FeatureSection({
  heading,
  body,
  href,
  image,
  imageAlt,
  reverse = false,
  paddingY = "py-14",
  badge,
  buttonText = "Get Started",
  rating,
  features,
}: FeatureSectionProps) {
  const router = useRouter();

  // Default features if none provided
  const defaultFeatures = [
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description: "Premium products",
    },
    {
      icon: CheckCircle,
      title: "Fast Delivery",
      description: "Worldwide shipping",
    },
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 ${paddingY}`}
    >
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
          className={`max-w-6xl mx-auto flex flex-col gap-12 items-center ${
            reverse ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
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
                  src={image}
                  placeholder="blur"
                  alt={imageAlt}
                  height={400}
                  width={600}
                  className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rating Badge (Optional) */}
                {rating && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-semibold text-gray-800">
                      {rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-1/2 flex flex-col gap-6"
          >
            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
                <Sparkles className="w-4 h-4" />
                {badge}
              </div>
            )}

            {/* Heading */}
            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-blue-950 leading-tight">
              {heading}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
              {body}
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {displayFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <feature.icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {feature.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-200">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Secure Transactions
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Best Price Guarantee
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                24/7 Customer Support
              </span>
            </div>

            {/* CTA Button */}
            <Button
              className="group bg-gradient-to-r from-blue-950 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto cursor-pointer"
              onClick={() => router.push(href)}
            >
              {buttonText}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
