"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Shield,
  Award,
  Globe,
  Clock,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const benefits = [
  {
    icon: Award,
    title: "World-Class Education",
    description: "Study at top-ranked Chinese universities",
  },
  {
    icon: Globe,
    title: "Cultural Experience",
    description: "Immerse yourself in rich Chinese culture",
  },
  {
    icon: Shield,
    title: "Full Support",
    description: "Guidance throughout the application process",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Quick response and application processing",
  },
];

const steps = [
  {
    step: "01",
    title: "Fill Application",
    description: "Complete the online application form with your details",
  },
  {
    step: "02",
    title: "Upload Documents",
    description: "Submit all required documents for review",
  },
  {
    step: "03",
    title: "Get Reviewed",
    description: "Our team reviews your application within 48 hours",
  },
  {
    step: "04",
    title: "Start Your Journey",
    description: "Receive your admission letter and begin preparations",
  },
];

export default function StudyInChinaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white/20 p-5 rounded-full">
              <GraduationCap className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Study in China
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto mb-8"
          >
            Your gateway to world-class education in China. We guide you every
            step of the way.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/study-in-china/apply">
              <Button className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg gap-2 cursor-pointer">
                Apply Now <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Study in China?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              China offers world-class education, rich cultural experiences, and
              excellent career opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A simple 4-step process to get you studying in China
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">
                    {step.step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-blue-200" />
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-10 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Submit your application today and our team will get back to you
              within 48 hours.
            </p>
            <Link href="/study-in-china/apply">
              <Button className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-xl gap-2 cursor-pointer">
                Apply Now <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Have Questions?
          </h2>
          <p className="text-gray-600 mb-8">
            Our education consultants are here to help you
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-700">study@fourthview.com</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-700">+234 813 123 4567</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
