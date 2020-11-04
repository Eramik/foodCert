import { Schema  } from 'mongoose';
import TemperatureMapPointSchema from './TemperatureMapPointSchema copy';

const TemperatureMapSchema = new Schema(
  {
    isValid: Boolean,
    points: [TemperatureMapPointSchema]
  },
  {
    timestamps: true,
  },
);

export default TemperatureMapSchema;