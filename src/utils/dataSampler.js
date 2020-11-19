const { getQualityScore } = require('../logic/analyseTemperatureMaps');
const Transportation = require('../models/Transportation');
const User = require('../models/User');
const random = require('random');
const { generateCertificate } = require('../logic/certificateGeneration');

const generatePoints = (min, max) => {
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push({
      x: i,
      y: 1,
      z: 1,
      temperatureValue: random.float(min, max)
    });
  }
  return points;
}

const generateTemperatureMaps = (min, max) => {
  const creationStart = new Date();
  const maps = [];
  for (let i = 0; i < 5; i++) {
    maps.push({
      creationTimestamp: new Date(creationStart - 1000 * i).toUTCString(),
      points: generatePoints(min, max)
    });
  }
  return maps.sort((m1, m2) => new Date(m1.creationTimestamp) > new Date(m2.creationTimestamp) ? 1 : -1);;
}

module.exports = async () => {
  try {
    const LOAD_EXISTING_TRANSPORTATION = false;

    const admin = await User.findOne({ email: 'admin@test.com' });

    let transportation;

    if (LOAD_EXISTING_TRANSPORTATION) {
      transportation = await Transportation.findOne();
    } else {
      const t = {
        transporterId: admin._id,
        minimalAllowedTemperature: 2,
        maximalAllowedTemperature: 6,
        temperatureMaps: generateTemperatureMaps(1, 7)
      };
      t.transportationStartTime = t.temperatureMaps[0].creationTimestamp;
      t.transportationEndTime = t.temperatureMaps[t.temperatureMaps.length - 1].creationTimestamp;
      transportation = await Transportation.create(t);
    }
    
    console.log('For transportation ' + transportation._id.toString());
    const score = getQualityScore(transportation);
    console.log('Score: ', score);
    const certPath = await generateCertificate(transportation);
    transportation.certificatePath = certPath;
    console.log('Certificate: ', certPath);
    transportation.score = score;
    await transportation.save();
  } catch (e) {
    console.log(e);
  }
};

