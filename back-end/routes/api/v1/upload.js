const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { uploadFileOne } = require('../../../middleware/multer.middle');
const { ObsClientService } = require('../../../services/obs.service');
const multer = require('multer');
const { FuncHelper } = require('../../../helpers/func.helper');
const upload = multer();
const env = require('../../../configuration');
const messages = require('../../../commons/message');
const router = express.Router();
const serviceName = 'upload file';


//-----------------------------------------------------------
//-- upload file
//-----------------------------------------------------------
router.post('/', uploadFileOne('file', { allowMimeTypes: 'image' }), async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `upload file` }
    try {
        LOGGER.info(dataLogger);

        let subPath = null;
        if (req.query?.path) {
            subPath = req.query?.path;
        }

        if (!req?.file) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.requiredUpload);
        }
        switch (true) {
            case subPath === 'profile':
                subPath = env.OBS_IMAGE_PROFILE || 'userprofile';
                break;
            case subPath === 'healthcheck':
                subPath = env.OBS_IMAGE_HEALTHCHECK || 'healthcheck';
                break;
            case subPath?.startsWith('games'):
                const gameId = subPath.split('@')[1];
                if (gameId) {
                    subPath = `${env.OBS_IMAGE_GAME || 'games'}/${gameId}`;
                } else {
                    subPath = env.OBS_IMAGE_GAME || 'games';
                }
                break;
            default:
                subPath = null;
                break;
        }

        const upload = await ObsClientService.uploadFileImage(req.file, subPath);
        
        if (upload.isUpload == false) {
           return RESPONSE.exception(res, SESSION_ID, messages.errors.uploadObsFailed);
        }

        RESPONSE.success(res, SESSION_ID, { url: FuncHelper.obsBaseUrl(), file: upload.item });
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
