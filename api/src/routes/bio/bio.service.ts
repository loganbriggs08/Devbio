import { User } from "../../models/User";
import { DataSource, getRepository } from "typeorm";
import { DeveloperBio } from "../../models/DeveloperBio";
import { Request, Response } from "express";

export class BioService {
  static async getBio(req: Request, res: Response) {
    try {
      const user_id: number = Number(req.body.user_id);

      if (isNaN(user_id)) {
        return res.status(400).json({ errors: ["Missing or invalid user_id"] });
      }

      const bio = await DeveloperBio.findOne({ where: { user_id } });

      if (!bio) {
        return res.status(404).json({ errors: ["Bio not found"] });
      }

      return res.status(200).json(bio);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: ["Failed to retrieve bio"] });
    }
  }

  static async updateBio(req: Request, res: Response) {
    try {
      const user_idParam = req.body.user_id;
      const user_id: number = Number(user_idParam);
      if (isNaN(user_id)) {
        return res.status(400).json({ errors: ["Missing or invalid user_id"] });
      }
  
      const bioToUpdate = await DeveloperBio.findOne({ where: { user_id } });
  
      if (!bioToUpdate) {
        return res.status(404).json({ errors: ["Bio not found"] });
      }
  
      const updatedFields = req.body;
      Object.assign(bioToUpdate, updatedFields);
  
      await bioToUpdate.save();
  
      return res.status(200).json({ message: "Bio updated", bio: bioToUpdate });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: ["Bio update failed", err.message] });
    }
  }

  static async deleteBio(req: Request, res: Response) {
    try {
      const user_id: number = Number(req.body.user_id);

      if (isNaN(user_id)) {
        return res.status(400).json({ errors: ["Missing or invalid user_id"] });
      }

      const bioToDelete = await DeveloperBio.findOne({ where: { user_id } });

      if (!bioToDelete) {
        return res.status(404).json({ errors: ["Bio not found"] });
      }

      await bioToDelete.remove();

      return res.status(204).json();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: ["Bio deletion failed"] });
    }
  }

  static async createBio(req: Request, res: Response) {
    try {
      const {
        user_id,
        profile_picture,
        is_hireable,
        languages_spoken,
        description,
        coding_languages,
        is_premium,
        is_staff,
        staff_rank,
        badges,
      } = req.body;
  
      if (
        user_id === undefined ||
        profile_picture === undefined ||
        is_hireable === undefined ||
        languages_spoken === undefined ||
        description === undefined ||
        coding_languages === undefined ||
        is_premium === undefined ||
        is_staff === undefined ||
        staff_rank === undefined ||
        badges === undefined
      ) {
        return res.status(400).json({ errors: ["Missing required fields"] });
      }
  
      const newBio = DeveloperBio.create({
        user_id, // Change this line
        profile_picture,
        is_hireable,
        languages_spoken,
        description,
        coding_languages,
        is_premium,
        is_staff,
        staff_rank,
        badges,
      });
  
      await newBio.save();
  
      return res.status(201).json({ message: "Bio created", bio: newBio });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: ["Bio creation failed"] });
    }
  }
}