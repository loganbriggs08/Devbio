import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";


declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function loggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next();
  } else {
    res.status(401).send({ errors: ["Not Logged In"] });
  }
}