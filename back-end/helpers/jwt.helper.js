const env = require('../configuration');
const jwt = require('jsonwebtoken');

class JwtHelper {
  static getToken(uuid, option = {}) {
    const paylaod = {
      uuid: uuid,
      ...option,
    };
    return jwt.sign(paylaod, env.FFD_UUID_V1,{ expiresIn: '1d' });
  }

  static verifyToken(token) {
    try {
      const verify = jwt.verify(token, env.FFD_UUID_V1);
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
