const mo = require('moment-timezone');

class DateTz {
  timeZone = 'Asia/Bangkok';

   static dateNow(
    format = '',
    initailDateTime= undefined,
  ) {
    const timeZone = new DateTz().timeZone;
    const dateNow = initailDateTime || Date.now();
    return mo.tz(dateNow, timeZone).format(format);
  }
}

module.exports = {DateTz};