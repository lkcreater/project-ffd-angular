// authenticationService.js
const db = require("../commons/typeorm");
const LOGGER = require('../middleware/logger');

class CompaniesService {
    async checkCompanyCodeByDb(compCode) {
        try {
            return await db.connection.getRepository('CmsCompanies').findOneBy({
                compCode: compCode,
                active: true
            });
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }
    async updateCompanyCodeById(attribsCompCode) {
        try {
            return await db.connection.getRepository('CmsCompanies').save(attribsCompCode)
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }
    
}

module.exports = { CompaniesService: new CompaniesService() };
