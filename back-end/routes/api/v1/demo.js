const express = require('express');
const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const messages = require('../../../commons/message');
const { DateTz } = require('../../../helpers/date-tz.helper');
const { JwtHelper } = require('../../../helpers/jwt.helper');
const { uuid } = require('uuidv4');
const { AccountsService } = require('../../../services/account.service');
const { DemoService } = require('../../../services/demo.service');
const { ELoginPlatform } = require('../../../services/authen.service');

const router = express.Router();
const serviceName = 'demo';

//-----------------------------------------------------------
//-- verify Demo
//-----------------------------------------------------------
router.post('/check', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `check user demo` }
    try {
        LOGGER.info(dataLogger);

        // //-- verify account
        const account = await DemoService.findAccountByUserName(req.body.userName);
        let verify = false;
        if (!account) {
            return RESPONSE.success(res, SESSION_ID, { verify }, messages.errors.accountNotFound);
        } else {
            verify = true;
        }

        RESPONSE.success(res, SESSION_ID, { verify }, messages.success.accountVerifySuccess);

    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});


//-----------------------------------------------------------
//-- create demo
//-----------------------------------------------------------
router.post('/', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `create account for demo` }
    try {
        LOGGER.info(dataLogger);
        // //-- verify account
        const userName = req.body.userName;
        const account = await DemoService.findAccountByUserName(userName);
        if (!account) {
            const uuidAccount = uuid();
            const attribsAccount = {
                uuidAccount: uuidAccount,
                accPicture: null,
                accFirstname: userName,
                accPassword: '$2a$10$m9gXnX38Ufhv.GzScp3ZoOqOFv/5OdHYidS88dxyt91MSlW64RZBy',
                condiVersion: null,
                condiAccept: null,
                createdBy: userName,
                updatedBy: userName,
            };

            //-- attribs login
            const attribsLogin = {
                uuidAccount: uuidAccount,
                loginData: `${userName}@demo.com`,
                loginPlatform: ELoginPlatform.EMAIL,
                lastLogin: DateTz.dateNow(),
                createdBy: userName,
                updatedBy: userName,
            };

            //-- insert account
            const isCreateAccount = await AccountsService.createAccountAndChanelLogin(
                attribsAccount,
                attribsLogin,
            );
            if (!isCreateAccount) {
                return RESPONSE.exception(res, SESSION_ID, messages.errors.transactionCreatingAccount);
            }
            const account = await AccountsService.findAccountByUuid(
                uuidAccount,
            );
            if (!account) {
                return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
            }
            //-- gen token
            const token = JwtHelper.getToken(account?.uuidAccount);
            RESPONSE.success(res, SESSION_ID, { token }, messages.success.accountRegistrationSuccess);

        } else {
            //-- gen token
            const token = JwtHelper.getToken(account?.uuidAccount);
            RESPONSE.success(res, SESSION_ID, { token }, messages.success.accountVerifySuccess);
        }

    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
