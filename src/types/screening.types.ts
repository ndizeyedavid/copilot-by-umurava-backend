import { Document, Schema } from "mongoose";

export interface ICandidates {
  candidateId: any;
  score: number;
  confidence: "high" | "medium" | "low";
  strength: string[];
  gaps: string[];
  reasoning: string;
  comparisonNotes: string;
  rank: number;
}

export interface IScreening extends Document {
  jobId: string;
  candidates: ICandidates[];
}

// export default IScreening;
