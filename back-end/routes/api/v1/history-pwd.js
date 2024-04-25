const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const messages = require('../../../commons/message');

const router = express.Router();
const serviceName = 'history-password';

//-----------------------------------------------------------
//-- get history password
//-----------------------------------------------------------
router.post('/', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `get history password` }
    try {
        LOGGER.info(dataLogger);

        const uuid = req.authen?.uuid ?? 'NONE';
        const history = await historyPwdService.getHistoryTopTenByUuid(uuid);

        data = history;

        RESPONSE.success(res, SESSION_ID, data, messages.success.getHistoryPasswordSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
