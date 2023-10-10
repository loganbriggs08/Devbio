import { Request, Response, NextFunction } from "express";

export function loggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next();
  } else {
    res.status(401).send({ errors: ["Not Logged In"] });
  }
}
