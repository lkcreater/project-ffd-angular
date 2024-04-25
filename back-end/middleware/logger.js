const { LogSingleton } = require('loglib-nodejs');
const environment = require('../configuration');
const chalk = require('chalk');
const config = {
    ENGINE_NAME: 'FinancialFreedomEngine',
    LOG_TO_CONSOLE: false,
    LOG_PATH: environment.log?.path || './log'
};
const logLevel = environment.log.level;
let log = console;
if(environment.log?.enable == 'true') {
    LogSingleton.setup(config);
    log = LogSingleton.getLog();
    LogSingleton.setLogLevel(LogSingleton.LogLevel[logLevel]);
}

module.exports = {
    debug: data => {
        var dt = new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '')
        try {
            log.debug(
                data.message,
                data.meta !== undefined
                    ? data.meta
                    : null
            );
            // console.log(chalk.greenBright(dt), chalk.blueBright("[DEBUG] : ", data.message));

        } catch (error) {
            console.log(error)
            if (error instanceof ReferenceError) {
                // Handle error as necessary
            } else {
                console.log("ooo")
            }
        }
    },
    info: data => {
        var dt = new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '')
        log.info(
            data.message,
            data.meta !== undefined
                ? data.meta
                : null
        );
        // console.log(chalk.greenBright(dt), chalk.green("[INFO] : ", data.message));
    },
    error: data => {
        var dt = new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '')
        log.error(
            data.message,
            data.meta !== undefined
                ? data.meta
                : null
        );
        // console.log(chalk.greenBright(dt), chalk.red("[ERROR] : ", data.message));
    }
};
