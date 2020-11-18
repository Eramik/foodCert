const User = require('../models/User');

module.exports = async (authToken) => {
  return await User.findOne({ authTokens: authToken });
}