import mongoose, { Schema  } from 'mongoose';
import TemperatureMapSchema from './TemperatureMapSchema';
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
  },
  {
    timestamps: true,
  },
);

TransportationSchema.index({ providerId: 1, transporterId: 1, clientId: 1 });

const Transportation = mongoose.model('Transportation', TransportationSchema);

export default Transportation;