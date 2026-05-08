"use client";

import { motion } from "framer-motion";
import { Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
              At Fourth View Trading Company, we value your privacy and are committed to protecting your personal information.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Any information shared with us through our website, forms, emails, or communication channels is handled with confidentiality and used solely for service-related purposes.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Information We May Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
              <li>Name and contact details</li>
              <li>Email address</li>
              <li>Business or shipping information</li>
              <li>Payment-related information</li>
              <li>Documents submitted for applications or verification purposes</li>
            </ul>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
              <li>Provide our services effectively</li>
              <li>Process sourcing and procurement requests</li>
              <li>Communicate updates and support</li>
              <li>Improve customer experience</li>
              <li>Maintain service security and reliability</li>
            </ul>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Information Protection
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              We implement reasonable security measures to protect your data from unauthorized access, misuse, or disclosure.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              Third-Party Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Your information will not be sold or shared with unauthorized third parties except where necessary to complete requested services or comply with legal obligations.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              Consent
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By using our website and services, you consent to our privacy practices and policies.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}