"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bioController = __importStar(require("../controllers/bioController"));
const router = express_1.default.Router();
router.post('/bio', (req, res) => {
    const bioData = req.body;
    bioController.createBio(bioData);
    res.status(201).json({ message: 'Bio created successfully' });
});
router.get('/bios', (req, res) => {
    bios = bioController.getAllBios();
    res.status(200).json(bios);
});
router.get('/bio/:username', (req, res) => {
    const username = req.params.username;
    const bio = bioController.getAllBios().find((b) => b.username === username);
    if (!bio) {
        res.status(404).json({ message: 'Bio not found' });
    }
    else {
        res.status(200).json(bio);
    }
});
router.put('/bio/:username', (req, res) => {
    const username = req.params.username;
    const updatedBio = req.body;
    const index = bioController.getAllBios().findIndex((b) => b.username === username);
    if (index === -1) {
        res.status(404).json({ message: 'Bio not found' });
    }
    else {
        bioController.getAllBios()[index] = updatedBio;
        res.status(200).json({ message: 'Bio updated successfully' });
    }
});
router.delete('/bio/:username', (req, res) => {
    const username = req.params.username;
    const index = bioController.getAllBios().findIndex((b) => b.username === username);
    if (index === -1) {
        res.status(404).json({ message: 'Bio not found' });
    }
    else {
        bioController.getAllBios().splice(index, 1);
        res.status(200).json({ message: 'Bio deleted successfully' });
    }
});
exports.default = router;
