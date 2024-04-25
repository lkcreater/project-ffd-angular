

// authenticationService.js
const db = require('../commons/typeorm');
const { SecretHelper } = require('../helpers/secret.helper');
const bcrypt = require('bcryptjs');
const { DateTz } = require('../helpers/date-tz.helper');

const LOGGER = require('../middleware/logger');

const EActionRequest = {
    AUTHEN: 'FFD_AUTHEN',
    AUTHEN_CONFIRM: 'AUTHEN_CONFIRM',
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
    LOCK_PWD: 'LOCK_PWD',
    CHECK_MEMBER: 'CHECK_MEMBER',
    AUTHEN_LINE: 'AUTHEN_LINE',
    AUTHEN_WEB: 'AUTHEN_WEB',
    VERIFY: 'VERIFY',
    OTP: 'OTP',
};

const ELoginPlatform = {
    LINE: 'LINE',
    PHONE: 'PHONE',
    EMAIL: 'EMAIL',
    NONE: 'NONE'
};

const ELoginStatus = {
    DONE: 'DONE',
    BLOCK: 'BLOCK',
    DISCONNECT: 'DISCONNECT',
    LOCK_PWD: 'LOCK_PWD'
};


class AuthenService {

    async getVerifyLogin(userName) {
        try {
            return await db.connection.getRepository('CmsLogin')
                .createQueryBuilder()
                .where(
                    'login_platform in (:...platform) and status in (:...status) and active = :active',
                    {
                        platform: [ELoginPlatform.EMAIL, ELoginPlatform.PHONE],
                        status: [ELoginStatus.DONE, ELoginStatus.LOCK_PWD],
                        active: true,
                    },
                )
                .andWhere('login_data = :userName', {
                    userName: userName,
                })
                .getOne();
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async setUpdateSecretKey(LogInId, secret) {
        try {
            return await db.connection.getRepository('CmsLogin')
                .createQueryBuilder()
                .update()
                .set({
                    loginSecret: secret,
                })
                .where('id = :id', { id: LogInId })
                .returning('*')
                .execute();
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async findLineConnect(dataId, by = 'uuid') {
        try {
            if (!['uuid', 'lineId'].includes(by)) {
                throw new Error(error?.message);
            }
            let attribs;
            let isFind = false;
            if (by == 'uuid') {
                isFind = true;
                attribs = { uuidAccount: dataId };
            }

            if (by == 'lineId') {
                isFind = true;
                attribs = { loginData: dataId };
            }

            if (isFind == false) {
                return null;
            }

            return await db.connection.getRepository('CmsLogin').findOne({
                where: {
                    ...attribs,
                    loginPlatform: ELoginPlatform.LINE,
                    status: ELoginStatus.DONE,
                    active: true,
                },
            });
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async updateLatestLogin(LogInId) {
        try {
            return await db.connection.getRepository('CmsLogin')
                .createQueryBuilder()
                .update()
                .set({
                    lastLogin: DateTz.dateNow(),
                })
                .where('id = :id', { id: LogInId })
                .returning('*')
                .execute();
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async comparePassword(hash, password) {
        const getPlanText = SecretHelper.getText(password);
        return await bcrypt.compare(getPlanText, hash);
    }

    async updatLoginById(id, attribs) {
        try {
            return await db.connection.getRepository("CmsLogin").update(
                {
                    id: id,
                },
                attribs
            );
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

}

module.exports = {
    EActionRequest, ELoginPlatform, ELoginStatus, AuthenService: new AuthenService()
};
