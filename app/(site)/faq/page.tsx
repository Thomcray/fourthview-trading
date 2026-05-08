"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What services does Fourth View Trading Company offer?",
    answer:
      "We provide product sourcing, procurement, factory verification, quality inspection, payment assistance to factories, international shipping support, trading assistance, and school application guidance.",
  },
  {
    question: "Can you help me source products from China?",
    answer:
      "Yes. We help clients find trusted suppliers and manufacturers in China while ensuring proper verification and quality checks.",
  },
  {
    question: "Do you verify factories before payment?",
    answer:
      "Absolutely. We carry out factory verification and supplier checks to help reduce risks and ensure credibility before transactions are made.",
  },
  {
    question: "Can startups work with Fourth View?",
    answer:
      "Yes. We support startups and small businesses by helping them source products, connect with suppliers, and start trading confidently.",
  },
  {
    question: "Do you handle international shipping?",
    answer:
      "We assist with shipping coordination, cargo handling, and delivery processes through trusted logistics channels.",
  },
  {
    question: "What is payment assistance?",
    answer:
      "Payment assistance helps clients securely make payments to verified factories or suppliers while ensuring proper transaction guidance.",
  },
  {
    question: "Do you help with school applications?",
    answer:
      "Yes. We provide guidance and support for international school application processes and related documentation.",
  },
  {
    question: "How can I contact Fourth View?",
    answer:
      "You can reach us through our official social media platforms, email, or contact numbers listed on our website.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            Frequently Asked Questions
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-blue-400 mx-auto rounded-full"
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="font-medium text-gray-800">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 leading-relaxed border-t pt-4">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}