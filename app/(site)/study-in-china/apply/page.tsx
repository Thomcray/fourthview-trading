"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Upload,
  CheckCircle,
  X,
  Phone,
  ArrowLeft,
  Loader2,
  CalendarDays,
  Award,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import Link from "next/link";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import {
  studyDocuments as documents,
  UploadedFile,
} from "@/app/_lib/study-document-config";
import { useUploadWithProgress } from "@/hooks/useUploadWithProgress";
import Image from "next/image";

export default function StudyInChinaApplyPage() {
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, UploadedFile | null>
  >({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsappNumber: "",
    country: "",
    age: "",
    preferredUniversity: "",
    preferredProgram: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const { uploadState, uploadFile, resetUpload } = useUploadWithProgress();

  const requiredDocuments = documents.filter((d) => d.required);

  const completedCount = Object.values(uploadedFiles).filter(
    (f) => f !== null,
  ).length;

  const isUploadComplete = completedCount === requiredDocuments.length;

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    const firstName = session.user.firstName;
    const lastName = session.user.lastName;

    setFormData((prev) => ({
      ...prev,
      fullName: [firstName, lastName].filter(Boolean).join(" "),
      email: session.user.email ?? "",
    }));
  }, [session]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (docId: string, file: File | null) => {
    if (!file) return;

    const document = documents.find((doc) => doc.id === docId);

    if (!document) {
      toast.error("Invalid document type");
      return;
    }

    const maxSizeBytes = document.maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      toast.error(
        `${document.label} must be less than ${document.maxSizeMB}MB`,
      );
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setUploadedFiles((prev) => ({
          ...prev,
          [docId]: {
            file,
            preview: reader.result as string,
            name: file.name,
            size: file.size,
          },
        }));
      };

      reader.readAsDataURL(file);
    } else {
      setUploadedFiles((prev) => ({
        ...prev,
        [docId]: {
          file,
          preview: undefined,
          name: file.name,
          size: file.size,
        },
      }));
    }
  };

  const removeFile = (docId: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docId]: null,
    }));

    resetUpload(docId);

    toast.info("Document removed");
  };

  const handleModalClose = () => {
    setIsUploadModalOpen(false);
    setCurrentDocIndex(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.whatsappNumber ||
      !formData.age ||
      !formData.preferredProgram
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isUploadComplete) {
      toast.error(
        `Please upload all ${requiredDocuments.length} required documents`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create application
      const appRes = await fetch("/api/study-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          documents: {},
        }),
      });

      if (!appRes.ok) {
        const err = await appRes.json();

        throw new Error(err.error ?? "Failed to create application");
      }

      const application = await appRes.json();

      // 2. Upload documents
      const uploadedDocs: Record<
        string,
        {
          path: string;
          url: string;
          name: string;
        }
      > = {};

      for (const [docId, fileData] of Object.entries(uploadedFiles)) {
        if (!fileData) continue;

        const res = await fetch("/api/study-document", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId: application.id,
            docType: docId,
            fileName: fileData.name,
          }),
        });

        if (!res.ok) {
          const err = await res.json();

          throw new Error(
            `Failed to get upload URL for ${fileData.name}: ${err.error}`,
          );
        }

        const { signedUrl, filePath } = await res.json();

        await uploadFile(signedUrl, fileData.file, docId);

        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/study-documents/${filePath}`;

        uploadedDocs[docId] = {
          path: filePath,
          url: publicUrl,
          name: fileData.name,
        };
      }

      // 3. Save document information
      const updateRes = await fetch("/api/study-applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: application.id,
          documents: uploadedDocs,
        }),
      });

      if (!updateRes.ok) {
        const err = await updateRes.json();

        throw new Error(err.error ?? "Failed to update documents");
      }

      // 4. Send confirmation
      const confirmationResponse = await fetch(
        "/api/study-applications/confirmation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId: application.id,
          }),
        },
      );

      if (!confirmationResponse.ok) {
        console.error("Failed to send confirmation email.");
      }

      toast.success(
        "Application submitted! We'll contact you within 48 hours.",
      );

      // 5. Reset form state
      const firstName = session?.user?.firstName;
      const lastName = session?.user?.lastName;

      setFormData({
        fullName: [firstName, lastName].filter(Boolean).join(" "),
        email: session?.user?.email ?? "",
        whatsappNumber: "",
        country: "",
        age: "",
        preferredUniversity: "",
        preferredProgram: "",
        message: "",
      });

      // Reset upload progress for every uploaded document
      for (const docId of Object.keys(uploadedFiles)) {
        resetUpload(docId);
      }

      // Reset uploaded files
      setUploadedFiles({});

      // Reset document modal
      setCurrentDocIndex(0);
      setIsUploadModalOpen(false);

      // Reset preview
      setPreviewFile(null);
    } catch (error) {
      console.error("Submit error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to submit application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePreview = () => {
    if (previewFile?.url.startsWith("blob:")) {
      URL.revokeObjectURL(previewFile.url);
    }

    setPreviewFile(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-linear-to-r from-blue-900 to-blue-800 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/study-in-china"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Study in China
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="bg-white/20 p-4 rounded-full shrink-0">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Submit Your Application
              </h1>

              <p className="text-blue-100 mt-1">
                Fill in your details and upload your documents to get started
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Admissions & Payment Information */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
                <div className="flex items-start gap-3 mb-5">
                  <div className="rounded-full bg-blue-600 p-2 shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Admissions & Payment Information
                    </h2>

                    <p className="text-sm text-gray-600 mt-1">
                      Please review the intake options and payment structure
                      before submitting your application.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <div className="rounded-xl bg-white border border-blue-100 p-4">
                    <CalendarDays className="w-5 h-5 text-blue-600 mb-2" />

                    <h3 className="font-semibold text-gray-900">
                      March & September Intakes
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                      Applications are available for both intake periods.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-blue-100 p-4">
                    <Award className="w-5 h-5 text-blue-600 mb-2" />

                    <h3 className="font-semibold text-gray-900">
                      Scholarship & Self-Sponsor
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                      Both scholarship and self-sponsored programs are
                      available.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-blue-100 p-4">
                    <CreditCard className="w-5 h-5 text-blue-600 mb-2" />

                    <h3 className="font-semibold text-gray-900">
                      Application Fee
                    </h3>

                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      $500
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-blue-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">
                      Payment Structure
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          1. Application Fee
                        </p>

                        <p className="text-sm text-gray-600">
                          We will first contact you through WhatsApp. The $500
                          application fee is paid after we contact you.
                        </p>
                      </div>

                      <span className="font-bold text-blue-700 whitespace-nowrap">
                        $500
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          2. Balance After Admission
                        </p>

                        <p className="text-sm text-gray-600">
                          The remaining balance is paid after your admission
                          letter is issued.
                        </p>
                      </div>

                      <span className="font-bold text-blue-700 whitespace-nowrap">
                        $1,300
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-blue-50">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Total Application Fees
                        </p>

                        <p className="text-sm text-gray-600">
                          $500 application fee + $1,300 after admission
                        </p>
                      </div>

                      <span className="text-lg font-bold text-blue-800 whitespace-nowrap">
                        $1,800
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Submitting this application does not require immediate
                  payment. Our team will review your application and contact you
                  via WhatsApp with the next steps.
                </p>
              </div>

              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>

                    <Input
                      name="fullName"
                      value={formData.fullName}
                      readOnly
                      placeholder="John Doe"
                      className="mt-1 bg-gray-50 cursor-not-allowed"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>

                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      readOnly
                      placeholder="john@example.com"
                      className="mt-1 bg-gray-50 cursor-not-allowed"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </Label>

                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                      <Input
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        placeholder="+1234567890"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700">Country</Label>

                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Your country"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700">
                      Age <span className="text-red-500">*</span>
                    </Label>

                    <Input
                      name="age"
                      type="number"
                      min={1}
                      max={120}
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Your age"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  Academic Preferences
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-700">
                      Preferred University
                    </Label>

                    <Input
                      name="preferredUniversity"
                      value={formData.preferredUniversity}
                      onChange={handleInputChange}
                      placeholder="e.g., Tsinghua University"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700">
                      Preferred Program <span className="text-red-500">*</span>
                    </Label>

                    <Input
                      name="preferredProgram"
                      value={formData.preferredProgram}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-gray-700">
                    Additional Message (Optional)
                  </Label>

                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any additional information you'd like to share..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  Required Documents
                </h2>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">
                    Upload all required documents for processing
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {completedCount} / {requiredDocuments.length}
                    </span>

                    {isUploadComplete && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>

                <div className="mb-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{
                      width:
                        requiredDocuments.length > 0
                          ? `${
                              (completedCount / requiredDocuments.length) * 100
                            }%`
                          : "0%",
                    }}
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 cursor-pointer"
                >
                  {isUploadComplete ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Documents Uploaded — Click to Review
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents ({completedCount}/
                      {requiredDocuments.length})
                    </>
                  )}
                </Button>

                {isUploadComplete && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    All documents uploaded successfully!
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  sessionStatus === "loading" ||
                  !session?.user ||
                  !isUploadComplete
                }
                className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg font-semibold cursor-pointer"
              >
                {sessionStatus === "loading" ? (
                  "Loading your account..."
                ) : isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading documents...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </Button>

              <p className="text-center text-xs text-gray-400">
                By submitting this form, you agree to our terms and conditions.
                We&apos;ll contact you within 48 hours.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleModalClose}
        currentDocIndex={currentDocIndex}
        setCurrentDocIndex={setCurrentDocIndex}
        uploadedFiles={uploadedFiles}
        onFileUpload={handleFileUpload}
        onRemoveFile={removeFile}
        onPreview={(url, name) => setPreviewFile({ url, name })}
        uploadState={uploadState}
      />

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full mx-4 overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold">{previewFile.name}</h3>

                <button
                  type="button"
                  onClick={closePreview}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {previewFile.name.toLowerCase().endsWith(".pdf") ? (
                  <>
                    <iframe
                      src={previewFile.url}
                      title={previewFile.name}
                      className="w-full h-[70vh] rounded-lg"
                    />

                    <a
                      href={previewFile.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-blue-600 underline"
                    >
                      Open in new tab
                    </a>
                  </>
                ) : (
                  <div className="relative w-full h-[70vh]">
                    <Image
                      src={previewFile.url}
                      alt={previewFile.name}
                      fill
                      unoptimized
                      className="object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
