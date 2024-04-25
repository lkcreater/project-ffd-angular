const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { FuncHelper } = require('../../../helpers/func.helper');

const router = express.Router();
const serviceName = 'config';

//-----------------------------------------------------------
//-- get all lines
//-----------------------------------------------------------
router.get('/', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `get config` }
    try {
        LOGGER.info(dataLogger);

        RESPONSE.success(res, SESSION_ID, { 
            obs_url: FuncHelper.obsBaseUrl()
        });
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
