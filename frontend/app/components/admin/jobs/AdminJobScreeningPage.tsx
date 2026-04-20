"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ScreeningStepper from "./screening/ScreeningStepper";
import ScreeningHistoryStep, {
  SavedScreening,
} from "./screening/ScreeningHistoryStep";
import JobSelectionStep, { JobSummary } from "./screening/JobSelectionStep";
import SourceSelectionStep from "./screening/SourceSelectionStep";
import ProcessingStep from "./screening/ProcessingStep";
import WeightsStep from "./screening/WeightsStep";
import { api } from "@/lib/api/client";

type ScreeningStep =
  | "history"
  | "select_job"
  | "select_source"
  | "weights"
  | "processing";

const STEPS = [
  { id: "select_job", label: "Select Job" },
  { id: "select_source", label: "Source" },
  { id: "weights", label: "Weights" },
  { id: "processing", label: "Screening" },
];

const LOADING_MESSAGES = [
  "Fetching candidate applications...",
  "Analyzing resumes with AI...",
  "Calculating match scores based on job weights...",
  "Ranking candidates by experience and skills...",
  "Evaluating cultural fit indicators...",
  "Checking for skill gaps...",
  "Cooking up the final leaderboard...",
  "Counting stars in the sky while AI thinks...",
  "Finalizing recommendations...",
];

type BackendScreening = {
  _id: string;
  jobId: string;
  candidates: {
    candidateId: string;
    rank: number;
    matchScore: number;
    confidence: "high" | "medium" | "low";
  }[];
  createdAt: string;
};

type BackendJob = {
  _id: string;
  title: string;
  createdAt: string;
  weights?: {
    skills: number;
    experience: number;
    education: number;
  };
};

type BackendApplication = {
  _id: string;
  jobId: string;
};

type UmuravaTalent = {
  email: string;
  firstName: string;
  lastName?: string;
  headline: string;
  bio?: string;
  location?: string;
  skills?: Array<{ name: string; level: string; yearsOfExperience: number }>;
  languages?: Array<{ name?: string; proficiency?: string }>;
  experience?: Array<any>;
  education?: Array<any>;
  certifications?: Array<any>;
  projects?: Array<any>;
  availability?: any;
  socialLinks?: string[];
};

