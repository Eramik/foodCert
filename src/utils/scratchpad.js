const { getQualityScore } = require('../logic/analyseTemperatureMaps');
const Transportation = require('../models/Transportation');
const User = require('../models/User');

const getRandomValue = (min, max) => {
  if (min > max) {
    max = min;
  }
  return min + (Math.random() * 100 % (max - min));
}

const generatePoints = (min, max) => {
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push({
      x: i,
      y: 1,
      z: 1,
      temperatureValue: getRandomValue(min, max)
    });
  }
  return points;
}

const generateTemperatureMaps = (min, max) => {
  const creationStart = new Date();
  const maps = [];
  for (let i = 0; i < 5; i++) {
    maps.push({
      creationTimestamp: new Date(creationStart - 1000 * i),
      points: generatePoints(min, max)
    });
  }
  return maps;
}

module.exports = async () => {
  try {
    const LOAD_EXISTING_TRANSPORTATION = false;

    const admin = await User.findOne({ email: 'admin@test.com' });

    let transportation;

    if (LOAD_EXISTING_TRANSPORTATION) {
      transportation = await Transportation.findOne();
    } else {
      transportation = await Transportation.create({
        transporterId: admin._id,
        minimalAllowedTemperature: 2,
        maximalAllowedTemperature: 6,
        temperatureMaps: generateTemperatureMaps(1, 7)
      });
    }
    
    console.log('For transportation ' + transportation._id.toString());
    const score = getQualityScore(transportation);
    console.log('Score: ', score);
    transportation.score = score;
    await transportation.save();
  } catch (e) {
    console.log(e);
  }
};

