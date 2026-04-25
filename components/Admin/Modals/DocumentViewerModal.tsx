"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName: string;
  documentKey?: string;
}

export default function DocumentViewerModal({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  documentKey,
}: DocumentViewerModalProps) {
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(documentName);
  const isPdf = /\.pdf$/i.test(documentName);
  const isVideo = /\.(mp4|webm|mov|avi|mkv|flv)$/i.test(documentName);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {documentName}
                  </h3>
                  {documentKey && (
                    <p className="text-xs text-gray-500 capitalize">
                      {documentKey.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={documentUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </a>
                <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </Button>
                </a>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-gray-50 p-6 flex items-center justify-center">
              {isImage ? (
                <img
                  src={documentUrl}
                  alt={documentName}
                  className="max-w-full max-h-full rounded-lg shadow-lg object-contain"
                />
              ) : isPdf ? (
                <iframe
                  src={documentUrl}
                  title={documentName}
                  className="w-full h-[70vh] rounded-lg shadow-lg bg-white"
                />
              ) : isVideo ? (
                <video
                  src={documentUrl}
                  controls
                  className="max-w-full max-h-full rounded-lg shadow-lg"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    This file type cannot be previewed
                  </p>
                  <p className="text-sm text-gray-400 mb-6">
                    Download or open the file to view it
                  </p>
                  <a
                    href={documentUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="gap-2">
                      <Download className="w-4 h-4" />
                      Download File
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
