"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const bio_controller_1 = __importDefault(require("./bio/bio.controller"));
const user_controller_1 = __importDefault(require("./user/user.controller"));
exports.router = (0, express_1.Router)();
exports.router.use('/bio', bio_controller_1.default);
exports.router.use('/user', user_controller_1.default);
