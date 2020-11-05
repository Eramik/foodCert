import User from '../models/User';

export default async (authToken) => {
  return await User.findOne({ authTokens: authToken });
}