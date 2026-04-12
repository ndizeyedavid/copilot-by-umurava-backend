import { Schema, model } from "mongoose";
import { IScreening, ICandidates } from "../types/screening.types";

const screeningSchema = new Schema<IScreening>(
  {
    jobId: { type: String, required: true },
    candidates: {
      type: [
        {
          candidateId: { type: String, required: true },
          rank: { type: Number, required: true },
          matchScore: { type: Number, required: true, min: 0, max: 100 },
          confidence: {
            type: String,
            enum: ["high", "medium", "low"],
            required: true,
          },
          strengths: { type: [String], default: [] },
          gaps: { type: [String], default: [] },
          reasoning: { type: String, required: true },
          finalRecommendation: { type: String, required: true },
          comparisonNotes: { type: String },
        },
      ],
      required: true,
    },
    comparisonSummary: { type: String },
  },
  { timestamps: true },
);

const Screening = model<IScreening>("Screening", screeningSchema);

export default Screening;
