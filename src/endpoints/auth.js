const User = require('../models/User');
const config = require('../../config/default');
const { v4: generateToken } = require('uuid');
const logger = require('../utils/Logger');
const EmailValidator = require('email-validator');
const crypto = require('crypto');

const anyRegisterDataErrors = async (body) => {
  try {
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
    const existsAlready = await User.exists({ email: body.email });
    if (existsAlready) {
      return 'The email is already in use.';
    }
  } catch (e) {
    console.log(e);
  }
}

const encryptPassword = (password, salt, length) => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, length, (err, passwordBuffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(passwordBuffer);
      }
    });
  });
}

module.exports = (app) => {
  app.post('/register', async (req, res) => {
    try {
      // Data validation.
      const error = await anyRegisterDataErrors(req.body);
      if (error) {
        return res.status(400).json({ error: error });
      }
      const passwordBuffer = await encryptPassword(req.body.password, config.security.salt, 32);
      const password = passwordBuffer.toString('hex');
      const authToken = generateToken();
      const user = await User.create({ ...req.body, password, authTokens: [authToken] });
      return res.json({ user, authToken });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  });
  app.post('/login', async (req, res) => {
    try {
      if (!(req.body.email && req.body.password && EmailValidator.validate(req.body.email) && req.body.password.length <= 64)) {
        return res.status(400).json({ error: 'Missing valid email or password.' });
      }
      const passwordBuffer = await encryptPassword(req.body.password.toString(), config.security.salt, 32);
      const password = passwordBuffer.toString('hex');
      const user = await User.findOne({ email: req.body.email.toString(), password });
      const authToken = generateToken();
      user.authTokens.push(authToken);
      await user.save();
      return res.json({ user, authToken });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  });
}