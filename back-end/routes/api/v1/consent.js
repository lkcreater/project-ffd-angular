const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { AccountsService } = require('../../../services/account.service');
const { ConsentService } = require('../../../services/consent.service');
const { LineChanelService } = require('../../../services/line-chanel.service');
const { TiscoApiService } = require('../../../services/tisco-api.service');
const { AuthenService } = require('../../../services/authen.service');
const { CompaniesService } = require('../../../services/companies.service');

const messages = require('../../../commons/message');
const router = express.Router();
const serviceName = 'consent';

//-----------------------------------------------------------
//-- check version
//-----------------------------------------------------------
router.post('/version', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `check version` }
    try {
        LOGGER.info(dataLogger);

        let isAcceptConsent = true;
        let message = messages.success.versionConsentSuccess;

        //-- check connect line account
        const accountLine = await AccountsService.getConnectLine(req.authen.uuid);
        if (!accountLine) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.accountIsNotConnect);
        }

        //-- get adapter LINE
        const code = accountLine?.lineClientId || 'NONE';
        const adapterLine = await LineChanelService.getAdapterLine(code);
        if (!adapterLine) {
            RESPONSE.success(res, SESSION_ID, {
                isAcceptConsent
            }, messages.errors.adapterLineNotFound);
        }

        //-- check version consent by tisco
        const tiscoConsent = await TiscoApiService.getVersionConsentTisco(
            adapterLine.idNo,
            adapterLine.passwordNo,
            adapterLine.ffdBusinessConsentGroup,
            adapterLine.ffdExecutionApplication,
            req
        )

        //-- has consent by tisco
        if (tiscoConsent && tiscoConsent.response_code == '40000') {
            const dataConsent = tiscoConsent.data.find(e => e.requested_application == adapterLine.ffdExecutionApplication);
            let consent = await ConsentService.checkVersionConsentByDb(
                adapterLine.ffdBusinessConsentGroup,
                adapterLine.ffdExecutionApplication,
                dataConsent?.requested_consent_version
            )
            if (!consent) {
                consent = await ConsentService.updateConsentById(
                    adapterLine.ffdBusinessConsentGroup,
                    adapterLine.ffdExecutionApplication,
                    req
                )
            }

            if (!consent) {
                return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.updateConsent);
            }

            //-- ยังไม่เคยกด
            if (accountLine?.acceptStatus == 0) {
                isAcceptConsent = false;
                message =  messages.success.acceptStatus;
            }

            //-- เคยกด version ไม่ตรง
            if (
                accountLine?.acceptStatus == 1 &&
                consent?.ffdTargetConsentVersion != accountLine?.targetConsentVersion
            ) {
                isAcceptConsent = false;
                message =  messages.success.acceptNotVersionStatus;
            }
        }

        //-- no has consent
        else {
            isAcceptConsent = true;
            message = messages.errors.consentNotFound;
        }

        data = { isAcceptConsent, message };

        RESPONSE.success(res, SESSION_ID, data, message);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- get consent
//-----------------------------------------------------------
router.get('/get-consent', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `get consent` }
    try {
        LOGGER.info(dataLogger);

        let message = messages.success.versionConsentSuccess;

        //-- check connect line account
        const accountLine = await AccountsService.getConnectLine(req.authen.uuid);
        if (!accountLine) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.cAccountNotFound);
        }

        //-- get adapter LINE
        const code = accountLine?.lineClientId || 'NONE';
        const adapterLine = await LineChanelService.getAdapterLine(code);
        if (!adapterLine) {
            RESPONSE.success(res, SESSION_ID, {
                isAcceptConsent
            }, messages.errors.adapterLineNotFound);
        }

        const consent = await ConsentService.getConsentByApp(
            adapterLine.ffdBusinessConsentGroup,
            adapterLine.ffdExecutionApplication
        );
        if (!consent) {
            message = messages.errors.consentNotFound;
        }

        RESPONSE.success(res, SESSION_ID, { consent }, message);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- save consent
//-----------------------------------------------------------
router.post('/save-consent', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `save consent` }
    try {
        LOGGER.info(dataLogger);

        const uuid = req.authen?.uuid ?? 'NONE';
        //-- check connect line account
        const accountLine = await AccountsService.getConnectLine(uuid);
        if (!accountLine) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.accountIsNotConnect);
        }

        //-- save consent by LINE account
        await AccountsService.saveConsentLine(accountLine.id, req.body);

        //***************************************** */
        //-- funtion call member verify Tisco
        //***************************************** */
        const account = await AccountsService.findAccount(uuid);
        if (!account) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.accountNotFound);
        }

        //-- get adapter LINE
        const code = accountLine?.lineClientId || 'NONE';
        const adapterLine = await LineChanelService.getAdapterLine(code);

        if (!adapterLine) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.adapterLineNotFound);
        }
        //-- get consent
        const consent = await ConsentService.getConsentByApp(
            adapterLine.ffdBusinessConsentGroup,
            adapterLine.ffdExecutionApplication
        );
        if (!consent) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.consentNotFound);
        }

        // save Member to tisco
        const saveMember = await TiscoApiService.saveMember(account, accountLine, consent, adapterLine, req);

        //กรณียินยอม หา PVD จาก Tisco
        if (req.body.option == 1) {
            verifyMember = await TiscoApiService.verifyMember(accountLine.loginData, req);

            const { meta, data } = verifyMember;

            //ถ้าเจอ PVD ใน Tisco
            if (meta.response_code == 200000) {

                //-- check comp code
                let compCode = await CompaniesService.checkCompanyCodeByDb(data.company_code)
                //-- update comp code
                if (!compCode) {
                    //-- attribs CompCode
                    const attribsCompCode = {
                        compCode: data?.company_code,
                        compName: data?.company_name,
                        createdBy: req?.authen.username,
                        updatedBy: req?.authen.username,
                    };
                    await CompaniesService.updateCompanyCodeById(attribsCompCode)
                }
                //-- update comp code in account and login
                await Promise.all([
                    AccountsService.updateAccountById(account.accId, {
                        compCode: data.company_code,
                        updatedBy: req?.authen.username,
                    }),
                    AuthenService.updatLoginById(accountLine.id, {
                        loginVerify: 1, // 1 เจอ
                        updatedBy: req?.authen.username,
                    })
                ]);
            } //ถ้าไม่เจอ PVD ใน Tisco
            else if (meta.response_code == 404000) {
                await AuthenService.updatLoginById(accountLine.id, {
                    loginVerify: 2,  // 2 ไม่เจอ
                    updatedBy: req?.authen.username,
                });
            }
        }

        RESPONSE.success(res, SESSION_ID, { save: true, ...req.body, saveMember, verifyMember }, messages.success.saveConsentSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});



module.exports = router;
