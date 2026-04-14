import { Schema, model } from "mongoose";
import { ITalent } from "../types/talents.types";

const talentSchema = new Schema<ITalent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    headline: { type: String, required: true },
    bio: { type: String },
    location: { type: String, required: true },
    skills: [
      {
        name: { type: String, required: true },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          required: true,
        },
        yearsOfExperience: { type: Number, required: true },
      },
    ],
    languages: [
      {
        name: { type: String, required: true },
        proficiency: {
          type: String,
          enum: ["Basic", "Conversational", "Fluent", "Native"],
          required: true,
        },
      },
    ],
    experience: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String, required: true },
        technologies: [String],
        IsCurrent: { type: Boolean, default: false },
      },
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        startYear: { type: Date, required: true },
        endYear: { type: Date, required: true },
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        issueDate: { type: Date, required: true },
      },
    ],
    projects: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [String],
        role: { type: String, required: true },
        link: String,
        startDate: { type: Date, required: true },
        endDate: Date,
      },
    ],
    availability: {
      status: {
        type: String,
        enum: ["Available", "Open", "Not Available"],
        required: true,
      },
      type: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract"],
        required: true,
      },
      startDate: Date,
    },
    socialLinks: [String],
    rawCv: Schema.Types.Mixed,
  },
  { timestamps: true },
);

const Talent = model<ITalent>("Talent", talentSchema);

export default Talent;
