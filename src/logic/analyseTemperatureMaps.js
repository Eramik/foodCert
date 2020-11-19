
const getDistance = (x1, y1, z1, x2, y2, z2) => {
  const a = x2 - x1;
  const b = y2 - y1;
  const c = z2 - z1;

  return Math.sqrt(a * a + b * b + c * c);
}

module.exports.getQualityScore = function (transportation, IS_DB_DOCUMENT = true) {
  const INITIAL_SCORE = 1000 * 20;
  if (IS_DB_DOCUMENT) {
    transportation = transportation.toObject()
  } else {
    transportation.temperatureMaps.forEach(map => {
      map.points.forEach((p, i) => {
        p._id = i + new Date().toString()
      })
    })
  }
  const maps = transportation.temperatureMaps.sort((m1, m2) => m1.creationTimestamp > m2.creationTimestamp ? 1 : -1);
  maps.forEach(temperatureMap => {
    temperatureMap.creationTimestamp = new Date(temperatureMap.creationTimestamp);
    temperatureMap.points.forEach(p1 => {
      p1.safe = p1.temperatureValue >= transportation.minimalAllowedTemperature && p1.temperatureValue <= transportation.maximalAllowedTemperature;
    });
    temperatureMap.points.forEach(p1 => {
      p1.closestPointDistance = Number.MAX_VALUE;
      p1.closestPointSafe = false;
      for (let i = 0; i < temperatureMap.points.length - 1; i++) {
        const p2 = temperatureMap.points[i];
        if (p1._id.toString() === p2._id.toString()) {
          continue;
        }
        const distance = getDistance(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        if (distance < p1.closestPointDistance) {
          p1.closestPointDistance = distance;
          p1.closestPointSafe = p2.safe;
        }
      }
    });
  });
  var score = INITIAL_SCORE;
  for (let i = 0; i < maps.length - 1; i++) {
    const map1 = maps[i];
    const map2 = maps[i + 1]
    const stepValue = map2.creationTimestamp.getTime() - map1.creationTimestamp.getTime();
    const dangerPoints1 = map1.points.filter(point => !point.safe);
    if (dangerPoints1.length === 0) {
      continue;
    }
    const dangerPoints2 = map2.points.filter(point => !point.safe);
    dangerPoints1.forEach(p1 => {
      const dangerRetainedCoefficient = dangerPoints2.some(p2 => p2.x === p1.x && p2.y === p1.y && p2.z === p1.z) ? 2 : 1;
      const approximateDangerAreaCoefficient = p1.closestPointSafe ? 0.25 : 0.5;
      const approximateDangerArea = approximateDangerAreaCoefficient * (Math.PI * p1.closestPointDistance * p1.closestPointDistance);
      const scoreLoss = stepValue * dangerRetainedCoefficient * approximateDangerArea;
      score -= scoreLoss;
    });
  }
  return score;
}