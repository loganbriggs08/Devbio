"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BioService = void 0;
const app_1 = require("../../app");
const typeorm_1 = require("typeorm");
class BioService {
    static async getBio(req, res) {
        try {
            const bio = await (0, typeorm_1.getRepository)(app_1.DeveloperBios)
                .createQueryBuilder('developerBios')
                .leftJoinAndSelect('developerBios.user', 'user')
                .where('user.id = :id', { id: req.user.id })
                .getOne();
            res.status(200).send(bio);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    static async updateBio(req, res) {
        try {
            const bio = await (0, typeorm_1.getRepository)(app_1.DeveloperBios)
                .createQueryBuilder('developerBios')
                .where('developerBios.userId = :id', { id: req.user.id })
                .getOne();
            if (bio) {
                await (0, typeorm_1.getRepository)(app_1.DeveloperBios).update(bio.id, req.body);
                res.status(200).send(bio);
            }
            else {
                const newBio = await (0, typeorm_1.getRepository)(app_1.DeveloperBios).create({
                    ...req.body,
                    userId: req.user.id,
                });
                await (0, typeorm_1.getRepository)(app_1.DeveloperBios).save(newBio); // Save the new entity
                res.status(201).send(newBio);
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    static async deleteBio(req, res) {
        try {
            const bio = await (0, typeorm_1.getRepository)(app_1.DeveloperBios)
                .createQueryBuilder('developerBios')
                .where('developerBios.userId = :id', { id: req.user.id })
                .getOne();
            if (bio) {
                await (0, typeorm_1.getRepository)(app_1.DeveloperBios).delete(bio.id); // Delete the entity
                res.status(200).send({ msg: 'Bio deleted' });
            }
            else {
                res.status(404).send({ msg: 'Bio not found' });
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    static async createBio(req, res) {
        try {
            const newBio = await (0, typeorm_1.getRepository)(app_1.DeveloperBios).create({
                ...req.body,
                userId: req.user.id,
            });
            await (0, typeorm_1.getRepository)(app_1.DeveloperBios).save(newBio); // Save the new entity
            res.status(201).send(newBio);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
}
exports.BioService = BioService;
