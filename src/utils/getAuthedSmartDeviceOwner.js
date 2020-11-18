const User = require('../models/User');

module.exports = async (smartDviceToken) => {
  return await User.findOne({ smartDviceTokens: smartDviceToken });
}