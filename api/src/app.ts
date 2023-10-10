import express from "express";
import session from "express-session";
import { createConnection, getRepository } from "typeorm";
import { TypeormStore } from "typeorm-store";
import { DeveloperBio } from "./models/DeveloperBio";
import { User } from "./models/User";
import { Session } from "./models/Session";
import { router } from "./routes/router";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import { loginStrategy } from "./auth";
const cors = require('cors');

const app = express();

createConnection({
  type: 'mysql',
  host: 'database.discordbothosting.com',
  port: 3306,
  username: 'u1582_rWFHEz4MwR',
  password: 'z088IoyY@NavFjUoxnJRfQM^',
  database: 's1582_Carbon',
  entities: [DeveloperBio, User, Session], // Add your entities here
  synchronize: true, // Set to false in production
})
  .then(async () => {
    console.log('Database connected');

    // Get the repository for the Session entity
    const sessionRepository = getRepository(Session);

    // Create the TypeormStore and pass the repository
    const typeormStore = new TypeormStore({
      cleanupLimit: 2,
      ttl: 86400,
      connection: 'default', // Use the default connection
      repository: sessionRepository, // Provide the repository
    });

    // Configure the session middleware
    app.use(
      session({
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
      })
    );

    app.use(cors());
    app.use(express.json());

    passport.use(loginStrategy);

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user: User, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser(async (id: number, done) => {
      try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id } });
    
        if (user) {
          done(null, user);
        } else {
          done(new Error('User not found'));
        }
      } catch (err) {
        done(err);
      }
    });


    app.use("/api", router);
    
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

  function generateUniqueSessionId(): string {
    return uuidv4();
  }