export default function AdminJobScreeningPage({
  jobId: initialJobId,
}: {
  jobId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<ScreeningStep>(
    initialJobId ? "select_source" : "history",
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialJobId || "",
  );
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [weights, setWeights] = useState<{
    skills: number;
    experience: number;
    education: number;
  } | null>(null);
  const [pendingSource, setPendingSource] = useState<{
    source: "internal" | "upload" | "umurava";
    params: { topN: number; file?: File };
  } | null>(null);

  const screeningsQuery = useQuery({
    queryKey: ["admin", "screenings", initialJobId ?? "all"],
    queryFn: async () => {
      const url = initialJobId
        ? `/screening/job/${initialJobId}`
        : "/screening";
      const res = await api.get(url);
      const list = (res.data?.fetchedScreenings ??
        res.data?.fetchedScreening ??
        []) as BackendScreening[];
      return Array.isArray(list) ? list : [];
    },
  });

  const startUmuravaMutation = useMutation({
    mutationFn: async ({ jobId, topN }: { jobId: string; topN: number }) => {
      const dummyRes = await api.get("/umurava/talents/dummy");
      const talents = (dummyRes.data?.talents ?? []) as UmuravaTalent[];

      const res = await api.post("/screening/import/umurava", {
        jobId,
        topN,
        talents,
      });

      return res.data?.screening as BackendScreening;
    },
    onSuccess: (screening) => {
      if (!screening?._id) return;
      router.push(`/admin/screening/${screening._id}`);
    },
  });

  const jobsQuery = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: async () => {
      const res = await api.get("/jobs");
      return (res.data?.jobs ?? []) as BackendJob[];
    },
  });

  const applicationsQuery = useQuery({
    queryKey: ["admin", "applications"],
    queryFn: async () => {
      const res = await api.get("/applications");
      return (res.data?.applications ?? []) as BackendApplication[];
    },
  });

  const runInternalMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await api.post(`/screening/ai/${jobId}`);
      return res.data?.screening as BackendScreening;
    },
    onSuccess: (screening) => {
      if (!screening?._id) return;
      router.push(`/admin/screening/${screening._id}`);
    },
  });

  const startExternalMutation = useMutation({
    mutationFn: async ({
      jobId,
      file,
      topN,
    }: {
      jobId: string;
      file: File;
      topN: number;
    }) => {
      const form = new FormData();
      form.append("file", file);
      form.append("jobId", jobId);
      form.append("topN", String(topN));
      const res = await api.post("/external-screening/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return {
        screeningId: String(res.data?.screeningId ?? ""),
      };
    },
    onSuccess: ({ screeningId }) => {
      if (!screeningId) return;
      router.push(`/admin/screening/${screeningId}`);
    },
  });

  const isProcessing =
    runInternalMutation.isPending ||
    startExternalMutation.isPending ||
    startUmuravaMutation.isPending;

  const jobs = useMemo((): JobSummary[] => {
    const rawJobs = jobsQuery.data || [];
    const rawApps = applicationsQuery.data || [];

    const counts = new Map<string, number>();
    for (const app of rawApps) {
      counts.set(app.jobId, (counts.get(app.jobId) ?? 0) + 1);
    }

    return rawJobs.map((j) => ({
      id: j._id,
      title: j.title,
      company: "Umurava",
      applicants: counts.get(j._id) ?? 0,
    }));
  }, [jobsQuery.data, applicationsQuery.data]);

  const screeningHistory = useMemo((): SavedScreening[] => {
    const list = screeningsQuery.data || [];
    return list.map((s) => {
      const top =
        Array.isArray(s.candidates) && s.candidates.length
          ? Math.max(...s.candidates.map((c) => c.matchScore))
          : 0;
      const topCandidate =
        Array.isArray(s.candidates) && s.candidates.length
          ? s.candidates.reduce(
              (best, c) => (c.matchScore > best.matchScore ? c : best),
              s.candidates[0],
            )
          : null;
      return {
        id: s._id,
        jobId: s.jobId,
        jobTitle: jobs.find((j) => j.id === s.jobId)?.title || "Umurava",
        date: new Date(s.createdAt).toLocaleDateString(),
        candidateCount: Array.isArray(s.candidates) ? s.candidates.length : 0,
        topScore: top,
        confidence: (topCandidate?.confidence ??
          "medium") as SavedScreening["confidence"],
      };
    });
  }, [screeningsQuery.data, jobs]);

  useEffect(() => {
    if (step === "processing" && isProcessing) {
      const interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [step, isProcessing]);

  useEffect(() => {
    if (step === "processing" && !isProcessing) {
      setStep(initialJobId ? "select_source" : "history");
    }
  }, [step, isProcessing, initialJobId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#25324B]">
          AI Candidate Screening
        </h1>
        <p className="text-sm text-[#7C8493]">
          Automated ranking and analysis for{" "}
          <span className="font-semibold text-[#25324B]">
            {selectedJobId
              ? jobs.find((j) => j.id === selectedJobId)?.title
              : "Selected Job"}
          </span>
        </p>
      </div>

      {step !== "history" && (
        <ScreeningStepper steps={STEPS} currentStep={step} />
      )}

      {step === "history" && (
        <ScreeningHistoryStep
          screenings={screeningHistory}
          onView={(id) => router.push(`/admin/screening/${id}`)}
          onReRun={(id) => {
            const screening = screeningHistory.find((s) => s.id === id);
            if (!screening?.jobId) return;
            setSelectedJobId(screening.jobId);
            setStep("processing");
            runInternalMutation.mutate(screening.jobId);
          }}
          onStartNew={() => setStep("select_job")}
        />
      )}

      {step === "select_job" && (
        <JobSelectionStep
          jobs={jobs}
          onSelect={(id) => {
            setSelectedJobId(id);
            setStep("select_source");
          }}
          onBack={() => setStep("history")}
        />
      )}

      {step === "select_source" && (
        <SourceSelectionStep
          onSelect={(source, params) => {
            if (!selectedJobId) return;
            const job = jobsQuery.data?.find((j) => j._id === selectedJobId);
            setWeights(
              job?.weights ?? { skills: 40, experience: 35, education: 25 },
            );
            setPendingSource({ source, params });
            setStep("weights");
          }}
          onBack={() => setStep("select_job")}
        />
      )}

      {step === "weights" && weights && pendingSource && selectedJobId && (
        <WeightsStep
          jobId={selectedJobId}
          initialWeights={weights}
          onContinue={(newWeights) => {
            setWeights(newWeights);
            setStep("processing");
            if (!selectedJobId) return;
            const { source, params } = pendingSource;
            if (source === "internal") {
              runInternalMutation.mutate(selectedJobId);
            } else if (source === "umurava") {
              startUmuravaMutation.mutate({
                jobId: selectedJobId,
                topN: params.topN,
              });
            } else if (source === "upload" && params.file) {
              startExternalMutation.mutate({
                jobId: selectedJobId,
                file: params.file,
                topN: params.topN,
              });
            }
          }}
          onBack={() => setStep("select_source")}
        />
      )}

      {step === "processing" && (
        <ProcessingStep
          message={LOADING_MESSAGES[loadingMsgIndex]}
          progress={((loadingMsgIndex + 0.5) * 100) / LOADING_MESSAGES.length}
        />
      )}
    </div>
  );
}
