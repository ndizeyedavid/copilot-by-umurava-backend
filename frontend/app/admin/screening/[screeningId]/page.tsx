"use client";

import { useParams } from "next/navigation";
import ResultsStep, { CandidateResult } from "@/app/components/admin/jobs/screening/ResultsStep";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScreeningResultsPage() {
  const params = useParams<{ screeningId: string }>();
  const screeningId = params?.screeningId ?? "";
  const router = useRouter();
  
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [selectedForEmail, setSelectedForEmail] = useState<string[]>([]);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Mock results data (In a real app, you'd fetch this using screeningId)
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#25324B]">Screening Results</h1>
        <p className="text-sm text-[#7C8493]">
          ID: <span className="font-mono text-[#286ef0]">{screeningId}</span>
        </p>
      </div>
      
      <ResultsStep
        results={results}
        selectedForEmail={selectedForEmail}
        isSendingEmails={isSendingEmails}
        emailSent={emailSent}
        expandedCandidate={expandedCandidate}
        onToggleEmail={toggleCandidateEmail}
        onToggleExpand={setExpandedCandidate}
        onSendEmails={handleSendEmails}
        onRestart={() => router.push("/admin/screening")}
        onBack={() => router.push("/admin/screening")}
      />
    </div>
  );
}
