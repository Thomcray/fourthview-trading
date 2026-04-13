// app/open-a-company/page.tsx
"use client";

import AppCarousel from "@/components/Slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  Upload,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  Globe,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import DocumentUploadModal from "@/components/OpenCompany/DocumentUploadModal";

type RequiredDocumentsType = {
  id: number;
  document: string;
  description?: string;
};

export default function OpenCompanyPage() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, File | null>
  >({
    passport: null,
    degree: null,
    policeRecord: null,
    workExperience: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const documents = [
    {
      id: "passport",
      label: "Passport Profile Page",
      description: "Clear scan of your international passport photo page",
      required: true,
      accept: "image/*,.pdf",
    },
    {
      id: "degree",
      label: "College Degree",
      description: "Legalized degree certificate (stamped at Chinese embassy)",
      required: true,
      accept: "image/*,.pdf",
    },
    {
      id: "policeRecord",
      label: "Police Non-criminal Record",
      description: "Legalized police certificate (stamped at Chinese embassy)",
      required: true,
      accept: "image/*,.pdf",
    },
    {
      id: "workExperience",
      label: "Work Experience Letter",
      description: "Detailed work experience letter",
      required: false,
      accept: "image/*,.pdf",
    },
  ];

  const requiredDocuments: RequiredDocumentsType[] = [
    { id: 1, document: "International passport with notarized documents" },
    {
      id: 2,
      document:
        "Scanned copies of original, legalized degree (stamped at the Chinese embassy in your country)",
    },
    {
      id: 3,
      document:
        "Scanned copies of original, legalized police non-criminal record certificate (stamped at the Chinese embassy at your country)",
    },
    {
      id: 4,
      document:
        "Scanned copy of a work experience letter (work timeline must not overlap with study time, if you don't have one, we can help with making one with a fee)",
    },
    {
      id: 5,
      document: "Upload payment receipt and Receive QR code (if needed)",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Legal Compliance",
      description: "Full legal support and compliance",
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Expedited document processing",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Dedicated local support team",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access to international markets",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDocumentsComplete = (files: Record<string, File>) => {
    console.log("All documents uploaded:", files);
    setUploadedFiles(files);
    setIsUploadComplete(true);
    toast.success("All documents uploaded successfully!");
    setModalOpen(false); // Close modal after completion
  };

  // Optional: Add function to reset uploads
  const handleResetUploads = () => {
    setUploadedFiles({
      passport: null,
      degree: null,
      policeRecord: null,
      workExperience: null,
    });
    setIsUploadComplete(false);
    toast.info("Document uploads reset. You can upload new documents.");
  };
  const handleSubmit = async () => {
    if (!formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isUploadComplete) {
      toast.error("Please upload all required documents first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would submit both formData and uploadedFiles to your API
      const allFormData = {
        ...formData,
        documents: uploadedFiles,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Application submitted successfully! We'll contact you within 24 hours.",
      );

      // Optionally reset form or redirect
      // router.push("/thank-you");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <AppCarousel />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 text-center pb-12 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Start your Business Journey in China
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto drop-shadow-md">
            Unlock access to the world&apos;s largest markets. From company
            registration to legal compliance, our expert team guides you through
            every step.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-2">
              Why Choose Us
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-5 rounded-xl bg-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-500">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-12 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Required Documents
            </h2>
            <p className="text-blue-200">
              Prepare the following documents for your application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requiredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white font-bold text-sm">
                      {doc.id}
                    </span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">
                    {doc.document}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-2">
              Start Your Application
            </h2>
            <p className="text-gray-600">
              Fill out the form below and our team will contact you within 24
              hours
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-md">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-blue-950 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700">
                    WhatsApp Phone Number{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload Section with Status */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-blue-950 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Required Documents
              </h3>

              {/* Upload Status Indicator */}
              {isUploadComplete && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700">
                      All{" "}
                      {
                        Object.values(uploadedFiles).filter((f) => f !== null)
                          .length
                      }{" "}
                      documents uploaded successfully!
                    </p>
                  </div>
                  <button
                    onClick={handleResetUploads}
                    className="text-xs text-green-600 hover:text-green-700 underline"
                  >
                    Reset
                  </button>
                </motion.div>
              )}

              {/* Upload Button */}
              <DocumentUploadModal
                documents={documents}
                onDocumentsComplete={handleDocumentsComplete}
                open={modalOpen}
                onOpenChange={setModalOpen}
                trigger={
                  <Button
                    className={`w-full sm:w-auto ${
                      isUploadComplete
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    {isUploadComplete ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Documents Uploaded
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Required Documents
                      </>
                    )}
                  </Button>
                }
              />

              {/* Upload Progress Summary */}
              {!isUploadComplete && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500">
                    Required: {documents.filter((d) => d.required).length}{" "}
                    documents needed
                  </p>
                  <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(Object.values(uploadedFiles).filter((f) => f !== null).length / documents.filter((d) => d.required).length) * 100}%`,
                      }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isUploadComplete}
                className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300
                  ${!isUploadComplete ? "opacity-50 cursor-not-allowed" : "hover:from-blue-700 hover:to-blue-800"}
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            By submitting this form, you agree to our terms and conditions.
            We&apos;ll contact you within 24 hours.
          </p>
        </div>
      </section>
    </main>
  );
}
