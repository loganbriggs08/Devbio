import { db, DeveloperBios, User } from '../../app';
import { Request, Response } from 'express';
import { DataSource, getRepository } from 'typeorm';

export class BioService {
    static async getBio(req: Request, res: Response) {
      try {
        const bio = await getRepository(DeveloperBios)
          .createQueryBuilder('developerBios')
          .leftJoinAndSelect('developerBios.user', 'user')
          .where('user.id = :id', { id: req.user.id })
          .getOne();
  
        res.status(200).send(bio);
      } catch (err) {
        res.status(500).send(err);
      }
    }
  
    static async updateBio(req: Request, res: Response) {
      try {
        const bio = await getRepository(DeveloperBios)
          .createQueryBuilder('developerBios')
          .where('developerBios.userId = :id', { id: req.user.id })
          .getOne();
  
        if (bio) {
          await getRepository(DeveloperBios).update(bio.id, req.body);
          res.status(200).send(bio);
        } else {
          const newBio = await getRepository(DeveloperBios).create({
            ...req.body,
            userId: req.user.id,
          });
          await getRepository(DeveloperBios).save(newBio); // Save the new entity
          res.status(201).send(newBio);
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  
    static async deleteBio(req: Request, res: Response) {
      try {
        const bio = await getRepository(DeveloperBios)
          .createQueryBuilder('developerBios')
          .where('developerBios.userId = :id', { id: req.user.id })
          .getOne();
  
        if (bio) {
          await getRepository(DeveloperBios).delete(bio.id); // Delete the entity
          res.status(200).send({ msg: 'Bio deleted' });
        } else {
          res.status(404).send({ msg: 'Bio not found' });
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  
    static async createBio(req: Request, res: Response) {
      try {
        const newBio = await getRepository(DeveloperBios).create({
          ...req.body,
          userId: req.user.id,
        });
        await getRepository(DeveloperBios).save(newBio); // Save the new entity
        res.status(201).send(newBio);
      } catch (err) {
        res.status(500).send(err);
      }
    }
  }