const express = require("express");

const RESPONSE = require("../../../middleware/response");
const LOGGER = require("../../../middleware/logger");
const UTILS = require("../../../middleware/utils");
const { GameService } = require("../../../services/game-service");

const messages = require("../../../commons/message");
const { AccountsService } = require("../../../services/account.service");
const { RankService } = require("../../../services/rank.service");
const { DateTz } = require("../../../helpers/date-tz.helper");
const router = express.Router();
const serviceName = "Game";

//-----------------------------------------------------------
//-- get categories
//-----------------------------------------------------------
router.get("/categories", async (req, res, next) => {
  const SESSION_ID = req.sessionId;
  const dataLogger = {
    meta: UTILS.generateLogMeta(
      SESSION_ID,
      req.method,
      serviceName,
      "P",
      req.connection.remoteAddress
    ),
    message: `Get categories`,
  };
  try {
    LOGGER.info(dataLogger);

    const categories = await GameService.getCategories();
    if (categories == "") {
      return RESPONSE.exception(
        res,
        SESSION_ID,
        messages.errors.categoriesGameNotFound
      );
    }

    RESPONSE.success(
      res,
      SESSION_ID,
      categories,
      messages.success.getCategoriesSuccess
    );
  } catch (err) {
    LOGGER.error({ ...dataLogger, message: dataLogger.message + " [ERR]" });
    next(err);
  }
});

//-----------------------------------------------------------
//-- get board game by categories
//-----------------------------------------------------------
router.get("/board-by-cate", async (req, res, next) => {
  const SESSION_ID = req.sessionId;
  let gmCateIds = [];
  if (req.query?.ids) {
    gmCateIds = req.query.ids
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id) && id !== "");
  }
  const dataLogger = {
    meta: UTILS.generateLogMeta(
      SESSION_ID,
      req.method,
      serviceName,
      "P",
      req.connection.remoteAddress
    ),
    message: `Get board game by categories`,
  };
  try {
    LOGGER.info(dataLogger);

    //-- find account
    const uuid = req.authen?.uuid ?? "NONE";
    const account = await AccountsService.findAccountByUuid(uuid);
    if (!account) {
      return RESPONSE.exception(
        res,
        SESSION_ID,
        messages.errors.accountNotFound
      );
    }

    //-- find group
    const compCode = account.compCode || "NONE";
    const companiesGroup = await GameService.findGroup(compCode);

    //-- find game by group
    let gmBoardIds;
    if (companiesGroup && companiesGroup.length > 0) {
      gmBoardIds = companiesGroup.map((item) => parseInt(item.gmBoardId));
    } else {
      const companiesGroupDefault = await GameService.findGroupByDefault();
      gmBoardIds = companiesGroupDefault.map((item) =>
        parseInt(item.gmBoardId)
      );
    }
    const boardGames = await GameService.getBoardByCategoriesIds(gmBoardIds, gmCateIds);

    RESPONSE.success(
      res,
      SESSION_ID,
      boardGames,
      messages.success.getGameBoardSuccess
    );
  } catch (err) {
    LOGGER.error({ ...dataLogger, message: dataLogger.message + " [ERR]" });
    next(err);
  }
});

//-----------------------------------------------------------
//-- get borad
//-----------------------------------------------------------
router.get("/board-not-rule/:id", async (req, res, next) => {
  const SESSION_ID = req.sessionId;
  const gmBoardId = req.params.id;

  const dataLogger = {
    meta: UTILS.generateLogMeta(
      SESSION_ID,
      req.method,
      serviceName,
      "P",
      req.connection.remoteAddress
    ),
    message: `Get game board`,
  };
  try {
    LOGGER.info(dataLogger);

    const boardGames = await GameService.getAllQuestionsAndAnswers(gmBoardId);

    RESPONSE.success(
      res,
      SESSION_ID,
      boardGames,
      messages.success.getGameBoardSuccess
    );
  } catch (err) {
    LOGGER.error({ ...dataLogger, message: dataLogger.message + " [ERR]" });
    next(err);
  }
});

//-----------------------------------------------------------
//-- get borad options
//-----------------------------------------------------------
router.get("/board/:id", async (req, res, next) => {
  const SESSION_ID = req.sessionId;
  const gmBoardId = req.params.id;

  const dataLogger = {
    meta: UTILS.generateLogMeta(
      SESSION_ID,
      req.method,
      serviceName,
      "P",
      req.connection.remoteAddress
    ),
    message: `Get game board`,
  };
  try {
    LOGGER.info(dataLogger);

    const boardGames = await GameService.getQuestionsAndAnswersByRule(gmBoardId);

    RESPONSE.success(
      res,
      SESSION_ID,
      boardGames,
      messages.success.getGameBoardSuccess
    );
  } catch (err) {
    LOGGER.error({ ...dataLogger, message: dataLogger.message + " [ERR]" });
    next(err);
  }
});

