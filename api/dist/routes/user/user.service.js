"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../../models/User");
class UserService {
    static async login(req, res, next) {
        try {
            const { username, password } = req.body;
            // Find the user by username in the database
            const userRepository = (0, typeorm_1.getRepository)(User_1.User);
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
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ errors: ["Login failed"] });
        }
    }
    static async logout(req, res) {
        try {
            req.logout((err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ errors: ["Logout failed"] });
                }
                return res.status(200).json({ message: "Logout successful" });
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ errors: ["Logout failed"] });
        }
    }
    static async register(req, res) {
        try {
            const { username, password, email } = req.body;
            // Find the user by username in the database
            const userRepository = (0, typeorm_1.getRepository)(User_1.User);
            const existingUser = await userRepository.findOne({ where: { username } });
            if (existingUser) {
                return res.status(401).json({ errors: ["Username already exists"] });
            }
            // Create a new user record in the database
            const newUser = userRepository.create({
                username,
                password,
                email
            });
            // Save the new user to the database
            await userRepository.save(newUser);
            // Optionally, you can send back a success message or user data
            return res
                .status(200)
                .json({ message: "Registration successful", user: newUser });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ errors: ["Registration failed"] });
        }
    }
}
exports.UserService = UserService;
