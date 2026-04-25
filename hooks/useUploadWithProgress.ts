"use client";

import { useState, useCallback } from "react";

interface UploadState {
  [docId: string]: {
    progress: number;
    status: "idle" | "uploading" | "done" | "error";
    error?: string;
  };
}

export function useUploadWithProgress() {
  const [uploadState, setUploadState] = useState<UploadState>({});

  const uploadFile = useCallback(
    async (signedUrl: string, file: File, docId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadState((prev) => ({
              ...prev,
              [docId]: { progress, status: "uploading" },
            }));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadState((prev) => ({
              ...prev,
              [docId]: { progress: 100, status: "done" },
            }));
            resolve();
          } else {
            const error = `Upload failed: ${xhr.statusText}`;
            setUploadState((prev) => ({
              ...prev,
              [docId]: { progress: 0, status: "error", error },
            }));
            reject(new Error(error));
          }
        });

        xhr.addEventListener("error", () => {
          const error = "Network error during upload";
          setUploadState((prev) => ({
            ...prev,
            [docId]: { progress: 0, status: "error", error },
          }));
          reject(new Error(error));
        });

        xhr.open("PUT", signedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    },
    [],
  );

  const resetUpload = useCallback((docId: string) => {
    setUploadState((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  }, []);

  return { uploadState, uploadFile, resetUpload };
}
