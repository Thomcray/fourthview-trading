"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  FileText,
  Upload,
  CheckCircle,
  X,
  Eye,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import Link from "next/link";

interface UploadedFile {
  file: File;
  preview?: string;
  name: string;
  size: number;
}

interface Document {
  id: string;
  name: string;
  label: string;
  description: string;
  required: boolean;
  accept?: string;
}

const documents: Document[] = [
  {
    id: "recommendation1",
    name: "recommendation1",
    label: "Recommendation Letter 1",
    description: "Academic or professional recommendation letter",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "recommendation2",
    name: "recommendation2",
    label: "Recommendation Letter 2",
    description: "Second recommendation letter",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "englishProficiency",
    name: "englishProficiency",
    label: "English Proficiency Letter",
    description: "IELTS, TOEFL, or other English proficiency certificate",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "transcript",
    name: "transcript",
    label: "Academic Transcript",
    description: "All education transcripts",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "certificate",
    name: "certificate",
    label: "Degree Certificate",
    description: "Educational degree certificate",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "nonCriminal",
    name: "nonCriminal",
    label: "Non-Criminal Record",
    description: "Police clearance certificate",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "medicalForm",
    name: "medicalForm",
    label: "Physical Examination Form",
    description: "Medical examination report",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "studyPlan",
    name: "studyPlan",
    label: "Study Plan",
    description: "Your study plan or statement of purpose",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "passportPhoto",
    name: "passportPhoto",
    label: "Passport Photo",
    description: "White background, passport size",
    required: true,
    accept: "image/*",
  },
  {
    id: "introductionVideo",
    name: "introductionVideo",
    label: "Introduction Video",
    description: "Self-introduction video (max 100MB)",
    required: true,
    accept: "video/*",
  },
];

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDocIndex: number;
  setCurrentDocIndex: (i: number) => void;
  uploadedFiles: Record<string, UploadedFile | null>;
  onFileUpload: (docId: string, file: File | null) => void;
  onRemoveFile: (docId: string) => void;
  onPreview: (url: string, name: string) => void;
}

function DocumentUploadModal({
  isOpen,
  onClose,
  currentDocIndex,
  setCurrentDocIndex,
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  onPreview,
}: DocumentUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);

  const currentDoc = documents[currentDocIndex];
  const currentFile = uploadedFiles[currentDoc?.id];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && currentDoc) onFileUpload(currentDoc.id, file);
  };

  const nextDoc = () => {
    if (currentDocIndex < documents.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1);
    } else {
      onClose();
      toast.success("All documents uploaded successfully!");
    }
  };

  const prevDoc = () => {
    if (currentDocIndex > 0) setCurrentDocIndex(currentDocIndex - 1);
  };

  if (!currentDoc) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Upload Documents
                </h2>
                <p className="text-blue-100 text-sm">
                  Step {currentDocIndex + 1} of {documents.length}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-1 bg-blue-100">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${((currentDocIndex + 1) / documents.length) * 100}%`,
                }}
              />
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800">
                    {currentDoc.label}
                  </h3>
                  {currentDoc.required && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {currentDoc.description}
                </p>
              </div>

              {!currentFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 bg-gray-50"
                  }`}
                >
                  <label
                    htmlFor={`file-${currentDoc.id}`}
                    className="cursor-pointer block"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Max 100MB</p>
                  </label>
                  <input
                    id={`file-${currentDoc.id}`}
                    type="file"
                    accept={currentDoc.accept}
                    onChange={(e) =>
                      onFileUpload(currentDoc.id, e.target.files?.[0] || null)
                    }
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {currentFile.preview ? (
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={currentFile.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-7 h-7 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {currentFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {currentFile.preview && (
                        <button
                          onClick={() =>
                            onPreview(currentFile.preview!, currentFile.name)
                          }
                          className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveFile(currentDoc.id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between gap-3 px-6 pb-6">
              <Button
                variant="outline"
                onClick={prevDoc}
                disabled={currentDocIndex === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <Button
                onClick={nextDoc}
                disabled={!currentFile && currentDoc.required}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                {currentDocIndex === documents.length - 1 ? "Complete" : "Next"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(
        "Application submitted! We'll contact you within 48 hours.",
      );
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
    } catch {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-16 px-4">
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
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
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg font-semibold"
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
