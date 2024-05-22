// authenticationService.js
const db = require("../commons/typeorm");
const LOGGER = require('../middleware/logger');

class GameService {
  async getCategories() {
    try {
      return await db.connection.getRepository('GameCategory')
        .createQueryBuilder()
        .where('active = :isActive', {
          isActive: true,
        })
        .getMany();
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async getBoardGame() {
    try {
      return await db.connection.getRepository('GameGroup')
        .createQueryBuilder()
        .where('active = :isActive', {
          isActive: true,
        })
        .getMany();
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async findGroup(comp_code) {
    try {
      const queryBuilder = db.connection.getRepository('GameGroup').createQueryBuilder();
      queryBuilder.where('comp_code = :comp_code and active = true', { comp_code });
      return await queryBuilder.getMany();
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async findGroupByDefault() {
    try {
      const queryBuilder = db.connection.getRepository('GameGroup').createQueryBuilder();
      queryBuilder.where('active = true and is_default = true');
      return await queryBuilder.getMany();
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  //-----------------------------------------------------------
  //-- get Questions And Answers
  //-----------------------------------------------------------
  async getAllQuestionsAndAnswers(gmBoardId) {
    try {
      const queryBuilder = db.connection.getRepository('GameBoard').createQueryBuilder('board');
      queryBuilder.leftJoinAndSelect('board.format', 'format');
      queryBuilder.leftJoinAndSelect('board.question', 'question');
      queryBuilder.leftJoinAndSelect('question.answers', 'answer');
      queryBuilder.leftJoinAndSelect('board.categories', 'categorie');
      queryBuilder.where('board.active = true and answer.active = true and question.active = true and format.active = true and categorie.active = true');
      queryBuilder.andWhere('board.gmBoardId = :gmBoardId', { gmBoardId });
      queryBuilder.orderBy('board.order', 'ASC');
      const questions = await queryBuilder.getOne();
      return questions;
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  //-----------------------------------------------------------
  //-- get Questions And Answers ByRule
  //-----------------------------------------------------------
  async getAllQuestionsAndAnswersByRule(gmBoardId, rule) {
    try {
      const queryBuilder = db.connection.getRepository('GameBoard').createQueryBuilder('board');
      queryBuilder.leftJoinAndSelect('board.format', 'format');
      queryBuilder.leftJoinAndSelect('board.categories', 'categorie');
      queryBuilder.where('board.active = true and format.active = true and categorie.active = true');
      queryBuilder.andWhere('board.gmBoardId = :gmBoardId', { gmBoardId });
      const questions = await queryBuilder.getOne();

      if (questions) {
        const rule = questions?.format?.gmRuleGame;
        const queryGameQuestion = db.connection.getRepository('GameQuestion').createQueryBuilder('question');
        queryGameQuestion.where('question.active = true')

        //-- random questions
        if (rule?.randomQuestion == true) {
          queryGameQuestion.orderBy('RANDOM()');
        } else {
          queryGameQuestion.orderBy('question.order', 'ASC');
        }

        //-- limit questions
        if (rule?.limitQuestion) {
          queryGameQuestion.limit(rule?.limitQuestion);
        }

        const gameQuestion = await queryGameQuestion.getMany();

        const questtionAll = [];
        if (gameQuestion) {
          let questIds = [];
          gameQuestion.forEach(q => {
            questIds.push(q.gmQuestId);
          });

          if (questIds && questIds.length > 0) {
            const queryGameAnswer = db.connection.getRepository('GameAnswer').createQueryBuilder('answer');
            queryGameAnswer.where('answer.active = true and answer.gmQuestId in (:...questIds)', {
              questIds: questIds
            })

            if (rule?.randomChoice == true) {
              queryGameAnswer.orderBy('RANDOM()');
            }
            const gameAnswer = await queryGameAnswer.getMany();

            gameQuestion.forEach(x => {
              const answer = gameAnswer?.filter(a => a.gmQuestId == x.gmQuestId)
              if (answer?.length > 0) {
                questtionAll.push({
                  ...x,
                  answers: answer
                });
              }
            });
          }
        }

        Object.assign(questions, {
          question: questtionAll
        })
      }
      return questions;
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  //-----------------------------------------------------------
  //-- create game board save answer
  //-----------------------------------------------------------
  async createHistory(historyData) {
    try {
      const historyRepository = db.connection.getRepository('GameUserHistory');
      const newHistory = historyRepository.create(historyData);
      return await historyRepository.save(newHistory);
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  //-----------------------------------------------------------
  //-- get history game count
  //-----------------------------------------------------------
  async getHistoryCount(uuidAccount) {
    try {
      const queryBuilder = db.connection.getRepository('GameUserHistory').createQueryBuilder('gmHis');
      queryBuilder.select(['gmHis.gmBoardId as board_id', 'COUNT(gmHis.gmBoardId) AS counter']);
      queryBuilder.where('gmHis.active = true AND gmHis.uuidAccount = :uuidAccount', { uuidAccount });
      queryBuilder.groupBy('gmHis.gmBoardId');
      const result = await queryBuilder.getRawMany();
      // แปลงค่า count เป็นตัวเลข
      result.forEach(row => {
          row.counter = parseInt(row.counter);
      });
      return result;
      

    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async getBoardByCategoriesIds(gmBoardIds,gmCateIds) {
    try {
      const queryBuilder = db.connection.getRepository('GameCategory').createQueryBuilder('cate');
      queryBuilder.where('cate.active = true')
      if (gmCateIds.length > 0) {
        queryBuilder.andWhere('cate.gmCateId IN (:...gmCateIds)', { gmCateIds })
      }
      const categories = await queryBuilder.getMany();
      let cateIds = [];
      if (categories) {
        categories.forEach(c => {
          cateIds.push(c.gmCateId)
        })
      }

      let boardAll = [];
      let formatAll = [];

      if (cateIds.length > 0) {
        const queryBuilderBoard = db.connection.getRepository('GameBoard').createQueryBuilder('board');
        queryBuilderBoard.where('board.active = true');
        queryBuilderBoard.andWhere('board.gmCateId IN (:...cateIds)', { cateIds });
        const board = await queryBuilderBoard.getMany();

        let formatIds = [];

        if (board.length > 0) {
          board.forEach((e) => {
            if (!formatIds.includes(e.gmFormId)) {
              formatIds.push(e.gmFormId)
            }
          })

          if (formatIds.length > 0) {
            const queryBuilderFormat = db.connection.getRepository('GameFormat').createQueryBuilder('format');
            queryBuilderFormat.where('format.active = true');
            queryBuilderFormat.andWhere('format.gmFormId IN (:...formatIds)', { formatIds });
            formatAll = await queryBuilderFormat.getMany();
          }
          // กรองตาม group
          const filteredBoard = board.filter(b => gmBoardIds.includes(b.gmBoardId));

          filteredBoard.forEach((e) => {
            const cate = categories.find(c => c.gmCateId == e.gmCateId)
            const format = formatAll.find(f => f.gmFormId == e.gmFormId)
            boardAll.push({
              ...e,
              categories: cate ?? null,
              format: format ?? null,
            })
          })
        }
      }

      return boardAll;

    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  //fix
  async getQuestionsAndAnswersByRule(gmBoardId) {
    try {
      const queryBuilder = db.connection.getRepository('GameBoard').createQueryBuilder('board');
      queryBuilder.where('board.active = true');
      queryBuilder.andWhere('board.gmBoardId = :gmBoardId', { gmBoardId });
      const questions = await queryBuilder.getOne();

      if (questions) {

        const categorie = await db.connection.getRepository('GameCategory').findOneBy({ gmCateId: questions.gmCateId });
        const format = await db.connection.getRepository('GameFormat').findOneBy({ gmFormId: questions.gmFormId });

        const rule = format?.gmRuleGame;
        const queryGameQuestion = db.connection.getRepository('GameQuestion').createQueryBuilder('question');
        queryGameQuestion.where('question.active = true')
        queryGameQuestion.andWhere('question.gmBoardId = :gmBoardId', { gmBoardId: questions.gmBoardId });

        //-- random questions
        if (rule?.randomQuestion == true) {
          queryGameQuestion.orderBy('RANDOM()');
        } else {
          queryGameQuestion.orderBy('question.order', 'ASC');
          queryGameQuestion.addOrderBy('question.gmQuestId', 'ASC');
        }

        //-- limit questions
        if (rule?.limitQuestion) {
          queryGameQuestion.limit(rule?.limitQuestion);
        }

        const gameQuestion = await queryGameQuestion.getMany();

        const questtionAll = [];
        if (gameQuestion) {
          let questIds = [];
          gameQuestion.forEach(q => {
            questIds.push(q.gmQuestId);
          });

          if (questIds && questIds.length > 0) {
            const queryGameAnswer = db.connection.getRepository('GameAnswer').createQueryBuilder('answer');
            queryGameAnswer.where('answer.active = true and answer.gmQuestId in (:...questIds)', {
              questIds: questIds
            })

            if (rule?.randomChoice == true) {
              queryGameAnswer.orderBy('RANDOM()');
            }
            else {
              queryGameQuestion.orderBy('answer.order', 'ASC');
              queryGameQuestion.addOrderBy('answer.gmAnsId', 'ASC');
            }
            const gameAnswer = await queryGameAnswer.getMany();

            gameQuestion.forEach(x => {
              const answer = gameAnswer?.filter(a => a.gmQuestId == x.gmQuestId)
              if (answer?.length > 0) {
                questtionAll.push({
                  ...x,
                  answers: answer
                });
              }
            });
          }
        }

        Object.assign(questions, {
          format: format,
          categories: categorie,
          question: questtionAll,
        })
      }
      return questions;
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }


  //-----------------------------------------------------------
  //-- Get Format game
  //-----------------------------------------------------------
  async getFormatGameById(gmBoardId) {
    try {
      const queryBuilder = db.connection.getRepository('GameBoard').createQueryBuilder('board');
      queryBuilder.where('board.active = true');
      queryBuilder.andWhere('board.gmBoardId = :gmBoardId', { gmBoardId });
      const questions = await queryBuilder.getOne();

      return await db.connection.getRepository('GameFormat')
      .findOneBy({ gmFormId: questions.gmFormId });

    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  //-----------------------------------------------------------
  //-- find History game by game board
  //-----------------------------------------------------------
  async findHisGameByBoardGame(uuidAccount, gmBoardId) {
    try {
      return await db.connection.getRepository('GameUserHistory')
        .createQueryBuilder('gameHis')
        .where('gameHis.active = true')
        .andWhere('gameHis.uuidAccount = :uuidAccount and gameHis.gmBoardId = :gmBoardId  ', { uuidAccount, gmBoardId })
        .getMany();
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

}

module.exports = { GameService: new GameService() };
