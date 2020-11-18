const Transportation = require('../models/Transportation');
const logger = require('../utils/Logger');
const getAuthedSmartDeviceOwner = require('../utils/getAuthedSmartDeviceOwner');
const { getQualityScore } = require('../logic/analyseTemperatureMaps');
const { generateCertificate } = require('../logic/certificateGeneration');

module.exports = (app) => {
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

      if (req.body.initTransport) {
        transportation.transportationStartTime = new Date().toUTCString();
      }
      if (req.body.endTransport) {
        transportation.transportationEndTime = new Date().toUTCString();
        const score = getQualityScore(transportation);
        if (score > 0) {
          const path = await generateCertificate(transportation);
          transportation.certificatePath = path;
        }
      }

      await transportation.save();
      
      return res.json({ success: true });
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ error: e });
    }
  });
}