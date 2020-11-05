import { Schema  } from 'mongoose';
import TemperatureMapPointSchema from './TemperatureMapPointSchema';

const TemperatureMapSchema = new Schema(
  {
    isValid: Boolean,
    points: [TemperatureMapPointSchema],
    creationTimestamp: String,
  },
);

export default TemperatureMapSchema;