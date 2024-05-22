const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { TermAndConditionService } = require('../../../services/term-and-condition.service');
const { TempSecretService } = require('../../../services/temp-secret.service');
const { authenMiddlewareTemp } = require('../../../middleware/token.middle');
const { JwtHelper } = require('../../../helpers/jwt.helper');
const { AccountsService } = require('../../../services/account.service');
const { ELoginPlatform } = require('../../../services/authen.service');
const { DateTz } = require('../../../helpers/date-tz.helper');
const messages = require('../../../commons/message');


const router = express.Router();
const serviceName = 'term-and-condition';

//-----------------------------------------------------------
//-- get term-and-condition
//-----------------------------------------------------------
router.get('/', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `get term and condition` }
    try {
        LOGGER.info(dataLogger);

        const terms = await TermAndConditionService.getTermAndCondition();

        if (!terms) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.termAndConditionNotFound);
        }

        RESPONSE.success(res, SESSION_ID, terms, messages.success.getTermAndConditionSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- action term-and-condition
//-----------------------------------------------------------
router.post('/action', authenMiddlewareTemp, async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `action term and condition` }
    try {
        LOGGER.info(dataLogger);

        const tempId = Number(req.temp?.tempId ?? 0);
        const temp = await TempSecretService.findTempById(tempId);
        if (!temp) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.badRequest);
        }

        let data = null;
        let token = null;
        let message = messages.errors.badRequest;
        let isDeleteTemp = false;

        //-- accept terms and conditions
        if (req.body.option == 1) {
            isDeleteTemp = true;
            const tempLog = temp.tempLog;
            //-- attribs account
            const attribsAccount = {
                uuidAccount: temp.tempUuid,
                accPicture: AccountsService.setPicture({
                    fileUrl: tempLog.accPicture,
                }),
                accFirstname: tempLog.accFirstname,
                condiVersion: req.body.condiVersion,
                condiAccept: req.body.option,
                createdBy: tempLog.accFirstname,
                updatedBy: tempLog.accFirstname,
            };

            //-- attribs login
            const attribsLogin = {
                uuidAccount: temp.tempUuid,
                loginData: tempLog.loginData,
                lineClientId: tempLog.lineClientId,
                loginPlatform: ELoginPlatform.LINE,
                lastLogin: DateTz.dateNow(),
                createdBy: tempLog.accFirstname,
                updatedBy: tempLog.accFirstname,
            };

            //-- create account and chanel login
            const isCreateAccount = await AccountsService.createAccountAndChanelLogin(
                attribsAccount,
                attribsLogin,
            );
            if (isCreateAccount == false) {
                return RESPONSE.exception(res, SESSION_ID, messages.errors.transactionCreatingAccount);
            } else {
                //-- find account
                const lineAccount = await AccountsService.findAccountByUuid(
                    temp.tempUuid,
                );
                //-- gen token
                token = JwtHelper.getToken(lineAccount?.uuidAccount);
                message = messages.success.acceptSuccess;
                data = {
                    saveCondition: true,
                    token,
                };
            }
        }

        //-- reject terms and conditions
        if (req.body.option == 2) {
            isDeleteTemp = true;
            message = messages.success.rejectSuccess;
            data = {
                saveCondition: false,
            };
        }

        //-- delete temp secret
        if (isDeleteTemp && temp?.tempId) {
            await TempSecretService.deleteTempById(temp.tempId);
        }


        RESPONSE.success(res, SESSION_ID, data, message);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
