import User from '../models/User';
import config from '../../config/default';
import { v4 as generateToken } from 'uuid';
import logger from '../utils/Logger';
import EmailValidator from 'email-validator';


const anyRegisterDataErrors = async (body) => {
  if (!body.email) {
    return 'Email is required.';
  }
  if (!body.password) {
    return 'Password is required.';
  }
  if (body.password.lenght < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (body.password.lenght > 64) {
    return 'Password must be shorter than 64 characters.';
  }
  if (!EmailValidator.validate(body.email)) {
    return 'Must use a valid email.';
  }
  const existsAlready = await User.exists({ email: req.body.email });
  if (existsAlready) {
    return 'The email is already in use.';
  }
}

export default (app) => {
  app.post('/register', async (req, res) => {
    try {
      // Data validation.
      const error = anyRegisterDataErrors(req.body);
      if (error) {
        return res.status(400).json({ error });
      }
      const passwordBuffer = await crypto.scrypt(body.password, config.security.salt, 32);
      const password = passwordBuffer.toString('hex');
      const authToken = generateToken();
      const user = await User.create({ ...req.body, password, authTokens: [authToken] });
      return res.json({ user, authToken });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.post('/login', async (req, res) => {
    try {
      if (!(req.body.email && req.body.password && EmailValidator.validate(req.body.email) && req.body.password.lenght <= 64)) {
        return req.status(400).json({ error: 'Missing valid email or password.' });
      }
      const passwordBuffer = await crypto.scrypt(body.password.toString(), config.security.salt, 32);
      const password = passwordBuffer.toString('hex');
      const user = await User.findOne({ email: req.body.email.toString(), password });
      const authToken = generateToken();
      user.authTokens.push(authToekn);
      await user.save();
      return res.json({ user, authToken });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });
}