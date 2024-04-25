// authenticationService.js
const db = require("../commons/typeorm");

const LOGGER = require('../middleware/logger');
class TermAndConditionService {
    async getTermAndCondition() {
        try {
            return await db.connection.getRepository("SysTermAndCondition").findOne({
                where: {
                  active: true,
                },
                order: { condiId: 'DESC' },
              });
        } catch (error) {
          LOGGER.error(error);
            throw new Error(error?.message);
        }
      }
}

module.exports = { TermAndConditionService: new TermAndConditionService() };
