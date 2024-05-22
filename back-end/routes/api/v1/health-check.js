const express = require('express');

const RESPONSE = require('../../../middleware/response');
const LOGGER = require('../../../middleware/logger');
const UTILS = require('../../../middleware/utils');
const { HealthCheckService } = require('../../../services/health-check.service');
const { AccountsService } = require('../../../services/account.service');

const messages = require('../../../commons/message');
const router = express.Router();
const serviceName = 'health-check';
const constrant = require('../../../commons/constrant');

//-----------------------------------------------------------
//-- get all questions and answers
//-----------------------------------------------------------
router.get('/', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Get all questions and answers` }
    try {
        LOGGER.info(dataLogger);

        const uuid = req.authen?.uuid ?? 'NONE';
        const account = await AccountsService.findAccountByUuid(uuid);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        const compCode = account.compCode || 'NONE';
        const companiesGroup = await HealthCheckService.findGroup(compCode)

        let hcGroupUuid = ''
        if (companiesGroup) {
            hcGroupUuid = companiesGroup.hcGroupUuid
        } else {
            const companiesGroupDefault = await HealthCheckService.findGroupByDefault()
            hcGroupUuid = companiesGroupDefault.hcGroupUuid
        }

        const questions = await HealthCheckService.getAllQuestionsAndAnswers(hcGroupUuid);
        const groupedData = questions.reduce((acc, curr) => {
            if (!acc[curr.hcqType]) {
                acc[curr.hcqType] = [];
            }
            acc[curr.hcqType].push(curr);
            return acc;
        }, {});
        const rule = await HealthCheckService.getRule();

        RESPONSE.success(res, SESSION_ID, { TYPE_RULE: constrant.TYPE_RULE, CONFIG: constrant.questionnaire, rule, questions: groupedData }, messages.success.getGealthCheckSuccess);
    } catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- create health check question
//-----------------------------------------------------------
router.post('/', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `create health check question` }
    try {
        LOGGER.info(dataLogger);

        const question = await HealthCheckService.createQuestion(req.body);

        RESPONSE.success(res, SESSION_ID, question, messages.success.createQuestionSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- create health check answer
//-----------------------------------------------------------
router.post('/create-answer', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Create health check answer` }
    try {
        LOGGER.info(dataLogger);

        const answer = await HealthCheckService.createAnswer(req.body);

        RESPONSE.success(res, SESSION_ID, answer, messages.success.createAnswerSuccess);
    } catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- create health check save answer
//-----------------------------------------------------------
router.post('/save-answer', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Save health check answer` }
    try {
        LOGGER.info(dataLogger);

        const uuid = req.authen?.uuid ?? 'NONE';
        const account = await AccountsService.findAccount(uuid);
        if (!account) {
            return RESPONSE.exception(res, SESSION_ID, messages.errors.accountNotFound);
        }

        const attribsHistory = {
            uuidAccount: account.uuidAccount,
            hcHisSystem: req.body?.hcHisSystem,
            hcHisAnswer: req.body?.hcHisAnswer,
            hcTypeRule: req.body?.hcTypeRule,
            hcScoreInitil: req.body?.hcScoreInitil,
            hcHisScore: req.body?.hcHisScore,
            createdBy: req.authen?.username,
            updatedBy: req.authen?.username,
        };

        const saveHistory = await HealthCheckService.createHistory(attribsHistory);

        //-- find icon persona 
        let hcrResult = 0;
        const personaIcons = await HealthCheckService.getAllPersonaIcon();
        const score = attribsHistory.hcHisScore;
        for (const icon of personaIcons) {
            if(attribsHistory.hcTypeRule == icon.iconType && (score >= icon.iconMinScore && score <= icon.iconMaxScore)) {
                hcrResult = icon.iconLevel;
            }
        }
        
        const iconData = {
            uuidAccount: account.uuidAccount,
            iconLevel: hcrResult,
            createdBy: req.authen?.username,
            updatedBy: req.authen?.username
        };
        const peronaIcon = await HealthCheckService.createCmsAccountIcon(iconData);

        RESPONSE.success(res, SESSION_ID, {  peronaIcon }, messages.success.saveAnswerSuccess);
    } catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- create persona icon
//-----------------------------------------------------------
router.post('/persona-icon', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `create persona icon` }
    try {
        LOGGER.info(dataLogger);

        const attribsPersona = {
            iconLevel: req.body?.iconLevel,
            iconName: req.body?.iconName,
            iconImage: req.body?.iconImage,
            iconDetail: req.body?.iconDetail,
            iconMinScore: req.body?.iconMinScore,
            iconMaxScore: req.body?.iconMaxScore,
            createdBy: req.authen?.username,
            updatedBy: req.authen?.username,
        };

        const icon = await HealthCheckService.createPersonaIcon(attribsPersona);

        RESPONSE.success(res, SESSION_ID, icon, messages.success.createPersonaIconSuccess);
    }
    catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});

//-----------------------------------------------------------
//-- get all persona icon
//-----------------------------------------------------------
router.get('/perona-icon', async (req, res, next) => {
    const SESSION_ID = req.sessionId;
    const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, 'P', req.connection.remoteAddress), message: `Get all persona icon` }
    try {
        LOGGER.info(dataLogger);

        const persona = await HealthCheckService.getAllPersonaIcon();

        RESPONSE.success(res, SESSION_ID, persona, messages.success.getAllPersonaIconSuccess);
    } catch (err) {
        LOGGER.error({ ...dataLogger, message: dataLogger.message + ' [ERR]' });
        next(err);
    }
});


module.exports = router;
