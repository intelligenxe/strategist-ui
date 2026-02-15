"use client";

import { useCallback, useRef, useState } from "react";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileUpload({ file, onFileChange }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile?.type === "application/pdf") {
        onFileChange(droppedFile);
      }
    },
    [onFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) onFileChange(selected);
    },
    [onFileChange]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload PDF
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{file.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Drag and drop a PDF here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF files only</p>
          </div>
        )}
      </div>
    </div>
  );
}
