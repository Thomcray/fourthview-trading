"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  X,
  Eye,
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export interface UploadedFile {
  file: File;
  preview?: string;
  name: string;
  size: number;
}

export interface Document {
  id: string;
  name: string;
  label: string;
  description: string;
  required: boolean;
  accept?: string;
}

export const documents: Document[] = [
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
  uploadState?: Record<
    string,
    { progress: number; status: string; error?: string }
  >;
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
  currentDocIndex,
  setCurrentDocIndex,
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  onPreview,
  uploadState = {},
}: DocumentUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);

  const currentDoc = documents[currentDocIndex];
  const currentFile = uploadedFiles[currentDoc?.id];
  const currentUpload = uploadState[currentDoc?.id];

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
      toast.success("All documents selected!");
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
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
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

            {/* Progress bar */}
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

                  {/* Upload Progress */}
                  {currentUpload?.status === "uploading" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Uploading to server...</span>
                        <span>{currentUpload.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentUpload.progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </div>
                  )}

                  {currentUpload?.status === "done" && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Upload complete
                    </p>
                  )}

                  {currentUpload?.status === "error" && (
                    <p className="text-xs text-red-600 mt-2">
                      Error: {currentUpload.error}
                    </p>
                  )}
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
