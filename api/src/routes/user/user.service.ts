import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { getRepository } from "typeorm";
import { User } from "../../models/User";

export class UserService {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({ errors: ["Authentication failed"] });
      }

      if (password !== user.password) {
        return res.status(401).json({ errors: ["Authentication failed"] });
      }

      // @ts-ignore
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ errors: ["Login failed"] });
        }
        return res.status(200).json({ message: "Login successful", user });
      });
    } catch (err) {
      console.log(err)
      return res.status(500).json({ errors: ["Login failed"] });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      // @ts-ignore
      req.logout((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ errors: ["Logout failed"] });
        }
        return res.status(200).json({ message: "Logout successful" });
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: ["Logout failed"] });
    }
  }
  static async register(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;

      const userRepository = getRepository(User);
      const existingUser = await userRepository.findOne({ where: { username } });

      if (existingUser) {
        return res.status(401).json({ errors: ["Username already exists"] });
      }

      const newUser = userRepository.create({
        username,
        password,
        email
      });

      await userRepository.save(newUser);

      return res
        .status(200)
        .json({ message: "Registration successful", user: newUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errors: ["Registration failed"] });
    }
  }
}
