import { Schema, model } from "mongoose";
import { IScreening, ICandidates } from "../types/screening.types";

const screeningSchema = new Schema<IScreening>(
  {
    jobId: { type: String, required: true },
    candidates: {
      type: [
        {
          candidateId: Schema.Types.Mixed,
          score: Number,
          confidence: {
            type: String,
            enum: ["high", "medium", "low"],
          },
          strength: [String],
          gaps: [String],
          reasoning: String,
          comparisonNotes: String,
          rank: Number,
        },
      ],
      required: true,
    },
  },
  { timestamps: true },
);

const Screening = model<IScreening>("Screening", screeningSchema);

export default Screening;
