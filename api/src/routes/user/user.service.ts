import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { getRepository } from "typeorm";
import { User } from "../../models/User";

export class UserService {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      // Find the user by username in the database
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({ errors: ["Authentication failed"] });
      }

      // Check if the provided password matches the stored password
      if (password !== user.password) {
        return res.status(401).json({ errors: ["Authentication failed"] });
      }

      // If authentication succeeds, log in the user
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ errors: ["Login failed"] });
        }
        // Optionally, you can send back user data or a success message
        return res.status(200).json({ message: "Login successful", user });
      });
    } catch (err) {
      console.log(err)
      return res.status(500).json({ errors: ["Login failed"] });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
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

      // Find the user by username in the database
      const userRepository = getRepository(User);
      const existingUser = await userRepository.findOne({ where: { username } });

      if (existingUser) {
        return res.status(401).json({ errors: ["Username already exists"] });
      }

      // Create a new user record in the database
      const newUser = userRepository.create({
        username,
        password, // You should hash and salt the password before storing it
        email
      });

      // Save the new user to the database
      await userRepository.save(newUser);

      // Optionally, you can send back a success message or user data
      return res
        .status(200)
        .json({ message: "Registration successful", user: newUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errors: ["Registration failed"] });
    }
  }
}
