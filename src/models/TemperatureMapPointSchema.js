const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemperatureMapPointSchema = new Schema(
  {
    x: Number,
    y: Number,
    z: Number,
    temperatureValue: Number,
  }
);

module.exports = TemperatureMapPointSchema;