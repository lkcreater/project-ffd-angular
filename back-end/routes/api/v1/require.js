const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { FuncHelper } = require('../../../helpers/func.helper');
const { AuthenService, EActionRequest } = require('../../../services/authen.service');
const { TempSecretService } = require('../../../services/temp-secret.service');
const { TiscoApiService } = require('../../../services/tisco-api.service');
const { JwtHelper } = require('../../../helpers/jwt.helper');
const { Validator } = require('node-input-validator');
const messages = require('../../../commons/message');


const router = express.Router();
const serviceName = 'refresh-token';

//-----------------------------------------------------------
//-- verify email/phone exists
//-----------------------------------------------------------
router.post('/verify-input', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Start Refresh Token` }
    try {
        LOGGER.info(dataLogger);

        //-- verify body
        const v = new Validator(req.body,
            { action: 'required', input: 'required' },
        );
        const matched = await v.check()
        if (!matched) {
            RESPONSE.exceptionVadidate(res, SESSION_ID, v.errors);
        }

        let message = messages.errors.badRequest;
        let data = null;
        let isGetToken = false;
        if (req.body?.token && req.body?.token == 'show') {
            isGetToken = true;
        }

        if (
            ![EActionRequest.VERIFY, EActionRequest.AUTHEN_WEB].includes(
                req.body?.action,
            )
        ) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.badRequest);
        }

        //-- check type input
        const inputType = FuncHelper.checkTypeInput(req.body?.input);
        if (inputType.isValid == false) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, inputType.message);
        }

        let token = {};
        //-- verify login chanel
        const chanelLogin = await AuthenService.getVerifyLogin(req.body?.input);
        if (!chanelLogin) {
            //-- gen temp token
            if (isGetToken) {
                const createdTempLog = await TempSecretService.createTempRegisterWeb(
                    req.body,
                    inputType.platform,
                );
                const tempToken = JwtHelper.getToken(createdTempLog?.tempUuid, {
                    tempId: createdTempLog.tempId,
                    tempAction: createdTempLog.tempType,
                    tempTime: createdTempLog.tempTimestamp,
                });
                token = {
                    token: tempToken,
                };
            }

            message = messages.success.userNameCanBeUsed;
            data = {
                ...token,
                isExistAlready: false,
                type: inputType.platform,
            };
        } else {
            //-- gen token
            if (isGetToken) {
                token = {
                    token: JwtHelper.getToken(chanelLogin?.uuidAccount),
                };
            }

            message = messages.errors.usernameIsExist;
            data = {
                ...token,
                isExistAlready: true,
                type: inputType.platform,
            };
        }

        RESPONSE.success(res, SESSION_ID, data, message);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- sent OTP
//-----------------------------------------------------------
router.post('/sent-otp', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Start Refresh Token` }
    try {
        LOGGER.info(dataLogger);

        if (EActionRequest.OTP != req.body?.action) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.badRequest);
        }

        //-- check type input
        const inputType = FuncHelper.checkTypeInput(req.body?.input);
        if (inputType.isValid == false) {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, inputType.message);
        }

        const otp = await TiscoApiService.callSendingOtp(
            inputType.platform,
            req.body?.input,
            req.sessionId
        );
        data = {
            code: otp.data?.pac,
            secret: otp.data?.token_uuid,
            type: inputType.platform,
        };

        RESPONSE.success(res, SESSION_ID, data, messages.success.sendOtpSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- verify OTP
//-----------------------------------------------------------
router.post('/verify-otp', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Start Refresh Token` }
    try {
        LOGGER.info(dataLogger);

        //-- verify body
        const v = new Validator(req.body,
            { otp: 'required', secret: 'required' },
        );
        const matched = await v.check()
        if (!matched) {
            RESPONSE.exceptionVadidate(res, SESSION_ID, v.errors);
        }


        const verify = await TiscoApiService.verifySendingOtp({
            otp: req.body?.otp,
            secret: req.body?.secret,
        });

        let data = null;
        if (verify?.meta?.response_code == '20000') {
            //-- test only
            if (verify?.meta?.isTest == true) {
                console.log(verify?.meta);
            } else {
                await TiscoApiService.revokeSendingOtp(req.body?.secret);
            }

            data = {
                isValid: true,
                ...verify?.meta,
            };
        } else {
            data = {
                isValid: false,
                ...verify?.meta,
            };
        }

        RESPONSE.success(res, SESSION_ID, data, messages.success.verifyOtpSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
