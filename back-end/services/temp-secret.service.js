// authenticationService.js
const db = require("../commons/typeorm");
const { uuid } = require('uuidv4');
const { DateTz } = require("../helpers/date-tz.helper");
const LOGGER = require('../middleware/logger');
class TempSecretService {
    async createTempRegisterLine(body) {
        try {
          //-- create new temp secret
          const uuidTemp = uuid();
          const attribs = db.connection.getRepository("SysTempSecret").create({
            tempUuid: uuidTemp,
            tempType: body.action,
            tempLog: body,
            tempTimestamp: DateTz.dateNow(),
          });
    
          return await db.connection.getRepository("SysTempSecret").save(attribs);
        } catch (error) {
          LOGGER.error(error);
          throw new Error(error?.message);
        }
      }
    
      async createTempRegisterWeb(body, type) {
        try {
          //-- create new temp secret
          const uuidTemp = uuid();
          const attribs = db.connection.getRepository("SysTempSecret").create({
            tempUuid: uuidTemp,
            tempType: body.action,
            tempLog: { ...body, platform: type },
            tempTimestamp: DateTz.dateNow(),
          });
    
          return await db.connection.getRepository("SysTempSecret").save(attribs);
        } catch (error) {
          LOGGER.error(error);
          throw new Error(error?.message);
        }
      }
    
      async findTempById(tempId) {
        try {
          return await db.connection.getRepository("SysTempSecret").findOneBy({ tempId: tempId });
        } catch (error) {
          LOGGER.error(error);
          throw new Error(error?.message);
        }
      }
    
      async findTempByUUID(uuid) {
        try {
          return await db.connection.getRepository("SysTempSecret").findOneBy({ tempUuid: uuid });
        } catch (error) {
          LOGGER.error(error);
          throw new Error(error?.message);
        }
      }
    
      async deleteTempById(tempId) {
        try {
          return await db.connection.getRepository("SysTempSecret").delete({ tempId: tempId });
        } catch (error) {
          LOGGER.error(error);
          throw new Error(error?.message);
        }
      }
    
      async deleteTempExpire() {
        try {
          return await db.connection.getRepository("SysTempSecret")
            .createQueryBuilder()
            .delete()
            .where(
              `temp_timestamp::date <= (:dateNowTz::date - '2 day'::interval)::date`,
              {
                dateNowTz: DateTz.dateNow('YYYY-MM-DD'),
              },
            )
            .execute();
        } catch (error) {
          LOGGER.error(error);
          throw new Error(error?.message);
        }
      }
}

module.exports = { TempSecretService: new TempSecretService() };