//-----------------------------------------------------------
//-- get history count
//-----------------------------------------------------------
router.get("/history-count", async (req, res, next) => {
  const SESSION_ID = req.sessionId;

  const dataLogger = { meta: UTILS.generateLogMeta(SESSION_ID, req.method, serviceName, "P", req.connection.remoteAddress), message: `count history game`, };
  try {
    LOGGER.info(dataLogger);

    //-- find account
    const uuid = req.authen?.uuid ?? "NONE";
    const account = await AccountsService.findAccountByUuid(uuid);
    if (!account) {
      return RESPONSE.exception(
        res,
        SESSION_ID,
        messages.errors.accountNotFound
      );
    }

    const countHistory = await GameService.getHistoryCount(account.uuidAccount);

    RESPONSE.success(res, SESSION_ID, countHistory);
  } catch (err) {
    LOGGER.error({ ...dataLogger, message: dataLogger.message + " [ERR]" });
    next(err);
  }
});


//-----------------------------------------------------------
//-- create borad game save answer
//-----------------------------------------------------------
router.post("/save-answer", async (req, res, next) => {
  const SESSION_ID = req.sessionId;
  const dataLogger = {
    meta: UTILS.generateLogMeta(
      SESSION_ID,
      req.method,
      serviceName,
      "P",
      req.connection.remoteAddress
    ),
    message: `Save game board answer`,
  };

  try {
    LOGGER.info(dataLogger);
    const uuid = req.authen?.uuid ?? "NONE";
    const account = await AccountsService.findAccount(uuid);

    if (!account) {
      return RESPONSE.exception(
        res,
        SESSION_ID,
        messages.errors.accountNotFound
      );
    }

    const historyAttributes = {
      uuidAccount: account.uuidAccount,
      gmBoardId: req.body?.gmBoardId,
      gmGameFormatKey: req.body?.gmGameFormatKey,
      gmGameLevel: req.body?.gmGameLevel,
      gmScore: req.body?.gmScore,
      gmScoreTotal: req.body?.gmScoreTotal,
      gmTime: req.body?.gmTime,
      gmHisSystem: req.body?.gmHisSystem,
      gmHisRecord: req.body?.gmHisRecord,
      gmHisGameRule: req.body?.gmHisGameRule,
      createdBy: req.authen?.username,
      updatedBy: req.authen?.username,
    };

    //--save history answer
    const saveHistory = await GameService.createHistory(historyAttributes);

    //--find format and find rule limit cale score game
    const format = await GameService.getFormatGameById(historyAttributes.gmBoardId);
    const limitHistoryCaleScore = format.gmRuleGame.limitHistoryCaleScore || 1;

    //--find history answer game
    const historyGames = await GameService.findHisGameByBoardGame(account.uuidAccount, historyAttributes.gmBoardId);
    //--find rank before
    const rankHistory = await RankService.getRankByUuidAccount(account.uuidAccount);
    //--check rule for save cale score
    if (historyGames.length <= limitHistoryCaleScore) {
      //-- cale score 
      const rankScore = rankHistory?.rankScore ? historyAttributes.gmScore + rankHistory?.rankScore : historyAttributes.gmScore;

      const attribsRank = {
        uuidAccount: account.uuidAccount,
        gmBoardId: historyAttributes.gmBoardId,
        rankScore: rankScore,
        rankScoreTotal: rankScore,
        rankDateCalculate: DateTz.dateNow("YYYY-MM-DD"),
        createdBy: req.authen?.username,
        updatedBy: req.authen?.username,
      };
      //--save Rank record
      if (rankHistory) {
        await RankService.updateRankByUuid(account.uuidAccount, attribsRank);
      } else {
        await RankService.createRank(attribsRank);
      }
    }
    else {
      //-- cale score 
      const rankScore = rankHistory?.rankScoreTotal ? historyAttributes.gmScore + rankHistory?.rankScoreTotal : historyAttributes.gmScore;
      const attribsRank = {
        rankScoreTotal: rankScore,
        updatedBy: req.authen?.username,
      };
      await RankService.updateRankByUuid(account.uuidAccount, attribsRank);
    }

    //--find history answer game
    const historyGame = await GameService.findHisGameByBoardGame(account.uuidAccount, historyAttributes.gmBoardId);
    const countHistoryGame = historyGame.length || 0;
    const rank = await RankService.getRankByUuidAccount(account.uuidAccount);

    RESPONSE.success(res, SESSION_ID, { ...saveHistory, rank, countHistoryGame }, messages.success.saveAnswerSuccess);
  } catch (err) {
    LOGGER.error({ ...dataLogger, message: dataLogger.message + " [ERR]" });
    next(err);
  }
});



module.exports = router;
