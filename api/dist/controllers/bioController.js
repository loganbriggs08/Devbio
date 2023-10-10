"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBio = exports.updateBio = exports.getBioByUsername = exports.getAllBios = exports.createBio = exports.bios = void 0;
exports.bios = [];
const createBio = (bioData) => {
    exports.bios.push(bioData);
};
exports.createBio = createBio;
const getAllBios = () => {
    return exports.bios;
};
exports.getAllBios = getAllBios;
const getBioByUsername = (username) => {
    return exports.bios.find((bio) => bio.username === username);
};
exports.getBioByUsername = getBioByUsername;
const updateBio = (username, updatedBio) => {
    const index = exports.bios.findIndex((bio) => bio.username === username);
    if (index !== -1) {
        exports.bios[index] = updatedBio;
    }
};
exports.updateBio = updateBio;
const deleteBio = (username) => {
    const index = exports.bios.findIndex((bio) => bio.username === username);
    if (index !== -1) {
        exports.bios.splice(index, 1);
    }
};
exports.deleteBio = deleteBio;
