const env = require('../configuration');
const jwt = require('jsonwebtoken');

class JwtHelper {
  static getToken(uuid, option = {}) {
    const paylaod = {
      uuid: uuid,
      ...option,
    };
    return jwt.sign(paylaod, env.JWT_SECRET);
  }

  static verifyToken(token) {
    try {
      const verify = jwt.verify(token, env.JWT_SECRET);
      return {
        status: true,
        verify,
      };
    } catch (error) {
      return {
        status: false,
        verify: null,
        message: error?.message,
      };
    }
  }
}

module.exports = { JwtHelper };
