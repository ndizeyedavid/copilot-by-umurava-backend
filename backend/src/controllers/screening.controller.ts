import { Request, Response } from "express";
import Screening from "../models/screening.model";
import Jobs from "../models/jobs.model";
import Talent from "../models/talents.model";
import Application from "../models/application.model";
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

      const job = await Jobs.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      // Fetch applicants for this job
      const applications = await Application.find({ jobId });
      if (!applications.length) {
        return res
          .status(400)
          .json({ message: "No applicants found for this job" });
      }

      const talentIds = applications.map((app) => app.talentId);
      const talents = await Talent.find({ _id: { $in: talentIds } }).populate(
        "userId",
      );

      if (!talents.length) {
        return res.status(400).json({ message: "No candidate profiles found" });
      }

      const jobData: JobData = {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        weights: job.weights,
      };

      const candidatesData: CandidateData[] = talents.map((t: any) => ({
        id: t._id.toString(),
        firstName: t.userId?.firstName || "Unknown",
        lastName: t.userId?.lastName || "",
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

      // Link screening to applications and update status
      for (const app of applications) {
        const candidateResult = aiResult.candidates.find(
          (c) => c.candidateId === app.talentId,
        );
        await Application.findByIdAndUpdate(app._id, {
          screeningId: screening._id.toString(),
          status:
            candidateResult?.finalRecommendation === "Strong hire"
              ? "shortlisted"
              : "reviewing",
          notes: candidateResult?.reasoning,
        });
      }

      return res.status(200).json({
        message: `AI screening complete. ${aiResult.candidates.length} applicants ranked`,
        screening,
        applicantsScreened: applications.length,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "AI screening failed",
        error: error.message,
      });
    }
  },

  async runAiScreeningFromUmurava(req: Request, res: Response) {
    try {
      const {
        jobId,
        topN = 10,
        talents,
      }: {
        jobId?: string;
        topN?: number;
        talents?: any[];
      } = req.body;

      if (!jobId) {
        return res.status(400).json({ message: "jobId is required" });
      }

      const job = await Jobs.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      const list = Array.isArray(talents) ? talents : [];
      if (list.length === 0) {
        return res.status(400).json({ message: "talents array is required" });
      }

      const n = Number(topN);
      const safeTopN = Number.isFinite(n)
        ? Math.min(Math.max(Math.floor(n), 1), list.length)
        : Math.min(10, list.length);

      const jobData: JobData = {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        weights: job.weights,
      };

      const candidatesData: CandidateData[] = list.map(
        (t: any, idx: number) => {
          const email = String(t?.email ?? "").trim();
          const id = email ? `umurava:${email}` : `umurava:${idx + 1}`;

          const skills = Array.isArray(t?.skills) ? t.skills : [];
          const experience = Array.isArray(t?.experience) ? t.experience : [];
          const education = Array.isArray(t?.education) ? t.education : [];
          const certifications = Array.isArray(t?.certifications)
            ? t.certifications
            : [];
          const projects = Array.isArray(t?.projects) ? t.projects : [];

          return {
            id,
            firstName: String(t?.firstName ?? "Unknown"),
            lastName: String(t?.lastName ?? ""),
            headline: String(t?.headline ?? ""),
            bio: t?.bio ? String(t.bio) : undefined,
            skills: skills
              .filter(Boolean)
              .map((s: any) => ({
                name: String(s?.name ?? ""),
                level: String(s?.level ?? "Intermediate"),
                yearsOfExperience: Number(s?.yearsOfExperience ?? 0),
              }))
              .filter((s: any) => s.name),
            experience: experience.filter(Boolean).map((e: any) => ({
              company: String(e?.company ?? ""),
              role: String(e?.role ?? ""),
              description: String(e?.description ?? ""),
              technologies: Array.isArray(e?.technologies)
                ? e.technologies.map((x: any) => String(x))
                : [],
              startDate: e?.startDate ? new Date(e.startDate) : new Date(),
              endDate: e?.endDate ? new Date(e.endDate) : undefined,
            })),
            education: education.filter(Boolean).map((ed: any) => ({
              institution: String(ed?.institution ?? ""),
              degree: String(ed?.degree ?? ""),
              fieldOfStudy: String(ed?.fieldOfStudy ?? ""),
            })),
            certifications: certifications
              .filter(Boolean)
              .map((c: any) => ({
                name: String(c?.name ?? ""),
                issuer: String(c?.issuer ?? ""),
              }))
              .filter((c: any) => c.name),
            projects: projects
              .filter(Boolean)
              .map((p: any) => ({
                name: String(p?.name ?? ""),
                description: String(p?.description ?? ""),
                technologies: Array.isArray(p?.technologies)
                  ? p.technologies.map((x: any) => String(x))
                  : [],
              }))
              .filter((p: any) => p.name),
          };
        },
      );

      const aiResult = await evaluateCandidates(jobData, candidatesData);

      const sortedCandidates = (aiResult.candidates ?? [])
        .slice()
        .sort((a, b) => a.rank - b.rank);
      const trimmed = sortedCandidates.slice(0, safeTopN);

      const screening = await Screening.create({
        jobId: job._id.toString(),
        candidates: trimmed,
        comparisonSummary: aiResult.comparisonSummary,
      });

      const metaById = new Map(
        list.map((t: any, idx: number) => {
          const email = String(t?.email ?? "").trim();
          const id = email ? `umurava:${email}` : `umurava:${idx + 1}`;
          return [
            id,
            {
              email,
              firstName: String(t?.firstName ?? ""),
              lastName: String(t?.lastName ?? ""),
              headline: String(t?.headline ?? ""),
              location: String(t?.location ?? ""),
            },
          ];
        }),
      );

      return res.status(200).json({
        message: `AI screening complete. ${trimmed.length} Umurava talents ranked`,
        screening,
        topN: safeTopN,
        rankedTalents: trimmed.map((c) => ({
          candidateId: c.candidateId,
          rank: c.rank,
          matchScore: c.matchScore,
          meta: metaById.get(c.candidateId) ?? null,
        })),
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
