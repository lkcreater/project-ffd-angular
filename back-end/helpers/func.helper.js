const { ELoginPlatform } = require('../services/authen.service');
const env = require('../configuration');
class FuncHelper {
  static checkTypeInput(input) {
    let platform;
    let isValid;
    let message;

    if (input.match(/^\d{10}$/)) {
      isValid = true;
      message = 'platform phone number';
      platform = ELoginPlatform.PHONE;
    } else if (input.match(/^\S+@\S+\.\S+$/)) {
      platform = ELoginPlatform.EMAIL;
      message = 'platform email address';
      isValid = true;
    } else {
      platform = ELoginPlatform.NONE;
      message = 'Invalid format';
    }

    return {
      isValid,
      platform,
      message,
    };
  }
  static obsBaseUrl(){
    const endPoint =  env.OBS_ENDPOINT;
    const bucketName =  env.OBS_BUCKET_NAME
    if (endPoint.startsWith('https://')) {
     return endPoint.replace('https://',`https://${bucketName}.`)
    }
   return `https://${bucketName}.${endPoint}`
  }
}

module.exports = { FuncHelper };

