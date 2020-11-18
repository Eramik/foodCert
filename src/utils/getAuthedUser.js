const User = require('../models/User');

module.export = async (authToken) => {
  return await User.findOne({ authTokens: authToken });
}