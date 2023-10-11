// auth.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getRepository } from 'typeorm';
import { User } from './models/User';

const loginStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async function (username, password, done) {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { username } });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

export { loginStrategy };