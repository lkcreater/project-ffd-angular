const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { RankService } = require('../../../services/rank.service');
const { AccountsService } = require('../../../services/account.service');

const router = express.Router();
const serviceName = 'companies';

//-----------------------------------------------------------
//-- Get Rank Top 3 Rank Scores
//-----------------------------------------------------------
router.get('/top-three', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Get Rank Top 3 Rank Scores` }
    try {
        LOGGER.info(dataLogger);

        const topThreeData = await RankService.getTop3RankScores();

        RESPONSE.success(res, SESSION_ID, topThreeData);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});


//-----------------------------------------------------------
//-- Get Table Rank Rank Scores
//-----------------------------------------------------------
router.get('/table-scores', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Get Table Rank Rank Scores` }
    try {
        LOGGER.info(dataLogger);
        const uuid = req.authen?.uuid ?? "NONE";
        const account = await AccountsService.findAccount(uuid);
    
        if (!account) {
          return RESPONSE.exceptionVadidate(
            res,
            SESSION_ID,
            messages.errors.accountNotFound
          );
        }

        const tableRankData = await RankService.getTableRankScores(account.uuidAccount);

   
        RESPONSE.success(res, SESSION_ID, tableRankData);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});


module.exports = router;
