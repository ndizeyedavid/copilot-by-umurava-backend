import { Schema, model } from "mongoose";
import { IApplication } from "../types/application.types";

const applicationSchema = new Schema<IApplication>(
  {
    jobId: { type: String, required: true, index: true, ref: "Job" },
    talentId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "rejected", "hired"],
      default: "pending",
      required: true,
    },
    coverLetter: { type: String },
    resumeUrl: { type: String },
    notes: { type: String },
    screeningId: { type: String },
  },
  { timestamps: true },
);

applicationSchema.index({ jobId: 1, talentId: 1 }, { unique: true });

const Application = model<IApplication>("Application", applicationSchema);

export default Application;
