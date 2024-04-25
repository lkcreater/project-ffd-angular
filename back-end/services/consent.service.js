// authenticationService.js
const db = require("../commons/typeorm");
const { TiscoApiService } = require("./tisco-api.service");
const LOGGER = require('../middleware/logger');
class ConsentService {

    async updateConsentById(businessConsentGroup, executionApplication, req) {
        try {
            const tiscoConsent = await TiscoApiService.getConsentTisco(businessConsentGroup, executionApplication, req);
            if(tiscoConsent && tiscoConsent?.response_code == '40000'){
                const dataConsent = tiscoConsent?.data[0];
                const attribs  = {
                    ffdBusinessConsentGroup: businessConsentGroup,
                    ffdExecutionApplication: executionApplication,
                    ffdTargetConsentId: dataConsent?.target_consent_id,
                    ffdTargetConsentCode: dataConsent?.target_consent_code,
                    ffdTargetConsentVersion: dataConsent?.target_consent_version,
                    ffdTargetProductType: dataConsent?.target_product_type,
                    ffdTargetConsentTopicThai: dataConsent?.target_consent_topic_thai,
                    ffdTargetConsentTopicEnglish: dataConsent?.target_consent_topic_english,
                    ffdTargetConsentThai: dataConsent?.target_consent_thai,
                    ffdTargetConsentEnglish: dataConsent?.target_consent_english,
                    ffdTargetConsentOptionThai: dataConsent?.target_consent_option_thai,
                    ffdTargetConsentOptionEnglish: dataConsent?.target_consent_option_english,
                    ffdTargetPrivacyNoticeThai: dataConsent?.target_privacy_notice_thai,
                    ffdTargetPrivacyNoticeEnglish: dataConsent?.target_privacy_notice_english,
                    ffdTheme: dataConsent?.theme,
                }

                const appConsent = await db.connection.getRepository('SysFfdConsent').findOneBy({
                    ffdBusinessConsentGroup: businessConsentGroup,
                    ffdExecutionApplication: executionApplication
                });
                if(appConsent) {
                    return await db.connection.getRepository('SysFfdConsent').update({
                        ffdBusinessConsentGroup: businessConsentGroup,
                        ffdExecutionApplication: executionApplication 
                    }, attribs);
                }
                await db.connection.getRepository('SysFfdConsent').save(attribs);

                return await this.checkVersionConsentByDb(businessConsentGroup, executionApplication, dataConsent?.target_consent_version);
            }
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async getConsentByCode(code) {
        try {
            return await db.connection.getRepository('SysFfdConsent').findOneBy({
                ffdTargetConsentCode: code,
                active: true
            });
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async getConsentByApp(
        ffdBusinessConsentGroup,
        ffdExecutionApplication,
    ) {
        try {
            return await db.connection.getRepository('SysFfdConsent').findOneBy({
                ffdBusinessConsentGroup: ffdBusinessConsentGroup,
                ffdExecutionApplication: ffdExecutionApplication,
                active: true
            });
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async checkVersionConsentByDb(
        ffdBusinessConsentGroup,
        ffdExecutionApplication,
        ffdTargetConsentVersion,
    ) {
        try {
            return await db.connection.getRepository('SysFfdConsent').findOneBy({
                ffdBusinessConsentGroup: ffdBusinessConsentGroup,
                ffdExecutionApplication: ffdExecutionApplication,
                ffdTargetConsentVersion: ffdTargetConsentVersion,
                active: true
            });
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }
    
}

module.exports = {ConsentService : new ConsentService()};
