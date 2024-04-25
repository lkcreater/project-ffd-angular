// authenticationService.js
const db = require("../commons/typeorm");
const { DateTz } = require("../helpers/date-tz.helper");
const LOGGER = require('../middleware/logger');
class HistoryPwdService {
    async getHistoryTopTenByUuid(uuid) {
        try {
          return await db.connection.getRepository('CmsHistoryPwd')
            .createQueryBuilder()
            .where('uuid_account = :uuid and active = :isActive', {
              uuid: uuid,
              isActive: true,
            })
            .take(10)
            .orderBy('pwd_id', 'DESC')
            .getMany();
        } catch (error) {
          LOGGER.error(error);
          throw new Error(error?.message);
        }
      }
    
      async saveHistoryPwd(uuid, body = { hash , username }) {
        try {
          const attribs = db.connection.getRepository('CmsHistoryPwd').create({
            uuidAccount: uuid,
            pwdHash: body.hash,
            pwdDate: DateTz.dateNow('YYYY-MM-DD'),
            createdBy: body.username,
            updatedBy: body.username,
          });
          return await db.connection.getRepository('CmsHistoryPwd').save(attribs);
        } catch (error) {
          LOGGER.error(error);
          throw new Error(error?.message);
        }
      }
}

module.exports = { HistoryPwdService: new HistoryPwdService() };
