"use client";

import { useParams } from "next/navigation";
import ResultsStep, {
  CandidateResult,
} from "@/app/components/admin/jobs/screening/ResultsStep";
import ShortlistStep, {
  ShortlistCandidate,
} from "@/app/components/admin/jobs/screening/ShortlistStep";
import InterviewEmailStep, {
  InterviewEmailCandidate,
} from "@/app/components/admin/jobs/screening/InterviewEmailStep";
import InterviewManageStep, {
  InterviewCandidate,
  InterviewStatus,
} from "@/app/components/admin/jobs/screening/InterviewManageStep";
import ContractGenerateStep from "@/app/components/admin/jobs/screening/ContractGenerateStep";
import ContractEmailStep, {
  ContractWithEmail,
} from "@/app/components/admin/jobs/screening/ContractEmailStep";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { CheckCircle2 } from "lucide-react";

type PipelineStep =
  | "results"
  | "shortlist"
  | "interview_email"
  | "interview_manage"
  | "contract_generate"
  | "contract_email"
  | "complete";

export default function ScreeningResultsPage() {
  const params = useParams<{ screeningId: string }>();
  const screeningId = params?.screeningId ?? "";
  const router = useRouter();

  // Pipeline step state
  const [step, setStep] = useState<PipelineStep>("results");

  // Results step state
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(
    null,
  );
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(
    [],
  );
  const [emailSent, setEmailSent] = useState(false);

  // Pipeline data
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [interviewCandidates, setInterviewCandidates] = useState<
    InterviewCandidate[]
  >([]);
  const [contractCandidates, setContractCandidates] = useState<
    ContractWithEmail[]
  >([]);
  const [completedHires, setCompletedHires] = useState<string[]>([]);

  type InternalScreening = {
    _id: string;
    jobId: string;
    candidates: {
      candidateId: string;
      rank: number;
      matchScore: number;
      confidence: "high" | "medium" | "low";
      strengths: string[];
      gaps: string[];
      reasoning: string;
      finalRecommendation: string;
      comparisonNotes?: string;
    }[];
    createdAt: string;
  };

  type ExternalResult = {
    applicantId: string;
    matchScore: number;
    reasoning: string;
    strengths: string[];
    gaps: string[];
    recommendation:
      | "highly_recommended"
      | "recommended"
      | "consider"
      | "not_suitable";
  };

  type ExternalDetailedResponse = {
    screeningId: string;
    jobId: string;
    status: "pending" | "processing" | "completed" | "failed";
    totalApplicants: number;
    processedApplicants: number;
    results: ExternalResult[];
  };

  const resultsQuery = useQuery({
    queryKey: ["admin", "screening-results", screeningId],
    enabled: !!screeningId,
    queryFn: async () => {
      try {
        const res = await api.get(`/screening/${screeningId}`);
        const screening = res.data?.fetchedScreening as InternalScreening;
        if (!screening?._id) {
          return { kind: "internal" as const, screening: null, results: [] };
        }

        const candidates = Array.isArray(screening.candidates)
          ? screening.candidates
          : [];

        const enriched: CandidateResult[] = await Promise.all(
          candidates.map(async (c) => {
            let name = c.candidateId;
            try {
              const talentRes = await api.get(`/talents/${c.candidateId}`);
              const t = talentRes.data?.fetchedTalent as any;
              const first = String(
                t?.userId?.firstName ?? t?.firstName ?? "",
              ).trim();
              const last = String(
                t?.userId?.lastName ?? t?.lastName ?? "",
              ).trim();
              name = `${first} ${last}`.trim() || c.candidateId;
            } catch {
              name = c.candidateId;
            }
            return {
              candidateId: c.candidateId,
              name,
              rank: c.rank,
              matchScore: c.matchScore,
              confidence: c.confidence,
              strengths: Array.isArray(c.strengths) ? c.strengths : [],
              gaps: Array.isArray(c.gaps) ? c.gaps : [],
              reasoning: String(c.reasoning ?? ""),
              finalRecommendation: String(c.finalRecommendation ?? ""),
              comparisonNotes: c.comparisonNotes,
            };
          }),
        );

        return {
          kind: "internal" as const,
          screening,
          results: enriched.sort((a, b) => a.rank - b.rank),
        };
      } catch (err: any) {
        const status = err?.response?.status;
        if (status && status !== 404) throw err;

        const extRes = await api.get(
          `/external-screening/results/${screeningId}/detailed`,
        );
        const payload = extRes.data as ExternalDetailedResponse;
        const list = Array.isArray(payload?.results) ? payload.results : [];

        const mapped: CandidateResult[] = list
          .slice()
          .sort((x, y) => y.matchScore - x.matchScore)
          .map((r, idx) => {
            const conf: CandidateResult["confidence"] =
              r.matchScore >= 85
                ? "high"
                : r.matchScore >= 70
                  ? "medium"
                  : "low";
            const rec =
              r.recommendation === "highly_recommended"
                ? "Highly Recommend"
                : r.recommendation === "recommended"
                  ? "Recommend"
                  : r.recommendation === "consider"
                    ? "Consider"
                    : "Not Suitable";
            return {
              candidateId: r.applicantId,
              name: r.applicantId,
              rank: idx + 1,
              matchScore: r.matchScore,
              confidence: conf,
              strengths: Array.isArray(r.strengths) ? r.strengths : [],
              gaps: Array.isArray(r.gaps) ? r.gaps : [],
              reasoning: String(r.reasoning ?? ""),
              finalRecommendation: rec,
            };
          });

        return {
          kind: "external" as const,
          status: payload?.status ?? "processing",
          results: mapped,
          screeningId: payload?.screeningId ?? screeningId,
          jobId: payload?.jobId ?? "",
        };
      }
    },
    refetchInterval: (query) => {
      const data: any = query.state.data;
      if (data?.kind === "external" && data?.status === "processing")
        return 2000;
      return false;
    },
  });

  const isInternal = resultsQuery.data?.kind === "internal";
  const results = resultsQuery.data?.results ?? [];

  const jobIdForWeights =
    resultsQuery.data?.kind === "internal"
      ? (resultsQuery.data?.screening?.jobId ?? "")
      : resultsQuery.data?.kind === "external"
        ? (resultsQuery.data?.jobId ?? "")
        : "";

  type BackendJob = {
    _id: string;
    title: string;
    weights?: {
      skills?: number;
      experience?: number;
      education?: number;
    };
  };

  const jobQuery = useQuery({
    queryKey: ["admin", "screening", screeningId, "job", jobIdForWeights],
    enabled: Boolean(jobIdForWeights),
    queryFn: async () => {
      const res = await api.get(`/jobs/${jobIdForWeights}`);
      return (res.data?.job ?? null) as BackendJob | null;
    },
    staleTime: 30_000,
  });

  const weights = jobQuery.data?.weights ?? null;

  const emailMutation = useMutation({
    mutationFn: async (candidateId: string) => {
      const res = await api.post(`/email/send/${screeningId}`, {
        mode: "selected_only",
        selectedCandidateId: candidateId,
      });
      return res.data;
    },
    onSuccess: () => {
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    },
  });

  const isSendingEmails = emailMutation.isPending;

  const handleSendEmails = async () => {
    if (!isInternal) return;
    if (selectedCandidateIds.length === 0) return;
    for (const candidateId of selectedCandidateIds) {
      // eslint-disable-next-line no-await-in-loop
      await emailMutation.mutateAsync(candidateId);
    }
  };

  const toggleCandidateSelect = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const emailDisabled = !isInternal;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#25324B]">Screening Results</h1>
        <p className="text-sm text-[#7C8493]">
          ID: <span className="font-mono text-[#286ef0]">{screeningId}</span>
        </p>
      </div>

      <div className="mb-6 rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7C8493]">
              Screening weights
            </p>
            <p className="mt-1 text-sm font-semibold text-[#25324B]">
              {jobQuery.isLoading
                ? "Loading..."
                : jobQuery.data?.title
                  ? `Job: ${jobQuery.data.title}`
                  : jobIdForWeights
                    ? `Job ID: ${jobIdForWeights}`
                    : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-[#25324B]">
              Skills{" "}
              {Number(weights?.skills ?? 0) < 1
                ? Number(weights?.skills) * 100
                : Number(weights?.skills ?? 0)}
              %
            </span>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-[#25324B]">
              Experience{" "}
              {Number(weights?.experience ?? 0) < 1
                ? Number(weights?.experience) * 100
                : Number(weights?.experience ?? 0)}
              %
            </span>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-[#25324B]">
              Education{" "}
              {Number(weights?.education ?? 0) < 1
                ? Number(weights?.education) * 100
                : Number(weights?.education ?? 0)}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline Stepper */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { id: "results", label: "Results" },
            { id: "shortlist", label: "Shortlist" },
            { id: "interview_email", label: "Invite" },
            { id: "interview_manage", label: "Interviews" },
            { id: "contract_generate", label: "Contracts" },
            { id: "contract_email", label: "Send" },
            { id: "complete", label: "Complete" },
          ].map((s, idx, arr) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => setStep(s.id as PipelineStep)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  step === s.id
                    ? "bg-[#286ef0] text-white"
                    : arr.findIndex((x) => x.id === step) > idx
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {arr.findIndex((x) => x.id === step) > idx && "✓ "}
                {s.label}
              </button>
              {idx < arr.length - 1 && (
                <div
                  className={`mx-1 h-px w-4 ${
                    arr.findIndex((x) => x.id === step) > idx
                      ? "bg-green-300"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === "results" && (
        <ResultsStep
          results={results}
          selectedCandidateIds={selectedCandidateIds}
          expandedCandidate={expandedCandidate}
          onToggleSelect={(id) => toggleCandidateSelect(id)}
          onToggleExpand={setExpandedCandidate}
          onNext={() => {
            setShortlistedIds(selectedCandidateIds);
            setStep("shortlist");
          }}
          onCompare={() => {
            if (selectedCandidateIds.length !== 2) return;
            const [a, b] = selectedCandidateIds;
            router.push(
              `/admin/screening/${screeningId}/compare?a=${encodeURIComponent(
                a,
              )}&b=${encodeURIComponent(b)}`,
            );
          }}
          onRestart={() => router.push("/admin/screening")}
          onBack={() => router.push("/admin/screening")}
        />
      )}

      {step === "shortlist" && (
        <ShortlistStep
          candidates={results.map(
            (r): ShortlistCandidate => ({
              candidateId: r.candidateId,
              name: r.name,
              email: "", // Would need to fetch from talent
              rank: r.rank,
              matchScore: r.matchScore,
              confidence: r.confidence,
              strengths: r.strengths,
            }),
          )}
          initiallySelected={shortlistedIds}
          jobTitle={jobQuery.data?.title || "Position"}
          onContinue={(ids) => {
            setShortlistedIds(ids);
            setStep("interview_email");
          }}
          onBack={() => setStep("results")}
        />
      )}

      {step === "interview_email" && (
        <InterviewEmailStep
          candidates={results
            .filter((r) => shortlistedIds.includes(r.candidateId))
            .map(
              (r): InterviewEmailCandidate => ({
                candidateId: r.candidateId,
                name: r.name,
                email: "", // Would need to fetch
                rank: r.rank,
                matchScore: r.matchScore,
              }),
            )}
          jobTitle={jobQuery.data?.title || "Position"}
          onSend={async (data) => {
            // Initialize interview candidates
            setInterviewCandidates(
              data.candidates.map((c) => ({
                ...c,
                status: "invited",
                scheduledDate: data.date,
                scheduledTime: data.time,
              })),
            );
            setStep("interview_manage");
          }}
          onBack={() => setStep("shortlist")}
        />
      )}

      {step === "interview_manage" && (
        <InterviewManageStep
          candidates={interviewCandidates}
          jobTitle={jobQuery.data?.title || "Position"}
          onContinue={(ids) => {
            setStep("contract_generate");
          }}
          onBack={() => setStep("interview_email")}
        />
      )}

      {step === "contract_generate" && (
        <ContractGenerateStep
          candidates={interviewCandidates
            .filter((c) => c.status === "completed" && (c.rating || 0) >= 4)
            .map((c) => ({
              candidateId: c.candidateId,
              name: c.name,
              email: c.email,
              position: jobQuery.data?.title || "Position",
            }))}
          jobTitle={jobQuery.data?.title || "Position"}
          onContinue={(contracts) => {
            setContractCandidates(
              contracts.map((c) => {
                const candidate = interviewCandidates.find(
                  (ic) => ic.candidateId === c.candidateId,
                )!;
                return {
                  candidateId: c.candidateId,
                  name: candidate.name,
                  email: candidate.email,
                  position: jobQuery.data?.title || "Position",
                  contractText: c.contractText,
                  status: "pending",
                };
              }),
            );
            setStep("contract_email");
          }}
          onBack={() => setStep("interview_manage")}
        />
      )}

      {step === "contract_email" && (
        <ContractEmailStep
          candidates={contractCandidates}
          jobTitle={jobQuery.data?.title || "Position"}
          onSend={async (candidateId, emailData) => {
            // Send email API call would go here
            await new Promise((r) => setTimeout(r, 500));
          }}
          onBack={() => setStep("contract_generate")}
          onComplete={() => {
            setCompletedHires(contractCandidates.map((c) => c.candidateId));
            setStep("complete");
          }}
        />
      )}

      {step === "complete" && (
        <div className="text-center py-12">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#25324B] mb-2">
            Hiring Process Complete!
          </h2>
          <p className="text-[#7C8493] mb-6">
            {completedHires.length} candidate(s) have been successfully hired
            for {jobQuery.data?.title}
          </p>
          <button
            onClick={() => router.push("/admin/screening")}
            className="rounded-lg bg-[#286ef0] px-6 py-2 text-sm font-bold text-white hover:bg-[#1f5fe0]"
          >
            Start New Screening
          </button>
        </div>
      )}
    </div>
  );
}
