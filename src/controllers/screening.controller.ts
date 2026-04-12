import { Request, Response } from "express";
import Screening from "../models/screening.model";
import Jobs from "../models/jobs.model";
import Talent from "../models/talents.model";
import { IScreening } from "../types/screening.types";
import {
  evaluateCandidates,
  CandidateData,
  JobData,
} from "../services/gemini.service";

const screeningController = {
  async getAll(req: Request, res: Response) {
    try {
      const fetchedScreenings = await Screening.find();
      return res.status(200).json({
        message: `${fetchedScreenings.length} screening(s) fetched`,
        fetchedScreenings,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to fetch all listings",
        error: error.message,
      });
    }
  },
  async getByJobId(req: Request, res: Response) {
    try {
      const { jobId } = req.params;

      const fetchedScreening = await Screening.find({ jobId });

      if (!fetchedScreening)
        return res
          .status(200)
          .json({ message: "No screening found for that job" });

      return res.status(200).json({
        message: `Screenings found for this Job: ${jobId}`,
        fetchedScreening,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to fetch listing for that Job",
        error: error.message,
      });
    }
  },
  async getOne(req: Request, res: Response) {
    try {
      const { screeningId } = req.params;

      const fetchedScreening = await Screening.findById(screeningId);

      if (!fetchedScreening)
        return res.status(404).json({ message: "Screening ID not found" });

      return res
        .status(200)
        .json({ message: "Screening ID Found", fetchedScreening });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to get one screening", error: error.message });
    }
  },

  async updateScreening(req: Request, res: Response) {
    try {
      const { screeningId } = req.params;
      const payload: IScreening = req.body;

      const updatedScreening = await Screening.findByIdAndUpdate(
        screeningId,
        payload,
      );

      if (!updatedScreening)
        return res.status(404).json({ message: "Job Screening not found" });

      return res
        .status(200)
        .json({ message: "Job screening updated", updatedScreening });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to update screening", error: error.message });
    }
  },

  async deleteScreening(req: Request, res: Response) {
    try {
      const { screeningId } = req.params;

      const deletedScreening = await Screening.findByIdAndDelete(screeningId);

      if (!deletedScreening)
        return res.status(404).json({ message: "Job Screening not found" });

      return res
        .status(200)
        .json({ message: "Job screening updated", deletedScreening });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to delete screening", error: error.message });
    }
  },

  async runAiScreening(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const { candidateIds } = req.body;

      const job = await Jobs.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      const query = candidateIds ? { _id: { $in: candidateIds } } : {};
      const talents = await Talent.find(query);
      if (!talents.length)
        return res.status(400).json({ message: "No candidates found" });

      const jobData: JobData = {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        weights: job.weights,
      };

      const candidatesData: CandidateData[] = talents.map((t) => ({
        id: t._id.toString(),
        firstName: t.firstName,
        lastName: t.lastName,
        headline: t.headline,
        bio: t.bio,
        skills: t.skills,
        experience: t.experience,
        education: t.education,
        certifications: t.certifications,
        projects: t.projects,
      }));

      const aiResult = await evaluateCandidates(jobData, candidatesData);

      const screening = await Screening.create({
        jobId: job._id.toString(),
        candidates: aiResult.candidates,
        comparisonSummary: aiResult.comparisonSummary,
      });

      return res.status(200).json({
        message: `AI screening complete. ${aiResult.candidates.length} candidates ranked`,
        screening,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "AI screening failed",
        error: error.message,
      });
    }
  },
};

export { screeningController };
