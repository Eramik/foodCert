const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    smartDeviceTokens: [String],
    authTokens: [String],
    firstName: String,
    lastName: String,
    isAdmin: Boolean,
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ email: 1, password: 1, smartDeviceTokens: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = User;