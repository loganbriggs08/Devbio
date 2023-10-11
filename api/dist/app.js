"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const typeorm_1 = require("typeorm");
const typeorm_store_1 = require("typeorm-store");
const DeveloperBio_1 = require("./models/DeveloperBio");
const User_1 = require("./models/User");
const Session_1 = require("./models/Session");
const router_1 = require("./routes/router");
const uuid_1 = require("uuid");
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("./auth");
const cors = require('cors');
const app = (0, express_1.default)();
(0, typeorm_1.createConnection)({
    type: 'mysql',
    host: 'database.discordbothosting.com',
    port: 3306,
    username: 'u1582_rWFHEz4MwR',
    password: 'z088IoyY@NavFjUoxnJRfQM^',
    database: 's1582_Carbon',
    entities: [DeveloperBio_1.DeveloperBio, User_1.User, Session_1.Session],
    synchronize: true, // Set to false in production
})
    .then(async () => {
    console.log('Database connected');
    const sessionRepository = (0, typeorm_1.getRepository)(Session_1.Session);
    const typeormStore = new typeorm_store_1.TypeormStore({
        cleanupLimit: 2,
        ttl: 86400,
        connection: 'default',
        repository: sessionRepository, // Provide the repository
    });
    // Configure the session middleware
    app.use((0, express_session_1.default)({
        secret: 'kF7G3j2LpM5oP8nS1rU4xW0zT6vY9aQc',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        genid: () => {
            return generateUniqueSessionId();
        },
        store: typeormStore, // Use the TypeormStore
    }));
    app.use(cors());
    app.use(express_1.default.json());
    passport_1.default.use(auth_1.loginStrategy);
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser(async (id, done) => {
        try {
            const userRepository = (0, typeorm_1.getRepository)(User_1.User);
            const user = await userRepository.findOne({ where: { id } });
            if (user) {
                done(null, user);
            }
            else {
                done(new Error('User not found'));
            }
        }
        catch (err) {
            done(err);
        }
    });
    app.use("/api", router_1.router);
    app.use((req, res, next) => {
        console.log(req.url);
        res.status(404).send({ msg: "Not found" });
    });
    app.listen(3001, () => {
        console.log("Server started on port 3001");
    });
})
    .catch((err) => {
    console.log(err);
});
function generateUniqueSessionId() {
    return (0, uuid_1.v4)();
}
