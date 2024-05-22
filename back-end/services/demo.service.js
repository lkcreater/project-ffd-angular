const db = require("../commons/typeorm");
const LOGGER = require('../middleware/logger');

class DemoService {
  async findAccountByUserName(userName) {
    try {
      return await db.connection
      .getRepository("CmsAccount")
      .createQueryBuilder("account")
      .where("LOWER(account.accFirstname) = LOWER(:userName)", { userName: userName })
      .andWhere("account.active = :isActive", { isActive: true })
      .getOne();
      
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }
}

module.exports = { DemoService: new DemoService() };