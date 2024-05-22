const express = require('express');

const RESPONSE = require('../../../middleware/response.js');
const LOGGER = require('../../../middleware/logger.js');
const UTILS = require('../../../middleware/utils.js');
const { authenMiddlewareTemp } = require('../../../middleware/token.middle');


const router = express.Router();
const serviceName = 'authen';
const { Validator } = require('node-input-validator');


const { AuthenService, EActionRequest } = require('../../../services/authen.service');
const { AccountsService } = require('../../../services/account.service');
const { SecretHelper } = require('../../../helpers/secret.helper');
const { JwtHelper } = require('../../../helpers/jwt.helper');
const { TempSecretService } = require('../../../services/temp-secret.service');
const { DateTz } = require('../../../helpers/date-tz.helper.js');

const messages = require('../../../commons/message');
const { HistoryPwdService } = require('../../../services/history-pwd.service.js');

//-----------------------------------------------------------
//-- login Email/Phone
//-----------------------------------------------------------
router.post('/', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Login email phone` }
    try {
        LOGGER.info(dataLogger);

        //-- verify body
        const v = new Validator(req.body,
            { action: 'required', userName: 'required' },
        );
        const matched = await v.check()
        if (!matched) {
          return RESPONSE.exceptionValidate(res, SESSION_ID, v.errors);
        }

        //-- check action
        if (
            ![
                EActionRequest.AUTHEN,
                EActionRequest.AUTHEN_CONFIRM
            ].includes(req.body.action)
        ) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.badRequest);
        }

        //-- verify login chanel
        const chanelLogin = await AuthenService.getVerifyLogin(req.body.userName);
        if (!chanelLogin?.uuidAccount) {
            return RESPONSE.success(res, SESSION_ID, null, messages.errors.accountNotFound);
        }

        // //-- verify account
        const account = await AccountsService.findAccount(chanelLogin.uuidAccount);
        if (!account) {
            return RESPONSE.success(res, SESSION_ID, null, messages.errors.accountNotFound);
        }

        //-- ### action FFD_AUTHEN ###
        if (EActionRequest.AUTHEN == req.body?.action) {
            const secretKey = account.uuidAccount;
            await AuthenService.setUpdateSecretKey(chanelLogin.id, secretKey);
            message = messages.success.accountVerifySuccess;
            data = {
                secretKey,
                hash: account.accPassword,
                status: chanelLogin?.status
            };
        }

        //-- ### action AUTHEN_CONFIRM ###
        if (EActionRequest.AUTHEN_CONFIRM == req.body?.action) {
            let isLineConnect = false;
            message = messages.errors.memberIsNotConnect;
            //-- check connection LINE
            const dataLineConnect = await AuthenService.findLineConnect(
                chanelLogin.uuidAccount,
            );

            if (dataLineConnect) {
                isLineConnect = true;
                message = messages.success.memberIsConnectSuccess;
            }

            //-- compare password
            const comfirmPass = await AuthenService.comparePassword(
                req.body?.passWord,
                account.uuidAccount,
            );
            if (comfirmPass) {
                //-- gen token
                const token = JwtHelper.getToken(chanelLogin?.uuidAccount);
                //-- update latest login time
                await AuthenService.updateLatestLogin(chanelLogin.id);
                //-- clear history log
                await HistoryPwdService.clearActivityAuthenPwdByHash(chanelLogin?.uuidAccount);

                data = {
                    isLineConnect,
                    token: token,
                };
            } else {
                return RESPONSE.exception(res, SESSION_ID, messages.errors.wrong);
            }

        }

        RESPONSE.success(res, SESSION_ID, data, message);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- authen-confirm
//-----------------------------------------------------------
router.post('/authen-confirm', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Login email phone confirm` }
    try {
        LOGGER.info(dataLogger);

        //-- verify body
        const v = new Validator(req.body,
            { action: 'required', userName: 'required', passWord: 'required' },
        );
        const matched = await v.check()
        if (!matched) {
           return RESPONSE.exceptionValidate(res, SESSION_ID, v.errors);
        }

        //-- verify login chanel
        const chanelLogin = await AuthenService.getVerifyLogin(req.body.userName);
        if (!chanelLogin?.uuidAccount) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);

        }

        // //-- verify account
        const account = await AccountsService.findAccount(chanelLogin.uuidAccount);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);

        }

        //-- ### action AUTHEN_CONFIRM ###
        if (EActionRequest.AUTHEN_CONFIRM !== req.body?.action) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.actionNotFound);
        }

        let isLineConnect = false;
        //-- check connection LINE
        const dataLineConnect = await AuthenService.findLineConnect(
            chanelLogin.uuidAccount,
        );

        if (dataLineConnect) {
            isLineConnect = true;
        }

        //-- compare password
        const comfirmPass = await AuthenService.comparePassword(
            req.body?.passWord,
            account.accPassword,
        );
        if (comfirmPass) {
            //-- gen token
            const token = JwtHelper.getToken(chanelLogin?.uuidAccount);
            //-- update latest login time
            await AuthenService.updateLatestLogin(chanelLogin.id);

            statusCode = 200;
            data = {
                isLineConnect,
                token: token,
            };
        } else {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.wrong);
        }

        RESPONSE.success(res, SESSION_ID, data);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- create account Email/Phone
