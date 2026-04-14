"use client";

import { BrainCircuit, Loader2 } from "lucide-react";

export default function ProcessingStep({
  message,
  progress,
}: {
  message: string;
  progress: number;
}) {
  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-2 duration-300 flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white py-20 shadow-sm">
      <div className="relative mb-8">
        <Loader2 className="h-24 w-24 animate-spin text-[#286ef0] stroke-[1.5px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="h-8 w-8 text-[#286ef0]" />
        </div>
      </div>

      <div className="space-y-3 text-center">
        <h2 className="text-2xl font-bold text-[#25324B]">AI is Screening...</h2>
        <div className="h-6 overflow-hidden">
          <p className="font-semibold text-[#286ef0] animate-in slide-in-from-bottom-2 duration-300">
            {message}
          </p>
        </div>
        <p className="max-w-md text-sm text-[#7C8493]">
          Our AI is currently reviewing every line of every application to
          ensure the best matches are found. This may take a moment.
        </p>
      </div>

      <div className="mt-12 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-[#286ef0] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
