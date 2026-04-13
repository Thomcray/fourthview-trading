// components/OpenCompany/DocumentUploadModal.tsx
"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  CheckCircle,
  X,
  Upload,
  File,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Update the Document type to match your data structure
interface Document {
  id: string;
  label: string; // This is the display name
  description: string;
  required: boolean;
  accept?: string;
}

interface UploadedFile {
  file: File;
  preview?: string;
  uploadedAt: Date;
}

interface DocumentUploadModalProps {
  documents: Document[];
  onDocumentsComplete: (files: Record<string, File>) => void;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function DocumentUploadModal({
  documents,
  onDocumentsComplete,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: DocumentUploadModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, UploadedFile | null>
  >({});
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const currentDoc = documents[currentDocIndex];
  const currentFile = uploadedFiles[currentDoc?.id];
  const isLastDoc = currentDocIndex === documents.length - 1;
  const isFirstDoc = currentDocIndex === 0;
  const completedCount = Object.values(uploadedFiles).filter(
    (f) => f !== null,
  ).length;
  const isComplete = completedCount === documents.length;

  const handleFileUpload = (file: File | null) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create preview for images
    let preview: string | undefined;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFiles((prev) => ({
          ...prev,
          [currentDoc.id]: {
            file,
            preview: reader.result as string,
            uploadedAt: new Date(),
          },
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedFiles((prev) => ({
        ...prev,
        [currentDoc.id]: { file, preview: undefined, uploadedAt: new Date() },
      }));
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (
        file &&
        file.type.match(currentDoc?.accept?.replace(/\*/g, ".*") || ".*")
      ) {
        handleFileUpload(file);
      } else {
        alert("Please upload a valid file type");
      }
    },
    [currentDoc],
  );

  const removeFile = () => {
    setUploadedFiles((prev) => ({ ...prev, [currentDoc.id]: null }));
  };

  const handleNext = () => {
    if (currentFile && isLastDoc && isComplete) {
      // Submit all files
      const filesToSubmit: Record<string, File> = {};
      Object.entries(uploadedFiles).forEach(([key, value]) => {
        if (value) filesToSubmit[key] = value.file;
      });
      onDocumentsComplete(filesToSubmit);
      setOpen(false);
      // Reset state after modal closes
      setTimeout(() => {
        setUploadedFiles({});
        setCurrentDocIndex(0);
      }, 300);
    } else if (!isLastDoc) {
      setCurrentDocIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstDoc) {
      setCurrentDocIndex((prev) => prev - 1);
    }
  };

  if (!currentDoc) return null;

  return (
    <>
      {/* Preview Modal */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {previewFile?.url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
              <img
                src={previewFile.url}
                alt="Preview"
                className="w-full rounded-lg"
              />
            ) : (
              <div className="text-center py-12">
                <File className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Preview not available for this file type
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Upload Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Upload Documents</span>
              <span className="text-sm font-normal text-gray-500">
                {completedCount} of {documents.length} uploaded
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(completedCount / documents.length) * 100}%`,
              }}
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentDocIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="py-6"
            >
              {/* Document Info */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    Step {currentDocIndex + 1} of {documents.length}
                  </span>
                  {currentDoc.required && (
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentDoc.label}
                </h3>
                <p className="text-sm text-gray-500">
                  {currentDoc.description}
                </p>
              </div>

              {/* Upload Area */}
              {!currentFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center
                    transition-all duration-200 cursor-pointer
                    ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400 bg-gray-50"
                    }
                  `}
                >
                  <Input
                    type="file"
                    accept={currentDoc.accept || "image/*,.pdf"}
                    onChange={(e) =>
                      handleFileUpload(e.target.files?.[0] || null)
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {currentDoc.accept?.replace(/\*/g, "").toUpperCase() ||
                      "Images, PDF"}{" "}
                    (Max 5MB)
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {currentFile.preview ? (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={currentFile.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <File className="w-7 h-7 text-blue-600" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {currentFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(currentFile.file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {currentFile.preview && (
                        <button
                          onClick={() =>
                            setPreviewFile({
                              url: currentFile.preview!,
                              name: currentFile.file.name,
                            })
                          }
                          className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={removeFile}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstDoc}
              className="cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={!currentFile && currentDoc.required}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {isLastDoc ? (
                isComplete ? (
                  <>
                    Submit All Documents
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Complete Upload"
                )
              ) : (
                <>
                  Next Document
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Document List Summary */}
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-gray-500 mb-2">Uploaded Documents:</p>
            <div className="flex flex-wrap gap-2">
              {documents.map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => setCurrentDocIndex(idx)}
                  className={`
                    text-xs px-2 py-1 rounded-full transition-all
                    ${
                      uploadedFiles[doc.id]
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }
                    ${currentDocIndex === idx ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                  `}
                >
                  {uploadedFiles[doc.id] ? "✓ " : "○ "}
                  {doc.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
