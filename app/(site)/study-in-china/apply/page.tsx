"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Upload,
  CheckCircle,
  X,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import Link from "next/link";
import DocumentUploadModal, {
  UploadedFile,
  documents,
} from "@/components/DocumentUploadModal";
import { useUploadWithProgress } from "@/hooks/useUploadWithProgress";

export default function StudyInChinaApplyPage() {
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, UploadedFile | null>
  >({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsappNumber: "",
    country: "",
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (docId: string, file: File | null) => {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
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
        [docId]: { file, preview: undefined, name: file.name, size: file.size },
      }));
    }
  };

  const removeFile = (docId: string) => {
    setUploadedFiles((prev) => ({ ...prev, [docId]: null }));
    resetUpload(docId);
    toast.info("Document removed");
  };

  const handleModalClose = () => {
    setIsUploadModalOpen(false);
    setCurrentDocIndex(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.whatsappNumber) {
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
      // 1. Create application row
      const appRes = await fetch("/api/study-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, documents: {} }),
      });

      if (!appRes.ok) {
        const err = await appRes.json();
        throw new Error(err.error ?? "Failed to create application");
      }

      const application = await appRes.json();

      // 2. Upload documents with progress
      const uploadedDocs: Record<
        string,
        { path: string; url: string; name: string }
      > = {};

      for (const [docId, fileData] of Object.entries(uploadedFiles)) {
        if (!fileData) continue;

        // Get signed URL from API
        const res = await fetch("/api/study-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

        // Upload directly to Supabase with progress tracking
        await uploadFile(signedUrl, fileData.file, docId);

        // Get public URL
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/study-documents/${filePath}`;

        uploadedDocs[docId] = {
          path: filePath,
          url: publicUrl,
          name: fileData.name,
        };
      }

      // 3. Update application with document URLs
      const updateRes = await fetch("/api/study-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application.id,
          documents: uploadedDocs,
        }),
      });

      if (!updateRes.ok) {
        const err = await updateRes.json();
        throw new Error(err.error ?? "Failed to update documents");
      }

      toast.success(
        "Application submitted! We'll contact you within 48 hours.",
      );

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        whatsappNumber: "",
        country: "",
        preferredUniversity: "",
        preferredProgram: "",
        message: "",
      });
      setUploadedFiles({});
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application",
      );
    } finally {
      setIsSubmitting(false);
    }
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
              {/* Personal Info */}
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
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="mt-1"
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
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="mt-1"
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
                </div>
              </div>

              {/* Academic Info */}
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
                    <Label className="text-gray-700">Preferred Program</Label>
                    <Input
                      name="preferredProgram"
                      value={formData.preferredProgram}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science"
                      className="mt-1"
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
                      width: `${(completedCount / requiredDocuments.length) * 100}%`,
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
                    <CheckCircle className="w-4 h-4" /> All documents uploaded
                    successfully!
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !isUploadComplete}
                className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg font-semibold cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
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
            onClick={() => setPreviewFile(null)}
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
                  onClick={() => setPreviewFile(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={previewFile.url}
                  alt="Preview"
                  className="w-full rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
