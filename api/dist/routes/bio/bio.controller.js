"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bio_service_1 = require("./bio.service");
const loggedin_1 = require("../../middlewares/loggedin");
const router = express_1.default.Router();
router.get('/', loggedin_1.loggedIn, bio_service_1.BioService.getBio); // get bio
router.post('/', loggedin_1.loggedIn, bio_service_1.BioService.createBio); // create bio
router.delete('/', loggedin_1.loggedIn, bio_service_1.BioService.deleteBio); // delete bio
router.put('/', loggedin_1.loggedIn, bio_service_1.BioService.updateBio); // update bio
exports.default = router;
