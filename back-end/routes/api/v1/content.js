const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { ContentService } = require('../../../services/content.service');

const messages = require('../../../commons/message');
const router = express.Router();
const serviceName = 'Content';

//-----------------------------------------------------------
//-- get content
//-----------------------------------------------------------
router.get('/', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Get content` }
    try {
        LOGGER.info(dataLogger);

        const content = await ContentService.getContent();
        if (content == '') {
            return RESPONSE.exceptionVadidate(res, SESSION_ID, messages.errors.consentNotFound);
        }

        RESPONSE.success(res, SESSION_ID, content, messages.success.getContentSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
