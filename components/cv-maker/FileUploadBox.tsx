import React, { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface FileUploadBoxProps {
  onFileExtracted: (text: string) => void;
  onError: (message: string) => void;
}

export default function FileUploadBox({ onFileExtracted, onError }: FileUploadBoxProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/msword"
  ];

  const validateFile = (file: File): boolean => {
    const name = file.name.toLowerCase();
    const isExtensionAllowed = allowedExtensions.some(ext => name.endsWith(ext));
    const isMimeAllowed = allowedMimeTypes.includes(file.type);

    if (!isExtensionAllowed && !isMimeAllowed) {
      onError("Unsupported file format. Please upload PDF, DOC, DOCX, or TXT.");
      return false;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      onError("File size exceeds 10MB. Please upload a smaller file.");
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    setLoading(true);
    setProgress(10);
    setFileName(file.name);
    onError("");

    try {
      // For TXT files, we can parse them directly client-side
      if (file.name.toLowerCase().endsWith(".txt") || file.type === "text/plain") {
        setProgress(40);
        const reader = new FileReader();
        reader.onload = (e) => {
          setProgress(100);
          const text = e.target?.result as string;
          setTimeout(() => {
            onFileExtracted(text);
            setLoading(false);
          }, 500);
        };
        reader.onerror = () => {
          onError("Failed to read TXT file content.");
          setLoading(false);
        };
        reader.readAsText(file);
        return;
      }

      // For PDF, DOC, DOCX files, send them to the serverless API route
      setProgress(30);
      const formData = new FormData();
      formData.append("file", file);

      // Simulate network progress
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 300);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || "Failed to parse document.");
      }

      setProgress(100);
      const data = await response.json();

      setTimeout(() => {
        onFileExtracted(data.text);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
      onError(err instanceof Error ? err.message : "Error parsing CV. Please check file formatting.");
      setLoading(false);
      setFileName("");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleChange}
        disabled={loading}
      />

      <motion.div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={loading ? undefined : onButtonClick}
        className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none relative overflow-hidden group ${
          isDragActive
            ? "border-brand-emerald bg-brand-emerald/5 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            : "border-brand-gray-800 bg-brand-card/40 hover:bg-brand-card/70 hover:border-brand-gray-700"
        }`}
        whileHover={loading ? {} : { y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {loading ? (
          <div className="space-y-4 w-full max-w-xs py-4">
            <div className="relative flex justify-center items-center">
              <Loader2 className="w-12 h-12 text-brand-emerald animate-spin" />
              <span className="absolute text-[10px] font-mono text-brand-gray-400 font-semibold">
                {progress}%
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Parsing CV Content...</p>
              <p className="text-xs font-mono text-brand-gray-400 truncate">{fileName}</p>
              
              {/* Progress bar */}
              <div className="w-full h-1 bg-brand-dark rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-emerald to-brand-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hover Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-brand-emerald/3 blur-[40px] rounded-full pointer-events-none group-hover:bg-brand-emerald/5 transition-colors"></div>

            <div className="p-4 rounded-full border border-brand-gray-800 bg-brand-dark mb-4 text-brand-gray-400 group-hover:text-brand-emerald group-hover:border-brand-emerald/20 transition-all duration-300">
              <Upload className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Drag & Drop your resume here
            </h3>
            
            <p className="text-xs text-brand-gray-400 mb-6 max-w-sm leading-relaxed">
              Supports <strong className="text-brand-gray-300">PDF, DOCX, DOC, or TXT</strong> files up to 10MB. We extract your headings, experiences, and details automatically.
            </p>

            <button
              type="button"
              className="h-9 px-5 rounded-full border border-brand-gray-850 bg-brand-dark hover:bg-brand-gray-900 text-xs font-semibold text-white transition-all hover:border-brand-emerald/20 cursor-pointer"
            >
              Browse File
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
