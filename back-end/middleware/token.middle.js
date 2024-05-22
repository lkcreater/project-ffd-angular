const { Validator } = require('node-input-validator');
const { JwtHelper } = require('../helpers/jwt.helper');
const { AccountsService } = require('../services/account.service');
const messages = require("../commons/message");
const RESPONSE = require('../middleware/response');
const { TempSecretService } = require('../services/temp-secret.service');
const CODE_ERROR_TOKEN = 40300;

//----------------------------------------------------------------
//-- middle for token
//----------------------------------------------------------------
const authenMiddleware = async (req, res, next) => {
    try {

        const SESSION_ID = req.sessionId;
        const validation = new Validator(req.headers, {
            authorization: 'required',
        });
        const matched = await validation.check()
        if (!matched) {
            return RESPONSE.exceptionValidate(res, SESSION_ID, validation.errors);
        }
        const authorizationHeader = req.headers.authorization ?? null;
        if (authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.split(' ')[1];

            const objectJwt = JwtHelper.verifyToken(token);
            if (objectJwt.status == false) {
                return RESPONSE.exception(res, SESSION_ID, {
                    code: CODE_ERROR_TOKEN,
                    message: messages.errors.tokenError
                });
            }

            const uuidAccount = objectJwt?.verify?.uuid || 'NONE';
            const authenAccount = await AccountsService.findAccountAuthenByUuid(uuidAccount);
            if (!authenAccount) {
                return RESPONSE.exception(res, SESSION_ID, {
                    code: CODE_ERROR_TOKEN,
                    message: messages.errors.accountNotFound
                });
            }

            req.authen = {
                ...objectJwt.verify,
                username: authenAccount.accFirstname,
                comp_code: authenAccount.compCode,
            };
        }
        return next();
    } catch (err) {
        next(err);
    }
}

//----------------------------------------------------------------
//-- middle for temp secret authen
//----------------------------------------------------------------
const authenMiddlewareTemp = async (req, res, next) => {
    try {

        const SESSION_ID = req.sessionId;
        const validation = new Validator(req.headers, {
            authorization: 'required',
        });
        const matched = await validation.check()
        if (!matched) {
            return RESPONSE.exceptionValidate(res, SESSION_ID, validation.errors);
        }
        const authorizationHeader = req.headers.authorization ?? null;
        if (authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.split(' ')[1];

            const objectJwt = JwtHelper.verifyToken(token);
            if (objectJwt.status == false) {
                return RESPONSE.exception(res, SESSION_ID, {
                    code: CODE_ERROR_TOKEN,
                    message: messages.errors.tokenError
                });
            }

            //-- delete temp expired
            await TempSecretService.deleteTempExpire();

            //-- check temp token
            const uuidTemp = objectJwt?.verify?.uuid || 'NONE';
            const tempToken = await TempSecretService.findTempByUUID(uuidTemp);
            if (!tempToken) {
                return RESPONSE.exception(res, SESSION_ID, {
                    code: CODE_ERROR_TOKEN,
                    message: messages.errors.secretTempExpired
                });
            }
            req.temp = objectJwt.verify;
        }
        return next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    authenMiddleware,
    authenMiddlewareTemp
};
