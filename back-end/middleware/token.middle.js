const { Validator } = require('node-input-validator');
const { JwtHelper } = require('../helpers/jwt.helper');
const { AccountsService } = require('../services/account.service');

const RESPONSE = require('../middleware/response');
const { TempSecretService } = require('../services/temp-secret.service');

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
            return RESPONSE.exceptionVadidate(res, SESSION_ID, validation.errors);
        }
        const authorizationHeader = req.headers.authorization ?? null;
        if (authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.split(' ')[1];

            const objectJwt = JwtHelper.verifyToken(token);
            if (objectJwt.status == false) {
                return RESPONSE.exceptionVadidate(res, SESSION_ID, 'token error');
            }

            const uuidAccount = objectJwt?.verify?.uuid || 'NONE';
            const authenAccount = await AccountsService.findAccountAuthenByUuid(uuidAccount);
            if (!authenAccount) {
                return RESPONSE.exceptionVadidate(res, SESSION_ID, 'account not found!');
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
            return RESPONSE.exceptionVadidate(res, SESSION_ID, validation.errors);
        }
        const authorizationHeader = req.headers.authorization ?? null;
        if (authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.split(' ')[1];

            const objectJwt = JwtHelper.verifyToken(token);
            if (objectJwt.status == false) {
                return RESPONSE.exceptionVadidate(res, SESSION_ID, 'token error');
            }

            //-- delete temp expired
            await TempSecretService.deleteTempExpire();

            //-- check temp token
            const uuidTemp = objectJwt?.verify?.uuid || 'NONE';
            const tempToken = await TempSecretService.findTempByUUID(uuidTemp);
            if (!tempToken) {
                return RESPONSE.exceptionVadidate(res, SESSION_ID, 'secret temp expired');
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
