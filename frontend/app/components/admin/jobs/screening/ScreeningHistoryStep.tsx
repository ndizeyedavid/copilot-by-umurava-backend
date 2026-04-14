"use client";

import { BrainCircuit, Play, Eye, Calendar, Users, Target, Plus } from "lucide-react";

export type SavedScreening = {
  id: string;
  jobTitle: string;
  date: string;
  candidateCount: number;
  topScore: number;
  confidence: "high" | "medium" | "low";
};

export default function ScreeningHistoryStep({
  screenings,
  onView,
  onReRun,
  onStartNew,
}: {
  screenings: SavedScreening[];
  onView: (id: string) => void;
  onReRun: (id: string) => void;
  onStartNew: () => void;
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#25324B]">Recent Screenings</h2>
        <button
          onClick={onStartNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#286ef0] px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-100 transition-all hover:bg-[#1f5fe0]"
        >
          <Plus className="h-4 w-4" />
          New Screening
        </button>
      </div>

      {screenings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
            <BrainCircuit className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[#25324B]">No screenings yet</h3>
          <p className="mt-1 max-w-xs text-sm text-[#7C8493]">
            Start your first AI-powered candidate screening to see results here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {screenings.map((s) => (
            <div
              key={s.id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#286ef0] hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#25324B] group-hover:text-[#286ef0]">
                    {s.jobTitle}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#7C8493]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {s.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {s.candidateCount} Candidates
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    s.confidence === "high"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}
                >
                  {s.confidence} Confidence
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center gap-1 text-sm font-bold text-[#25324B]">
                  <Target className="h-4 w-4 text-[#286ef0]" />
                  Top Match: {s.topScore}%
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onReRun(s.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-[#7C8493] transition-colors hover:border-[#286ef0] hover:bg-blue-50 hover:text-[#286ef0]"
                    title="Re-run Screening"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onView(s.id)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gray-50 px-3 text-xs font-bold text-[#25324B] transition-colors hover:bg-gray-100"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Results
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
