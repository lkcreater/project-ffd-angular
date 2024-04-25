const { randomBytes } = require('crypto');
const bcrypt = require('bcryptjs');

class SecretHelper {
  static getKey() {
    return randomBytes(16).toString('base64');
  }

  static getText(hash) {
    const keyB = SecretHelper.getPrivateKey();
    return `${hash}${keyB}`;
  }

  static getPrivateKey() {
    return '@true';
  }

  static bcryptHash(key) {
    return bcrypt.hashSync(key, 10);
  }

  static getGuestName() {
    const code = SecretHelper.getKey();
    return `GUEST-${code.slice(0, 6).toLocaleUpperCase()}`;
  }
}

module.exports = {SecretHelper};
