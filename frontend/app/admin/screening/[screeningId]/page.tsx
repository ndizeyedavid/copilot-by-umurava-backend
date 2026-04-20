"use client";

import { useParams } from "next/navigation";
import ResultsStep, {
  CandidateResult,
} from "@/app/components/admin/jobs/screening/ResultsStep";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export default function ScreeningResultsPage() {
  const params = useParams<{ screeningId: string }>();
  const screeningId = params?.screeningId ?? "";
  const router = useRouter();

  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(
    null,
  );
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(
    [],
  );
  const [emailSent, setEmailSent] = useState(false);

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

      <ResultsStep
        results={results}
        selectedCandidateIds={selectedCandidateIds}
        isSendingEmails={isSendingEmails}
        emailSent={emailSent}
        expandedCandidate={expandedCandidate}
        onToggleSelect={(id) => {
          if (emailDisabled) return;
          toggleCandidateSelect(id);
        }}
        onToggleExpand={setExpandedCandidate}
        onSendEmails={handleSendEmails}
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
    </div>
  );
}
