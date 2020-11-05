import User from '../models/User';

export default async (smartDviceToken) => {
  return await User.findOne({ smartDviceTokens: smartDviceToken });
}