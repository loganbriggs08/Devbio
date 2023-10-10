import express, { Request, Response } from 'express';
import { BioService } from './bio.service';
import { loggedIn } from '../../middlewares/loggedin';

const router = express.Router();

router.get('/', loggedIn, BioService.getBio); // get bio
router.post('/', loggedIn, BioService.createBio); // create bio
router.delete('/', loggedIn, BioService.deleteBio); // delete bio
router.put('/', loggedIn, BioService.updateBio); // update bio

export default router;