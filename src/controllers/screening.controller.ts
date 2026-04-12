import { Request, Response } from "express";
import Screening from "../models/screening.model";
import { IScreening } from "../types/screening.types";

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
};

export { screeningController };
