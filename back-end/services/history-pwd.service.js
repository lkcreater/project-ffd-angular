// authenticationService.js
const db = require("../commons/typeorm");
const { DateTz } = require("../helpers/date-tz.helper");
const LOGGER = require('../middleware/logger');
const env = require('../configuration');

class HistoryPwdService {

  async saveHistoryPwd(uuid, body = { hash, username }) {
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

  //-----------------------------------------------------------
  //-- save history OTP
  //-----------------------------------------------------------

  async saveActivityAuthenPWD(attribsHistory) {
    try {
      const timeDuration = env.FFD_PWD_LOCK_DURATION_MINUTES;

      await db.connection.getRepository('CmsHistoryActivityPwd')
        .createQueryBuilder()
        .insert()
        .values({
          ...attribsHistory,
          pwdAtTime: () => `NOW() + interval '${timeDuration} minutes'`
        })
        .execute();

      // //-- update history old
      await db.connection.getRepository('CmsHistoryActivityPwd')
        .createQueryBuilder()
        .update()
        .set({
          pwdAtTime: () => `NOW() + interval '${timeDuration} minutes'`
        })
        .where('active = true AND pwd_at_input = :pwdAtInput',
          {
            pwdAtInput: attribsHistory.pwdAtInput,
          })
        .execute();

    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async clearActivityAuthenPWD() {
    try {
      return await db.connection.getRepository('CmsHistoryActivityPwd')
        .createQueryBuilder()
        .delete() //.update().set({ active: false })
        .where(`NOW() > pwd_at_time and active = true`)
        .execute()
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async clearActivityAuthenPwdByHash(hash) {
    try {
      return await db.connection.getRepository('CmsHistoryActivityPwd')
        .createQueryBuilder()
        .delete() 
        .where(`pwd_at_hash = :hash`, {
          hash
        })
        .execute()
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async FindActivityAuthenPWD(attribsHistory) {
    try {
      const pwdAtInput = attribsHistory.pwdAtInput;

      const pwdHistoryRepository = db.connection.getRepository('CmsHistoryActivityPwd').createQueryBuilder('pwdHis');
      pwdHistoryRepository.where('pwdHis.active = true AND pwdHis.pwdAtInput = :pwdAtInput ',
        {
          pwdAtInput
        });
      pwdHistoryRepository.orderBy('pwdHis.pwdAtId', 'DESC');
      return await pwdHistoryRepository.getRawMany();

    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

}

module.exports = { HistoryPwdService: new HistoryPwdService() };
