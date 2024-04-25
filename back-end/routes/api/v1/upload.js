const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { uploadFileOne } = require('../../../middleware/multer.middle');
const { ObsClientService } = require('../../../services/obs.service');
const multer = require('multer');
const { FuncHelper } = require('../../../helpers/func.helper');
const upload = multer();

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

        if (!req?.file) {
            RESPONSE.exceptionVadidate(res, SESSION_ID, 'required file upload');
        }

        const upload = await ObsClientService.uploadFileImage(req.file);
        if (upload.isUpload == false) {
        RESPONSE.exceptionVadidate(res, SESSION_ID, 'Upload OBS failed');
        }

        RESPONSE.success(res, SESSION_ID, { url: FuncHelper.obsBaseUrl(), file: upload.item });
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

module.exports = router;
