const { getQualityScore } = require('../logic/analyseTemperatureMaps');
const Transportation = require('../models/Transportation');
const User = require('../models/User');
const random = require('random');
const { generateCertificate } = require('../logic/certificateGeneration');
const seedrandom = require('seedrandom');
random.use(new Date().toString() + '123');

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

module.exports = async (save = false, user) => {
  try {
    const LOAD_EXISTING_TRANSPORTATION = false;
    const SAVE_TO_DATABASE = save;
    if (!user) {
      user = await User.findOne({ email: 'admin@test.com' }).lean();
    }

    let transportation;

    if (LOAD_EXISTING_TRANSPORTATION) {
      transportation = await Transportation.findOne();
    } else {
      const t = {
        transporterId: user._id,
        minimalAllowedTemperature: 2,
        maximalAllowedTemperature: 6,
        temperatureMaps: generateTemperatureMaps(1, 7)
      };
      t.transportationStartTime = t.temperatureMaps[0].creationTimestamp;
      t.transportationEndTime = t.temperatureMaps[t.temperatureMaps.length - 1].creationTimestamp;
      if (SAVE_TO_DATABASE) {
        transportation = await Transportation.create(t);
      } else {
        transportation = t;
      }
    }
    
    const score = getQualityScore(transportation, SAVE_TO_DATABASE);
    if (SAVE_TO_DATABASE) {
      const certPath = await generateCertificate(transportation);
      transportation.certificatePath = certPath;
    } 
    transportation.score = score;

    if (SAVE_TO_DATABASE) {
      await transportation.save();
    }
  } catch (e) {
    console.log(e);
  }
};

