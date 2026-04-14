"use client";

import { ArrowLeft, ArrowRight, FileUp, Users } from "lucide-react";

export default function SourceSelectionStep({
  onSelect,
  onBack,
}: {
  onSelect: (source: "internal" | "upload") => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C8493] hover:text-[#25324B] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Job Selection
      </button>

      <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <button
          onClick={() => onSelect("internal")}
          className="group flex flex-col items-center rounded-3xl border-2 border-dashed border-gray-200 bg-white p-10 text-center transition-all hover:border-[#286ef0] hover:bg-blue-50/30"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-[#286ef0] transition-transform group-hover:scale-110">
            <Users className="h-10 w-10" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-[#25324B]">
            Use Submitted Applications
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-[#7C8493]">
            Analyze candidates who applied through the platform for this
            specific job.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#286ef0]">
            Start Screening <ArrowRight className="h-4 w-4" />
          </div>
        </button>

        <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border-2 border-dashed border-gray-200 bg-white p-10 text-center transition-all hover:border-[#286ef0] hover:bg-blue-50/30">
          <input
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={() => onSelect("upload")}
          />
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110">
            <FileUp className="h-10 w-10" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-[#25324B]">
            Upload External Data
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-[#7C8493]">
            Upload CSV, Excel, or PDF files. AI will parse and rank them against
            the job description.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm font-bold text-indigo-600">
            Browse Files <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
