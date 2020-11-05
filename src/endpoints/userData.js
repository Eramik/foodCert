import Transportation from '../models/Transportation';
import logger from '../utils/Logger';
import getAuthedUser from '../utils/getAuthedUser';
import locales from '../../config/locales';

export default (app) => {
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
  app.get('/getlocales', async (req, res) => {
    try {
      return res.json({ locales });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
}