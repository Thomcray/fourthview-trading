// app/admin/study-applications/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Send,
  RefreshCw,
  User,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DocumentViewerModal from "@/components/Admin/Modals/DocumentViewerModal";

type StudyApplication = {
  id: number;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  preferred_university: string;
  preferred_program: string;
  message: string;
  status:
    | "pending"
    | "reviewing"
    | "documents_received"
    | "approved"
    | "rejected";
  documents: Record<
    string,
    {
      path: string;
      url: string;
      name: string;
    }
  >;
  created_at: string;
  updated_at: string;
};

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  reviewing: {
    label: "Reviewing",
    color: "bg-blue-100 text-blue-700",
    icon: RefreshCw,
  },
  documents_received: {
    label: "Documents Received",
    color: "bg-purple-100 text-purple-700",
    icon: FileText,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const documentLabels: Record<string, string> = {
  recommendation1: "Recommendation Letter 1",
  recommendation2: "Recommendation Letter 2",
  englishProficiency: "English Proficiency Letter",
  transcript: "Academic Transcript",
  certificate: "Degree Certificate",
  nonCriminal: "Non-Criminal Record",
  medicalForm: "Physical Examination Form",
  studyPlan: "Study Plan",
  passportPhoto: "Passport Photo",
  introductionVideo: "Introduction Video",
};

export default function StudyApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>("");
  const [adminNote, setAdminNote] = useState("");
  const [viewerModal, setViewerModal] = useState<{
    isOpen: boolean;
    url: string;
    name: string;
    key: string;
  }>({
    isOpen: false,
    url: "",
    name: "",
    key: "",
  });

  const applicationId = params.id as string;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["studyApplication", applicationId],
    queryFn: async () => {
      const res = await fetch(`/api/study-applications/${applicationId}`);
      if (!res.ok) throw new Error("Failed to fetch application");
      return res.json();
    },
  });

  const application: StudyApplication = data?.application;

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, note }: { status: string; note: string }) => {
      const res = await fetch(`/api/study-applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote: note }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Application status updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["studyApplication", applicationId],
      });
      queryClient.invalidateQueries({ queryKey: ["studyApplications"] });
      setAdminNote("");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleStatusUpdate = () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }
    updateStatusMutation.mutate({ status, note: adminNote });
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-gray-200 rounded" />
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-100 rounded" />
              <div className="h-48 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-5xl mx-auto text-center py-12">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The application you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => router.push("/admin/orders-request")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  const statusConfigData = statusConfig[application.status];
  const StatusIcon = statusConfigData?.icon || Clock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Study Application Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Application #{application.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Personal Information
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">
                      {application.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-800">
                        {application.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp Number</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-800">
                        {application.whatsapp_number}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-800">
                        {application.country || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Academic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Academic Information
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Preferred University
                    </p>
                    <p className="font-medium text-gray-800">
                      {application.preferred_university || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Preferred Program</p>
                    <p className="font-medium text-gray-800">
                      {application.preferred_program || "—"}
                    </p>
                  </div>
                </div>
                {application.message && (
                  <div>
                    <p className="text-sm text-gray-500">Additional Message</p>
                    <div className="flex items-start gap-2 mt-1">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-700">{application.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Uploaded Documents
                  </h2>
                  <Badge variant="secondary" className="ml-2">
                    {application.documents
                      ? Object.keys(application.documents).length
                      : 0}{" "}
                    files
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                {application.documents &&
                Object.keys(application.documents).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(application.documents).map(([key, doc]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {documentLabels[key] || key}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 cursor-pointer shrink-0"
                          onClick={() =>
                            setViewerModal({
                              isOpen: true,
                              url: doc.url,
                              name: doc.name,
                              key,
                            })
                          }
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No documents uploaded yet
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Application Status
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-center py-4">
                  {getStatusBadge(application.status)}
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-500 mb-2">Update Status</p>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="documents_received">
                        Documents Received
                      </SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Admin Note (Optional)
                  </p>
                  <Textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add a note about this application..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={updateStatusMutation.isPending || !status}
                  className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  {updateStatusMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Update Status
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Timeline Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Timeline
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Submitted</span>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(application.created_at).toLocaleDateString(
                      "en-NG",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
                {application.updated_at !== application.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last Updated</span>
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(application.updated_at).toLocaleDateString(
                        "en-NG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Quick Actions
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() =>
                    (window.location.href = `mailto:${application.email}`)
                  }
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${application.whatsapp_number}`,
                      "_blank",
                    )
                  }
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp Contact
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={viewerModal.isOpen}
        onClose={() => setViewerModal({ ...viewerModal, isOpen: false })}
        documentUrl={viewerModal.url}
        documentName={viewerModal.name}
        documentKey={viewerModal.key}
      />
    </div>
  );
}