//-----------------------------------------------------------
router.post('/create-account', authenMiddlewareTemp, async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `create account Email/Phone` }
    try {
        LOGGER.info(dataLogger);

        if (EActionRequest.CREATE_ACCOUNT != req.body.action) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.badRequest);
        }

        //-- find temp id
        const tempId = Number(req.temp?.tempId ?? 0);
        const tempSecret = await TempSecretService.findTempById(tempId);
        if (!tempSecret) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        //-- check username exist already
        const chanelLogin = await AuthenService.getVerifyLogin(req.body?.userName);
        if (chanelLogin) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountIsUse);
        }

        const tempLog = tempSecret?.tempLog;
        if (!tempLog?.input) {
            return RESPONSE.exception(res, SESSION_ID,  messages.errors.invalidInputTemporary);
        }

        //-- attribs account
        const genCode = SecretHelper.getGuestName();
        const attribsAccount = {
            uuidAccount: tempSecret.tempUuid,
            accPicture: null,
            accFirstname: genCode,
            accPassword: req.body.passWord,
            condiVersion: req.body.condiVersion,
            condiAccept: req.body.option,
            createdBy: genCode,
            updatedBy: genCode,
        };

        //-- attribs login
        const attribsLogin = {
            uuidAccount: tempSecret.tempUuid,
            loginData: tempLog?.input,
            loginPlatform: tempLog?.platform,
            lastLogin: DateTz.dateNow(),
            createdBy: genCode,
            updatedBy: genCode,
        };

        //-- insert account
        const isCreateAccount = await AccountsService.createAccountAndChanelLogin(
            attribsAccount,
            attribsLogin,
        );

        if (isCreateAccount == false) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.transactionCreatingAccount);
        }

        const account = await AccountsService.findAccountByUuid(
            tempSecret.tempUuid,
        );
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        //-- delete temp secret
        if (tempId != 0) {
            await TempSecretService.deleteTempById(tempId);
        }

        //-- gen token
        const token = JwtHelper.getToken(account?.uuidAccount);

        RESPONSE.success(res, SESSION_ID, { token },  messages.success.accountRegistrationSuccess);

    } catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }

});

//-----------------------------------------------------------
//-- login LINE
//-----------------------------------------------------------
router.post('/line', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `login LINE` }
    try {
        LOGGER.info(dataLogger);

        //-- check action
        if (EActionRequest.AUTHEN_LINE == req.body?.action) {
            //-- check connection LINE
            const accountLine = await AuthenService.findLineConnect(
                req.body?.loginData,
                'lineId',
            );
            if (!accountLine) {
                const createdTempLog = await TempSecretService.createTempRegisterLine(
                    req.body,
                );
                const tempToken = JwtHelper.getToken(createdTempLog?.tempUuid, {
                    tempId: createdTempLog.tempId,
                    tempAction: createdTempLog.tempType,
                    tempTime: createdTempLog.tempTimestamp,
                });
                //-- new user -- create temp token

                message = messages.errors.accountNotFound;
                data = {
                    code: 200,
                    token: tempToken,
                };
            } else {
                //-- old user
                const token = JwtHelper.getToken(accountLine?.uuidAccount);
                //-- update latest login time
                await AuthenService.updateLatestLogin(accountLine.id);
                message = messages.success.loginSuccess;
                data = {
                    code: 100,
                    token,
                };
            }
        }

        RESPONSE.success(res, SESSION_ID, data, message);
    } catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }

});

module.exports = router;
