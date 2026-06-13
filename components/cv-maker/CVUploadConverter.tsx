import React, { useState } from "react";
import { ArrowLeft, ShieldAlert, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import FileUploadBox from "./FileUploadBox";
import { parseResumeText } from "../../lib/resumeParser";
import { CVData } from "../../types/cv";

interface CVUploadConverterProps {
  onParseComplete: (data: CVData) => void;
  onCancel: () => void;
}

export default function CVUploadConverter({ onParseComplete, onCancel }: CVUploadConverterProps) {
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileExtracted = (text: string) => {
    try {
      const parsedData = parseResumeText(text);
      onParseComplete(parsedData);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to parse the resume content. Please ensure it has standard headings.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="p-2.5 rounded-lg border border-brand-gray-800 bg-brand-card/40 hover:bg-brand-gray-900 text-brand-gray-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          title="Back to start"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">Upload Existing CV</h2>
          <p className="text-xs text-brand-gray-400">Convert your current resume file into an ATS-friendly format</p>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-xs text-red-400 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Upload area */}
      <div className="bg-brand-card/50 border border-brand-gray-800/80 rounded-2xl p-6 md:p-8 space-y-6">
        <FileUploadBox
          onFileExtracted={handleFileExtracted}
          onError={setErrorMsg}
        />

        {/* Info Box */}
        <div className="rounded-xl border border-brand-emerald/10 bg-brand-emerald/5 p-4 flex gap-3 text-xs leading-normal">
          <ShieldAlert className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-left">
            <strong className="text-white block font-semibold">Privacy Protection & Data Guidelines</strong>
            <p className="text-brand-gray-400">
              Your CV is processed in-memory for immediate structure conversion and is <strong className="text-brand-emerald">never stored permanently</strong> on our servers.
            </p>
          </div>
        </div>

        {/* Quick Guidelines */}
        <div className="text-left space-y-2.5 text-xs text-brand-gray-400">
          <span className="font-bold text-brand-gray-300 block">For best parsing results:</span>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
            <li>Ensure standard headings like <strong>Work Experience, Skills, Education</strong> are present.</li>
            <li>Use PDF or DOCX format for accurate bullet point detection.</li>
            <li>Decorative templates with complex tables will be converted into a cleaner, single-column standard parser layout.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
