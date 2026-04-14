"use client";

import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Mail,
  Target,
  Trophy,
} from "lucide-react";

export type CandidateResult = {
  candidateId: string;
  name: string;
  rank: number;
  matchScore: number;
  confidence: "high" | "medium" | "low";
  strengths: string[];
  gaps: string[];
  reasoning: string;
  finalRecommendation: string;
  comparisonNotes?: string;
};

export default function ResultsStep({
  results,
  selectedForEmail,
  isSendingEmails,
  emailSent,
  expandedCandidate,
  onToggleEmail,
  onToggleExpand,
  onSendEmails,
  onRestart,
  onBack,
}: {
  results: CandidateResult[];
  selectedForEmail: string[];
  isSendingEmails: boolean;
  emailSent: boolean;
  expandedCandidate: string | null;
  onToggleEmail: (id: string) => void;
  onToggleExpand: (id: string | null) => void;
  onSendEmails: () => void;
  onRestart: () => void;
  onBack: () => void;
}) {
  const confidenceColor = (conf: string) => {
    if (conf === "high") return "bg-green-100 text-green-700 border-green-200";
    if (conf === "medium")
      return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C8493] hover:text-[#25324B] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to History
      </button>

      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-blue-100 bg-[#F8F8FD] p-6 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#286ef0] text-white">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#25324B]">
              Screening Summary
            </h3>
            <p className="text-sm text-[#7C8493]">
              Top candidates show a strong correlation with React mastery and
              leadership weights.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-blue-50 bg-white px-4 py-2 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7C8493]">
              Total Evaluated
            </p>
            <p className="text-xl font-bold text-[#25324B]">48</p>
          </div>
          <div className="rounded-xl border border-blue-50 bg-white px-4 py-2 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7C8493]">
              High Confidence
            </p>
            <p className="text-xl font-bold text-green-600">12</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2">
        <h3 className="text-lg font-bold text-[#25324B]">Ranked Candidates</h3>
        <button
          onClick={onSendEmails}
          disabled={selectedForEmail.length === 0 || isSendingEmails}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-2 text-sm font-bold transition-all ${
            emailSent
              ? "bg-green-500 text-white"
              : selectedForEmail.length > 0
                ? "bg-[#286ef0] text-white shadow-md shadow-blue-100 hover:bg-[#1f5fe0]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSendingEmails ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : emailSent ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {isSendingEmails
            ? "Sending..."
            : emailSent
              ? "Sent!"
              : `Send Email to Selected (${selectedForEmail.length})`}
        </button>
      </div>

      <div className="space-y-4">
        {results.map((c) => (
          <div
            key={c.candidateId}
            className={`overflow-hidden rounded-2xl border bg-white transition-all ${
              expandedCandidate === c.candidateId
                ? "border-[#286ef0] shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <div className="pl-5">
                <input
                  type="checkbox"
                  checked={selectedForEmail.includes(c.candidateId)}
                  onChange={() => onToggleEmail(c.candidateId)}
                  className="h-5 w-5 cursor-pointer rounded-md border-gray-300 text-[#286ef0] focus:ring-[#286ef0]"
                />
              </div>

              <div
                className="flex-1 cursor-pointer items-center gap-4 p-5 flex"
                onClick={() =>
                  onToggleExpand(
                    expandedCandidate === c.candidateId ? null : c.candidateId,
                  )
                }
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-lg ${
                    c.rank === 1
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-[#25324B]"
                  }`}
                >
                  {"#" + c.rank}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-[#25324B]">
                    {c.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-[#7C8493]">
                      {/* <Target className="h-3.5 w-3.5" /> */}
                      Score:{" "}
                      <span className="font-bold text-[#25324B]">
                        {c.matchScore}%
                      </span>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${confidenceColor(
                        c.confidence,
                      )}`}
                    >
                      {c.confidence} Confidence
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden text-right lg:block">
                    <p className="text-xs font-bold text-green-600">
                      Recommended
                    </p>
                    <p className="text-[10px] text-[#7C8493]">
                      Technical Assessment
                    </p>
                  </div>
                  {expandedCandidate === c.candidateId ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedCandidate === c.candidateId && (
              <div className="ml-10 animate-in slide-in-from-top-2 duration-200 border-t border-gray-50 bg-[#F8F8FD]/50 px-5 pb-6">
                <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="space-y-5">
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600">
                        <CheckCircle2 className="h-4 w-4" /> Core Strengths
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {c.strengths.map((s) => (
                          <span
                            key={s}
                            className="rounded-lg border border-green-100 bg-white px-3 py-1.5 text-xs font-medium text-green-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                        <AlertCircle className="h-4 w-4" /> Notable Gaps
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {c.gaps.map((g) => (
                          <span
                            key={g}
                            className="rounded-lg border border-amber-100 bg-white px-3 py-1.5 text-xs font-medium text-amber-800"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#7C8493]">
                        AI Reasoning
                      </p>
                      <div className="rounded-xl border border-gray-100 bg-white p-4">
                        <p className="text-sm leading-relaxed italic text-[#25324B]">
                          "{c.reasoning}"
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#286ef0] p-4 text-white">
                      <p className="mb-1 text-[10px] font-bold uppercase opacity-70">
                        Final Recommendation
                      </p>
                      <p className="text-sm font-bold">
                        {c.finalRecommendation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#25324B] transition-colors hover:bg-gray-50">
                    View Full Profile
                  </button>
                  <button className="rounded-xl bg-[#286ef0] px-4 py-2 text-sm font-bold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-[#1f5fe0]">
                    Shortlist Candidate
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onRestart}
          className="text-sm font-bold text-[#7C8493] transition-colors hover:text-[#25324B]"
        >
          Restart Screening Process
        </button>
      </div>
    </div>
  );
}
