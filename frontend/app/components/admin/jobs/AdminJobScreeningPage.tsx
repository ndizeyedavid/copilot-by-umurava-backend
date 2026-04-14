"use client";

import { useState, useEffect } from "react";
import ScreeningStepper from "./screening/ScreeningStepper";
import ScreeningHistoryStep, {
  SavedScreening,
} from "./screening/ScreeningHistoryStep";
import JobSelectionStep, { JobSummary } from "./screening/JobSelectionStep";
import SourceSelectionStep from "./screening/SourceSelectionStep";
import ProcessingStep from "./screening/ProcessingStep";
import ResultsStep, { CandidateResult } from "./screening/ResultsStep";

type ScreeningStep =
  | "history"
  | "select_job"
  | "select_source"
  | "processing"
  | "results";

const STEPS = [
  { id: "select_job", label: "Select Job" },
  { id: "select_source", label: "Source" },
  { id: "processing", label: "Screening" },
  { id: "results", label: "Results" },
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

export default function AdminJobScreeningPage({
  jobId: initialJobId,
}: {
  jobId?: string;
}) {
  const [step, setStep] = useState<ScreeningStep>(
    initialJobId ? "select_source" : "history",
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialJobId || "",
  );
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(
    null,
  );
  const [selectedForEmail, setSelectedForEmail] = useState<string[]>([]);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Mock History
  const screeningHistory: SavedScreening[] = [
    {
      id: "scr_1",
      jobTitle: "Senior Frontend Engineer",
      date: "Apr 12, 2026",
      candidateCount: 48,
      topScore: 94,
      confidence: "high",
    },
    {
      id: "scr_2",
      jobTitle: "Product Designer",
      date: "Apr 10, 2026",
      candidateCount: 31,
      topScore: 88,
      confidence: "high",
    },
  ];

  // Mock jobs list
  const jobs: JobSummary[] = [
    {
      id: "job_1",
      title: "Senior Frontend Engineer",
      company: "Umurava",
      applicants: 48,
    },
    {
      id: "job_2",
      title: "Product Designer",
      company: "Copilot Team",
      applicants: 31,
    },
    {
      id: "job_3",
      title: "Backend Developer",
      company: "TechCorp Solutions",
      applicants: 64,
    },
  ];

  // Mock results data
  const results: CandidateResult[] = [
    {
      candidateId: "can_1",
      name: "Justin Lipshutz",
      rank: 1,
      matchScore: 94,
      confidence: "high",
      strengths: [
        "Expert React/Next.js knowledge",
        "Led teams of 10+",
        "Strong UI/UX background",
      ],
      gaps: ["Limited exposure to AWS Lambda"],
      reasoning:
        "Justin exceeds all primary requirements for the Senior Frontend role. His experience at Umurava directly aligns with our tech stack.",
      finalRecommendation: "Highly Recommend - Immediate Interview",
      comparisonNotes: "Strongest technical background among all applicants.",
    },
    {
      candidateId: "can_2",
      name: "Marcus Culhane",
      rank: 2,
      matchScore: 88,
      confidence: "high",
      strengths: [
        "Strong TypeScript skills",
        "Great communication",
        "Open source contributor",
      ],
      gaps: ["No direct experience with Micro-frontends"],
      reasoning:
        "Very solid engineer. Technical test was nearly perfect. Lacks the same level of leadership experience as candidate #1.",
      finalRecommendation: "Recommend - Technical Interview",
    },
    {
      candidateId: "can_3",
      name: "Sofia Rodriguez",
      rank: 3,
      matchScore: 75,
      confidence: "medium",
      strengths: ["Excellent UX Research skills", "Prototyping expert"],
      gaps: [
        "Weaker in heavy state management (Redux/Zustand)",
        "Mostly design-focused",
      ],
      reasoning:
        "Great profile but might be better suited for a Product Designer role. Technical skills are adequate but not 'Senior' level for this specific engineering track.",
      finalRecommendation: "Consider - Portfolio Review",
    },
  ];

  useEffect(() => {
    if (step === "processing") {
      const interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);

      const timer = setTimeout(() => {
        setStep("results");
        clearInterval(interval);
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [step]);

  const handleSendEmails = () => {
    setIsSendingEmails(true);
    setTimeout(() => {
      setIsSendingEmails(false);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }, 2000);
  };

  const toggleCandidateEmail = (id: string) => {
    setSelectedForEmail((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

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
          onView={(id) => setStep("results")}
          onReRun={(id) => setStep("processing")}
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
          onSelect={() => setStep("processing")}
          onBack={() => setStep("select_job")}
        />
      )}

      {step === "processing" && (
        <ProcessingStep
          message={LOADING_MESSAGES[loadingMsgIndex]}
          progress={((loadingMsgIndex + 1) * 100) / LOADING_MESSAGES.length}
        />
      )}

      {step === "results" && (
        <ResultsStep
          results={results}
          selectedForEmail={selectedForEmail}
          isSendingEmails={isSendingEmails}
          emailSent={emailSent}
          expandedCandidate={expandedCandidate}
          onToggleEmail={toggleCandidateEmail}
          onToggleExpand={setExpandedCandidate}
          onSendEmails={handleSendEmails}
          onRestart={() => {
            setStep("history");
            setSelectedJobId("");
            setSelectedForEmail([]);
          }}
          onBack={() => setStep("history")}
        />
      )}
    </div>
  );
}
