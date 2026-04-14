import { Request, Response } from "express";
import { ITalent } from "../types/talents.types";
import Talent from "../models/talents.model";
import User from "../models/user.model";

interface IQuery {
  firstName: any;
  lastName: any;
}

const talentController = {
  async getAll(req: Request, res: Response) {
    try {
      const talents = await Talent.find().populate(
        "userId",
        "firstName lastName email picture",
      );

      return res
        .status(200)
        .json({ message: `${talents.length} Talent(s) fetched`, talents });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to fetch all talents", error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { talentId } = req.params;

      const fetchedTalent = await Talent.findById(talentId).populate(
        "userId",
        "firstName lastName email picture",
      );

      if (!fetchedTalent)
        return res.status(404).json({ message: "Talent not found" });

      return res.status(200).json({ message: "Talent Found", fetchedTalent });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to fetch a talent", error: error.message });
    }
  },

  async createTalent(req: Request, res: Response) {
    try {
      const payload: ITalent = req.body;

      const createdTalent = await Talent.create(payload);

      return res
        .status(201)
        .json({ message: "New Talent Added", createdTalent });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to create new talent", error: error.message });
    }
  },

  async updateTalent(req: Request, res: Response) {
    try {
      const { talentId } = req.params;
      const payload: ITalent = req.body;

      const updatedTalent = await Talent.findByIdAndUpdate(talentId, payload);

      if (!updatedTalent)
        return res.status(404).json({ message: "Talent Not Found" });

      return res.status(200).json({ message: "Talent Updated", updatedTalent });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to update talent", error: error.message });
    }
  },

  async deleteTalent(req: Request, res: Response) {
    try {
      const { talentId } = req.params;

      const deleteTalent = await Talent.findByIdAndDelete(talentId);

      if (!talentId)
        return res.status(404).json({ message: "Talent not found" });

      return res
        .status(200)
        .json({ message: "Talent deleted successfully", deleteTalent });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to delete talent", error: error.message });
    }
  },
};

export { talentController };
