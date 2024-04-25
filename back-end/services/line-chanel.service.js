// authenticationService.js
const db = require("../commons/typeorm");
const LOGGER = require('../middleware/logger');
class LineChanelService {
  async getAll() {
    try {
      return await db.connection.getRepository("SysChanelLine").find({
        where: {
            active: true,
        },
        order: {
            chanelId: "DESC"
        }
      });
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async getAdapterLine(lineClientId) {
    try {
      return await db.connection.getRepository("SysChanelLine").findOne({
        where: {
            lineClientId: lineClientId,
            active: true,
        }
      });
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }
}

module.exports = { LineChanelService: new LineChanelService() };
