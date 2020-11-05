import Transportation from '../models/Transportation';
import logger from '../utils/Logger';
import getAuthedSmartDeviceOwner from '../utils/getAuthedSmartDeviceOwner';

export default (app) => {
  app.post('/temperatureMap/:transportationId', async (req, res) => {
    try {
      const user = await getAuthedSmartDeviceOwner(req.body.smartDeviceToken);
      if (!user) {
        return res.status(403).json({ error: 'Invalid token.' });
      }

      const transportation = await Transportation.findById(req.params.transportationId);
      if (!transportation) {
        return res.status(404).json({ error: 'Transportation not found.' });
      }

      if (!transportation.temperatureMap) {
        transportation.temperatureMap = [];
      }
      transportation.temperatureMaps.push(req.body.temperatureMap);
      await transportation.save();
      
      return res.json({ success: true });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
}