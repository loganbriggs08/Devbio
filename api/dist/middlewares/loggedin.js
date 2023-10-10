"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggedIn = void 0;
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    }
    else {
        res.status(401).send({ errors: ["Not Logged In"] });
    }
}
exports.loggedIn = loggedIn;
