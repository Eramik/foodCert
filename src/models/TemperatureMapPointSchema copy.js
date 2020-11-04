import { Schema  } from 'mongoose';

const TemperatureMapPointSchema = new Schema(
  {
    x: Number,
    y: Number,
    z: Number,
    temperatureValue: Number,
  }
);

export default TemperatureMapPointSchema;