import { Router } from 'express';
import { UserService } from './user.service';
import { loggedIn } from "../../middlewares/loggedin";

const router = Router();

router.post('/login', UserService.login);
router.post('/register', UserService.register);
router.post('/logout', loggedIn, UserService.logout);

export default router;