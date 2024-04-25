const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { AccountsService } = require('../../../services/account.service');
const { ConsentService } = require('../../../services/consent.service');


const router = express.Router();
const serviceName = 'companies';

//-----------------------------------------------------------
//-- change code company
//-----------------------------------------------------------
router.put('/', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `change code company` }
    try {
        LOGGER.info(dataLogger);

        RESPONSE.success(res, SESSION_ID, data);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
