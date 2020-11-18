const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TemperatureMapSchema = require('./TemperatureMapSchema');
const ObjectIdSchema = Schema.Types.ObjectId;

const TransportationSchema = new Schema(
  {
    clientId: { type: ObjectIdSchema, ref: 'User' },
    transporterId: { type: ObjectIdSchema, ref: 'User', required: true },
    providerId: { type: ObjectIdSchema, ref: 'User' },
    transportationStartTime: String,
    transportationEndTime: String,
    minimalAllowedTemperature: Number,
    maximalAllowedTemperature: Number,
    certificatePath: String,
    temperatureMaps: [TemperatureMapSchema],
    score: Number,
    evaluationAlgorithmVersion: Number,
  },
  {
    timestamps: true,
  },
);

TransportationSchema.index({ providerId: 1, transporterId: 1, clientId: 1 });

const Transportation = mongoose.model('Transportation', TransportationSchema);

module.exports = Transportation;