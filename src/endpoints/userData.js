const Transportation = require('../models/Transportation');
const logger = require('../utils/Logger');
const getAuthedUser = require('../utils/getAuthedUser');
const locales = require('../../config/locales');
const dataSampler = require('../utils/dataSampler');
const User = require('../models/User');

module.exports = (app) => {
  app.get('/getMyTransportations', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }
      
      const myTrasportations = await Transportation.find({ $or: [{ providerId: user._id }, { clientId: user._id }, { transporterId: user._id }] }).lean();
      return res.json({ transportations: myTrasportations });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.get('/getAllTransportations', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }
      if (!user.isAdmin) {
        return res.status(403).json({ error: 'Need to be admin.' });
      }
      
      const allTrasportations = await Transportation.find().populate('transporterId').lean();
      return res.json({ transportations: allTrasportations });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.get('/getAllUsers', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }
      if (!user.isAdmin) {
        return res.status(403).json({ error: 'Need to be admin.' });
      }
      
      const allUsers = await User.find().lean();
      return res.json({ users: allUsers });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.get('/toggleAdmin', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }
      if (!user.isAdmin) {
        return res.status(403).json({ error: 'Need to be admin.' });
      }
      
      await User.updateOne({ _id: req.query.userId }, { isAdmin: req.query.isAdmin === "true" ? true : false });

      const allUsers = await User.find().lean();
      return res.json({ users: allUsers });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.get('/deleteUser/:userId', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }
      if (!user.isAdmin) {
        return res.status(403).json({ error: 'Need to be admin.' });
      }
      
      await Transportation.deleteMany({ transporterId: req.params.userId });
      await User.deleteOne({ _id: req.params.userId });

      const allUsers = await User.find().lean();
      return res.json({ users: allUsers });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.get('/deleteTransport/:transportId', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }
      if (!user.isAdmin) {
        return res.status(403).json({ error: 'Need to be admin.' });
      }
      
      await Transportation.deleteOne({ _id: req.params.transportId });

      const allTrasportations = await Transportation.find().populate('transporterId').lean();
      return res.json({ transportations: allTrasportations });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.get('/getlocales', async (req, res) => {
    try {
      return res.json({ locales });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
  app.get('/generateSample', async (req, res) => {
    try {
      const user = await getAuthedUser(req.query.authToken);
      if (!user) {
        return res.status(403).json({ error: 'Need to be logged in.' });
      }

      await dataSampler(true, user);

      const myTrasportations = await Transportation.find({ $or: [{ providerId: user._id }, { clientId: user._id }, { transporterId: user._id }] }).lean();
      return res.json({ transportations: myTrasportations });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  });
}