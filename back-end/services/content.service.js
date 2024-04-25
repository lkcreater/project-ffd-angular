// authenticationService.js
const db = require("../commons/typeorm");
const LOGGER = require('../middleware/logger');
class ContentService {
    async getContent() {
        try {
          return await db.connection.getRepository('CmsContent')
            .createQueryBuilder()
            .where('active = :isActive', {
                isActive: true,
            })
            .getMany();
        } catch (error) {
          LOGGER.error(error);
          throw new Error(error?.message);
        }
      }
    
}

module.exports = { ContentService: new ContentService() };
