const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TemperatureMapPointSchema = require('./TemperatureMapPointSchema');

const TemperatureMapSchema = new Schema(
  {
    isValid: Boolean,
    points: [TemperatureMapPointSchema],
    creationTimestamp: String,
  },
);

module.exports = TemperatureMapSchema;