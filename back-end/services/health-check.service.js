// authenticationService.js
const db = require("../commons/typeorm");
const LOGGER = require('../middleware/logger');

class HealthCheckService {

    //-----------------------------------------------------------
    //-- get Questions And Answers
    //-----------------------------------------------------------
    async getAllQuestionsAndAnswers(hcGroupUuid) {
        try {
            const queryBuilder = db.connection.getRepository('FfdHealthCheckQuestion').createQueryBuilder('question');
            queryBuilder.leftJoinAndSelect('question.answers', 'answer');
            queryBuilder.where('question.active = true and answer.active = true');
            queryBuilder.andWhere('question.hcGroupUuid = :hcGroupUuid', { hcGroupUuid });
            queryBuilder.orderBy('question.order', 'ASC');
            const questions = await queryBuilder.getMany();
            return questions;
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async getRule(type = 'all') {
        try {
            const queryBuilder = db.connection.getRepository('FfdHealthCheckRule').createQueryBuilder();
            queryBuilder.where('active = true');
            if (type !== 'all') {
                queryBuilder.andWhere('hcq_type = :type', { type });
            }
            const questions = await queryBuilder.getMany();
            return questions;
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async findGroup(comp_code) {
        try {
            const queryBuilder = db.connection.getRepository('FfdHealthCheckGroup').createQueryBuilder();
            queryBuilder.where('comp_code = :comp_code and active = true', { comp_code });
            return await queryBuilder.getOne();
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async findGroupByDefault() {
        try {
            const queryBuilder = db.connection.getRepository('FfdHealthCheckGroup').createQueryBuilder();
            queryBuilder.where('is_default = true and active = true');
            return await queryBuilder.getOne();
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- create health check save answer
    //-----------------------------------------------------------
    async createHistory(historyData) {
        try {
            const historyRepository = db.connection.getRepository('FfdHealthCheckHistory');
            const newHistory = historyRepository.create(historyData);
            return await historyRepository.save(newHistory);
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }



    //-----------------------------------------------------------
    //-- create health check question
    //-----------------------------------------------------------
    async createQuestion(questionData) {
        try {
            const questionRepository = db.connection.getRepository('FfdHealthCheckQuestion');
            const newQuestion = questionRepository.create(questionData);
            return await questionRepository.save(newQuestion);
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- create health check answer
    //-----------------------------------------------------------
    async createAnswer(answerData) {
        try {
            const answerRepository = db.connection.getRepository('FfdHealthCheckAnswer');
            const newAnswer = answerRepository.create(answerData);
            return await answerRepository.save(newAnswer);
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- create account icon
    //-----------------------------------------------------------
    async createCmsAccountIcon(iconData) {
        try {
            const iconRepository = db.connection.getRepository("CmsAccountIcon");

            await iconRepository.update({ uuidAccount: iconData.uuidAccount }, { active: false });

            const newIcon = iconRepository.create(iconData);
            return await iconRepository.save(newIcon);
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- create persona icon
    //-----------------------------------------------------------
    async createPersonaIcon(personaData) {
        try {
            const personaRepository = db.connection.getRepository('SysPersonaIcon');
            const newPersona = personaRepository.create(personaData);
            return await personaRepository.save(newPersona);
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- get persona icon
    //-----------------------------------------------------------
    async getAllPersonaIcon() {
        try {
            const personaBuilder = db.connection.getRepository('SysPersonaIcon').createQueryBuilder();
            const personaIcon = await personaBuilder.getMany();
            return personaIcon;
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- get persona icon by id
    //-----------------------------------------------------------
    async getAllPersonaIconByUuid(uuid) {
        try {
            const personaIcon = await db.connection.getRepository('CmsAccountIcon')
                .createQueryBuilder()
                .where('uuid_account = :uuid', { uuid: uuid })
                .andWhere('active = true')
                .getOne();
            if (!personaIcon) {
                return null
            }
            const Icon = await db.connection.getRepository('SysPersonaIcon')
                .createQueryBuilder()
                .where(' icon_level = :level and active = true', { level: personaIcon.iconLevel })
                .getOne();
            return Icon;
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

}

module.exports = { HealthCheckService: new HealthCheckService() };
