const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { FuncHelper } = require('../../../helpers/func.helper');
const env = require('../../../configuration');
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
        let obs_url = FuncHelper.obsBaseUrl()
        if (env.FFD_ENABLE_CDN == 'true') {
            obs_url = env.FFD_CDN_URL
        }
        RESPONSE.success(res, SESSION_ID, {
            obs_url: obs_url
        });
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
