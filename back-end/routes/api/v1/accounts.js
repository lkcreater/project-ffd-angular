const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const messages = require('../../../commons/message');

const router = express.Router();
const serviceName = 'accounts';

const { AccountsService } = require('../../../services/account.service');
const { ELoginPlatform } = require('../../../services/authen.service');
const { Validator } = require('node-input-validator');
const { HealthCheckService } = require('../../../services/health-check.service');
const { RankService } = require('../../../services/rank.service');

//-----------------------------------------------------------
//-- get profile me
//-----------------------------------------------------------
router.get('/', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.socket.remoteAddress), message: `Get profile me` }
    try {
        LOGGER.info(dataLogger);

        const uuid = req.authen?.uuid ?? 'NONE';
        const account = await AccountsService.findAccountByUuid(uuid);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }
        const peronaIcon = await HealthCheckService.getAllPersonaIconByUuid(uuid);
        const rankHistory = await RankService.getRankByUuidAccount(uuid);

        //-- hidden password
        let hasPassword = false;
        if (account.accPassword) {
            hasPassword = true;
        }
        delete account.accPassword;
        data = { hasPassword, ...account, peronaIcon ,rankHistory};

        RESPONSE.success(res, SESSION_ID, data, messages.success.getProfileSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- update account information
//-----------------------------------------------------------
router.put('/update-profile', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `update account information` }

    try {
        LOGGER.info(dataLogger);

        const uuid = req.authen?.uuid ?? 'NONE';
        const account = await AccountsService.findAccount(uuid);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        const attribsAccount = {
            accPicture: req.body?.accPicture || account.accPicture,
            accFirstname: req.body?.accFirstname || account.accFirstname,
            compCode: req.body?.compCode || account.compCode,
            updatedBy: req.authen?.username || account.accFirstname,
        };

        const updated = await AccountsService.updateAccountById(
            account?.accId,
            attribsAccount,
        );

        RESPONSE.success(res, SESSION_ID, updated, messages.success.updateProfileSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- save forgot password
//-----------------------------------------------------------
router.put('/forgot-pwd', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `forgot password` }
    try {
        LOGGER.info(dataLogger);

        //-- verify body
        const v = new Validator(req.body,
            { accPassword: 'required' },
        );
        const matched = await v.check()
        if (!matched) {
           return RESPONSE.exceptionValidate(res, SESSION_ID, v.errors);
        }

        const updated = await AccountsService.changePassword(req.authen?.uuid, {
            hash: req.body?.accPassword,
            username: req.authen?.username,
        });

        RESPONSE.success(res, SESSION_ID, updated, messages.success.forgotPasswordSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- change code company
//-----------------------------------------------------------
router.put('/code-company', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `change code company` }
    try {
        LOGGER.info(dataLogger);

        //-- verify body
        const v = new Validator(req.body,
            { code: 'required' },
        );
        const matched = await v.check()
        if (!matched) {
           return RESPONSE.exceptionValidate(res, SESSION_ID, v.errors);
        }

        const uuid = req.authen?.uuid ?? 'NONE';
        const account = await AccountsService.findAccount(uuid);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        const updated = await AccountsService.updateAccountById(account.accId, {
            compCode: req.body?.code,
            updatedBy: req?.authen.username,
        });

        RESPONSE.success(res, SESSION_ID, updated, messages.success.updateCodeSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- save disconnected chanel login
//-----------------------------------------------------------
router.post('/disconnect', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `save disconnected chanel login` }
    try {
        LOGGER.info(dataLogger);

        //-- verify body
        const v = new Validator(req.body,
            { chanelId: 'required' },
        );
        const matched = await v.check()
        if (!matched) {
           return RESPONSE.exceptionValidate(res, SESSION_ID, v.errors);
        }

        const uuid = req.authen?.uuid ?? 'NONE';

        const account = await AccountsService.findAccountByUuid(uuid);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        if (account?.chanelLogin && account?.chanelLogin.length <= 1) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.disconnectOneMore);
        }

        const id = Number(req.body?.chanelId);
        const findChanel = account?.chanelLogin?.find((c) => c.id == id);
        if (!findChanel) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        if (findChanel?.isLineLiff == true) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.disconnectLine);
        }

        const chanelLogins = account?.chanelLogin.filter((c) => c.id != id);
        let isClearPassword = true;
        if (chanelLogins && chanelLogins.length > 0) {
            chanelLogins.forEach((e) => {
                if (
                    [ELoginPlatform.EMAIL, ELoginPlatform.PHONE].includes(e.loginPlatform)
                ) {
                    isClearPassword = false;
                }
            });
        }

        //-- disconnect chanel login
        await AccountsService.disconnectChanelLogin(id);

        //-- clear password
        if (isClearPassword) {
            await AccountsService.clearPasswordByID(
                account.accId,
                req.authen?.username,
            );
        }
        data = { isClearPassword, chanelLogins };

        RESPONSE.success(res, SESSION_ID, data, messages.success.disconnectSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- save connected chanel login
//-----------------------------------------------------------
router.post('/connect', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `save connected chanel login` }
    try {

        LOGGER.info(dataLogger);

        //-- verify body
        const v = new Validator(req.body,
            {
                loginData: 'required',
                loginPlatform: 'required',
            },
        );
        const matched = await v.check()
        if (!matched) {
           return RESPONSE.exceptionValidate(res, SESSION_ID, v.errors);
        }

        if (!['EMAIL', 'PHONE', 'LINE'].includes(req.body.loginPlatform)) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.connectPlatform);
        }

        //-- find UUID
        const uuid = req.authen?.uuid ?? 'NONE';

        //-- check channel login
        const account = await AccountsService.findAccountByUuid(uuid);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        //-- new password
        if (req.body?.isNewPW == 'save' && req.body?.accPassword) {
            await AccountsService.updateAccountById(account.accId, {
                accPassword: req.body?.accPassword
            });
        }

        //-- find Exist 
        const accountExist = account?.chanelLogin.find(Exist => Exist.loginPlatform == req.body.loginPlatform);
        if (accountExist) {
            const replaceValues = [req.body.loginPlatform];
            return RESPONSE.exception(res, SESSION_ID, messages.errors.connectedExist, replaceValues);
        }

        //-- save account
        let isConnected = false;
        const saveAccount = await AccountsService.connectLogin(uuid, req.body, account?.accFirstname);
        if (saveAccount) {
            isConnected = true;
        }

        RESPONSE.success(res, SESSION_ID, { isConnected, connect: saveAccount }, messages.success.connectSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- lock password
//-----------------------------------------------------------
router.post('/lock-password', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `lock password` }
    try {
        LOGGER.info(dataLogger);

        //-- verify body
        const v = new Validator(req.body,
            { chanelId: 'required' },
        );
        const matched = await v.check()
        if (!matched) {
           return RESPONSE.exceptionValidate(res, SESSION_ID, v.errors);
        }

        const uuid = req.authen?.uuid ?? 'NONE';
        const account = await AccountsService.findAccountByUuid(uuid);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        const id = Number(req.body?.chanelId);
        const chanelLogins = account?.chanelLogin?.find((c) => c.id == id);

        if (!chanelLogins) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        //-- lock passWord 
        await AccountsService.lockPassword(id);

        RESPONSE.success(res, SESSION_ID, messages.success.lockPasswordSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- get score
//-----------------------------------------------------------
router.get('/score', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.socket.remoteAddress), message: `Get score me` }
    try {
        LOGGER.info(dataLogger);

        const uuid = req.authen?.uuid ?? 'NONE';
        const account = await AccountsService.findAccountByUuid(uuid);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }
        const rankHistory = await RankService.getRankByUuidAccount(uuid);

        data = {rankHistory};
        
        RESPONSE.success(res, SESSION_ID, data);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
