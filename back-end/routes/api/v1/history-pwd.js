const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const messages = require('../../../commons/message');
const { HistoryPwdService } = require('../../../services/history-pwd.service');
const env = require('../../../configuration');

const { authenMiddleware } = require('../../../middleware/token.middle');
const { AccountsService } = require('../../../services/account.service');

const router = express.Router();
const serviceName = 'history-password';

//-----------------------------------------------------------
//-- get history password
//-----------------------------------------------------------
router.get('/',authenMiddleware, async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `get history password` }
    try {
        LOGGER.info(dataLogger);

        const uuid = req.authen?.uuid ?? 'NONE';
        const history = await HistoryPwdService.getHistoryTopTenByUuid(uuid);

        RESPONSE.success(res, SESSION_ID, { history }, messages.success.getHistoryPasswordSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});


//-----------------------------------------------------------
//-- get history password
//-----------------------------------------------------------
router.post('/get-activity', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Get History password` }
    try {
        LOGGER.info(dataLogger);

        await HistoryPwdService.clearActivityAuthenPWD();
        const attribsHistory = {
            pwdAtInput: req.body?.pwdAtInput,
        };
        const FindHistory = await HistoryPwdService.FindActivityAuthenPWD(attribsHistory);
        const PWD_LIMIT_WRONG = env.FFD_PWD_LIMIT_WRONG;
        const PWD_LOCK_DURATION_MINUTES = env.FFD_PWD_LOCK_DURATION_MINUTES;

        RESPONSE.success(res, SESSION_ID, { FindHistory, PWD_LIMIT_WRONG, PWD_LOCK_DURATION_MINUTES });

    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- save history password
//-----------------------------------------------------------
router.post('/save-activity', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Save History password` }
    try {
        LOGGER.info(dataLogger);

        await HistoryPwdService.clearActivityAuthenPWD();

        const attribsHistory = {
            pwdAtHash: req.body?.pwdAtHash,
            pwdAtInput: req.body?.pwdAtInput,
            pwdResult: req.body?.pwdResult,
            createdBy: req.body?.pwdAtInput,
            updatedBy: req.body?.pwdAtInput,
        };
        await HistoryPwdService.saveActivityAuthenPWD(attribsHistory);

        const FindHistory = await HistoryPwdService.FindActivityAuthenPWD(attribsHistory);
        const PWD_LIMIT_WRONG = env.FFD_PWD_LIMIT_WRONG;
        const PWD_LOCK_DURATION_MINUTES = env.FFD_PWD_LOCK_DURATION_MINUTES;
        RESPONSE.success(res, SESSION_ID, { FindHistory, PWD_LIMIT_WRONG, PWD_LOCK_DURATION_MINUTES });

    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- lock password by uuid
//-----------------------------------------------------------
router.put('/lock-activity', async (req, res, next) => {

    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `lock History password` }
    try {
        LOGGER.info(dataLogger);

        const uuid = req.body?.pwdAtHash ?? '';
        const result = await AccountsService.lockPasswordByUuid(uuid);
        if(result) {
            await HistoryPwdService.clearActivityAuthenPwdByHash(uuid);
        }

        RESPONSE.success(res, SESSION_ID, result);

    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});


module.exports = router;
