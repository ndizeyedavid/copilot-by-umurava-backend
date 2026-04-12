import { Document, Schema } from "mongoose";

export interface ICandidates {
  candidateId: string;
  rank: number;
  matchScore: number;
  confidence: "high" | "medium" | "low";
  strengths: string[];
  gaps: string[];
  reasoning: string;
  finalRecommendation: string;
  comparisonNotes?: string;
}

export interface IScreening extends Document {
  jobId: string;
  candidates: ICandidates[];
  comparisonSummary?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// export default IScreening;
