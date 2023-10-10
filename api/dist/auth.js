"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginStrategy = void 0;
const passport_local_1 = require("passport-local");
const typeorm_1 = require("typeorm");
const User_1 = require("./models/User");
const loginStrategy = new passport_local_1.Strategy({
    usernameField: 'username',
    passwordField: 'password',
}, async function (username, password, done) {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = await userRepository.findOne({ where: { username } });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
});
exports.loginStrategy = loginStrategy;
// https://typeorm.io/faq#how-can-i-set-the-default-value-to-some-function-for-example-now
