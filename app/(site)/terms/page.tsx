"use client";

import { motion } from "framer-motion";
import { FileCheck, Truck, CreditCard, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-900 to-blue-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Terms & Conditions
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-blue-400 mx-auto rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              By using Fourth View Trading Company's services, you agree to the following terms and conditions.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Service Agreement
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Fourth View provides sourcing, procurement, verification, trading support, and related business services based on client requests and available supplier information.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              Client Responsibility
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Clients are responsible for providing accurate product details, specifications, shipping information, and required documentation where applicable.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              Supplier & Product Verification
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              While we make reasonable efforts to verify suppliers and product quality, final purchase decisions remain the responsibility of the client.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payments
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              All payments for services, sourcing, shipping, or factory-related transactions must be made according to agreed terms and timelines.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Delivery & Shipping
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Delivery timelines may vary depending on supplier processing, shipping method, customs procedures, and other external factors beyond our direct control.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Fourth View Trading Company shall not be held liable for delays, damages, or losses caused by third-party logistics providers, manufacturers, customs authorities, or unforeseen circumstances.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              All content, branding, logos, and materials on this website remain the property of Fourth View Trading Company unless otherwise stated.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              Policy Updates
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to update or modify these terms and policies at any time without prior notice.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}