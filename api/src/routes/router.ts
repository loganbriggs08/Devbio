import { Router } from "express";
import bioRoutes from './bio/bio.controller';
import userRoutes from './user/user.controller';

export const router = Router();
router.use('/bio', bioRoutes);
router.use('/user', userRoutes);
