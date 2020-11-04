import mongoose, { Schema  } from 'mongoose';
const ObjectIdSchema = Schema.Types.ObjectId;

const UserSchema = new Schema(
  {
    email: String,
    password: String,
    companyTitle: String,
    accountType: {
      type: String,
      enum: ['provider', 'transporter', 'client']
    },
    representativeName: String,
    contactPhone: String,
    smartDeviceToken: String,
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ email: 1, smartDeviceToken: 1, companyTitle: 1 });

const User = mongoose.model('User', UserSchema);

export default User;