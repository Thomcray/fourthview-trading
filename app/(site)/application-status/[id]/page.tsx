"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  GraduationCap,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  RefreshCw,
  User,
  Mail,
  Phone,
} from "lucide-react";

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ElementType;
    description: string;
  }
> = {
  pending: {
    label: "Pending Review",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    icon: Clock,
    description: "Your application has been received and is awaiting review.",
  },
  reviewing: {
    label: "Under Review",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: RefreshCw,
    description:
      "Our team is currently reviewing your application and documents.",
  },
  documents_received: {
    label: "Documents Received",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    icon: FileText,
    description:
      "We have received all your documents and are processing your application.",
  },
  approved: {
    label: "Approved",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle,
    description: "Congratulations! Your application has been approved.",
  },
  rejected: {
    label: "Not Approved",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    description:
      "Unfortunately, your application was not approved at this time.",
  },
};

const steps = ["pending", "reviewing", "documents_received", "approved"];

export default function ApplicationStatusPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["applicationStatus", id],
    queryFn: async () => {
      const res = await fetch(`/api/application-status/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    refetchInterval: 30000, // auto-refresh every 30 seconds
  });

  const application = data?.application;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-500">
            Please check your application ID and try again.
          </p>
        </div>
      </div>
    );
  }

  const config = statusConfig[application.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const currentStepIndex = steps.indexOf(application.status);
  const isRejected = application.status === "rejected";

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Application Status
          </h1>
          <p className="text-gray-500 mt-1">Application #{id}</p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-xl p-6 mb-6 ${config.bg}`}
        >
          <div className="flex items-center gap-3">
            <StatusIcon className={`w-8 h-8 ${config.color}`} />
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <p className={`text-xl font-bold ${config.color}`}>
                {config.label}
              </p>
            </div>
          </div>
          <p className="mt-3 text-gray-600 text-sm">{config.description}</p>
          {application.admin_note && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <p className="text-sm font-medium text-gray-700">
                Note from our team:
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {application.admin_note}
              </p>
            </div>
          )}
        </motion.div>

        {/* Progress Steps */}
        {!isRejected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
          >
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Application Progress
            </h2>
            <div className="relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const stepConfig = statusConfig[step];
                  const StepIcon = stepConfig.icon;
                  const isCompleted = index <= currentStepIndex;
                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${
                          isCompleted
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-xs font-medium text-center max-w-16 ${isCompleted ? "text-blue-600" : "text-gray-400"}`}
                      >
                        {stepConfig.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Applicant Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Your Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {application.full_name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{application.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {application.whatsapp_number}
              </span>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-400 mt-6">
          This page refreshes automatically every 30 seconds
        </p>
      </div>
    </div>
  );
}
