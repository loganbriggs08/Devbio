"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bio = void 0;
class Bio {
    constructor(username, profilePicture, isHireable, languagesSpoken, description, codingLanguages, isPremium, isStaff, staffRank, badges) {
        this.username = username;
        this.profilePicture = profilePicture;
        this.isHireable = isHireable;
        this.languagesSpoken = languagesSpoken;
        this.description = description;
        this.codingLanguages = codingLanguages;
        this.isPremium = isPremium;
        this.isStaff = isStaff;
        this.staffRank = staffRank;
        this.badges = badges;
    }
}
exports.Bio = Bio;
