const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { ObsClientService } = require('../../../services/obs.service');


const router = express.Router();
const serviceName = 'config';

//-----------------------------------------------------------
//-- get file 
//-----------------------------------------------------------
router.get('/:name', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `get file` };

    try {
        LOGGER.info(dataLogger);

        const result = await ObsClientService.getObject(req.params?.name);

        if(result.CommonMsg.Status != 200) {
            //-- error
        }

        // res.writeHead(200, {
        //     'Content-Type': result?.InterfaceResult?.ContentType,
        //     'Content-Length': result?.InterfaceResult?.ContentLength,
        //     //'Content-Disposition': result?.InterfaceResult?.ContentDisposition//`inline; filename=""`
        // });
        console.log(result);
        res.setHeader('Content-Type', result?.InterfaceResult?.ContentType);
        return res.send(result?.InterfaceResult?.Content); 
    }
    catch (err) {
        LOGGER.error({
            ...dataLogger,
            message: dataLogger.message + ' [ERR]'
        });
        next(err);
    }
});

module.exports = router;
