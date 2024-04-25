const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { LineChanelService } = require('../../../services/line-chanel.service');

const router = express.Router();
const serviceName = 'line chanel';

const lineChanelService = LineChanelService;

//-----------------------------------------------------------
//-- get all lines
//-----------------------------------------------------------
router.get('/', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `get all line chanel` }
    try {
        LOGGER.info(dataLogger);

        const lineChanel = await lineChanelService.getAll();

        RESPONSE.success(res, SESSION_ID, { lineChanel });
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
