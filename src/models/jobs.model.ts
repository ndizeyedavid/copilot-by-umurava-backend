import { Schema, model } from "mongoose";
import { IJob } from "../types/job.types";

const jobsSchema = new Schema<IJob>(
  {
    title: String,
    description: String,
    requirements: [String],
    weights: {
      skills: Number,
      experience: Number,
      education: Number,
    },
  },
  {
    timestamps: true,
  },
);

const Jobs = model<IJob>("Job", jobsSchema);

export default Jobs;
