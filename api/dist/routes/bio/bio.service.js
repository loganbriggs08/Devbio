"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BioService = void 0;
const DeveloperBio_1 = require("../../models/DeveloperBio");
const typeorm_1 = require("typeorm");
class BioService {
    static async getBio(req, res) {
        try {
            const bio = await (0, typeorm_1.getRepository)(DeveloperBio_1.DeveloperBio)
                .createQueryBuilder("developerBio")
                .leftJoinAndSelect("developerBio.user", "user")
                .where("user.id = :id", { id: req.user.id })
                .getOne();
            if (bio) {
                res.status(200).send(bio);
            }
            else {
                res.status(404).send({ msg: "Bio not found" });
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }
    static async updateBio(req, res) {
        try {
            const bio = await (0, typeorm_1.getRepository)(DeveloperBios)
                .createQueryBuilder("developerBios")
                .where("developerBios.userId = :id", { id: req.user.id })
                .getOne();
            if (bio) {
                await (0, typeorm_1.getRepository)(DeveloperBios).update(bio.id, req.body);
                res.status(200).send(bio);
            }
            else {
                const newBio = await (0, typeorm_1.getRepository)(DeveloperBios).create({
                    ...req.body,
                    userId: req.user.id,
                });
                await (0, typeorm_1.getRepository)(DeveloperBios).save(newBio); // Save the new entity
                res.status(201).send(newBio);
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    static async deleteBio(req, res) {
        try {
            const bio = await (0, typeorm_1.getRepository)(DeveloperBios)
                .createQueryBuilder("developerBios")
                .where("developerBios.userId = :id", { id: req.user.id })
                .getOne();
            if (bio) {
                await (0, typeorm_1.getRepository)(DeveloperBios).delete(bio.id); // Delete the entity
                res.status(200).send({ msg: "Bio deleted" });
            }
            else {
                res.status(404).send({ msg: "Bio not found" });
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    static async createBio(req, res) {
        try {
            // Extract fields from the request body
            const { user_id, profile_picture, is_hireable, languages_spoken, description, coding_languages, is_premium, is_staff, staff_rank, badges, } = req.body;
            // Check if any required fields are missing
            if (user_id === undefined ||
                profile_picture === undefined ||
                is_hireable === undefined ||
                languages_spoken === undefined ||
                description === undefined ||
                coding_languages === undefined ||
                is_premium === undefined ||
                is_staff === undefined ||
                staff_rank === undefined ||
                badges === undefined) {
                return res.status(400).json({ errors: ["Missing required fields"] });
            }
            // Create a new DeveloperBio entity
            const newBio = DeveloperBio_1.DeveloperBio.create({
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
            });
            // Save the new DeveloperBio entity to the database
            await newBio.save();
            // Optionally, you can send back a success message or the created entity
            return res.status(201).json({ message: "Bio created", bio: newBio });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ errors: ["Bio creation failed"] });
        }
    }
}
exports.BioService = BioService;
