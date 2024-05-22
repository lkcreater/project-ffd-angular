const router = require("express").Router();
const {
  authenMiddleware,
  authenMiddlewareTemp,
} = require("../../../middleware/token.middle");

router.use(require("../../../middleware/id-token-info"));

router.use("/accounts", authenMiddleware, require("./accounts"));
router.use("/authen", require("./authen"));
router.use("/consent", authenMiddleware, require("./consent"));
router.use("/term", require("./term-and-condition"));
router.use("/line-chanel", require("./line-chanel"));
router.use("/companies", require("./companies"));
router.use("/history-pwd", require("./history-pwd"));
router.use("/require", require("./require"));
router.use("/upload", authenMiddleware, require("./upload"));
router.use("/files", require("./files"));
router.use("/config", require("./config"));
router.use("/health-check", authenMiddleware, require("./health-check"));
router.use("/content", require("./content"));
router.use("/game", authenMiddleware, require("./game"));
router.use("/rank", authenMiddleware, require("./rank"));
router.use("/demo", require("./demo"));

module.exports = router;
