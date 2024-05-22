// authenticationService.js
const db = require("../commons/typeorm");
const { DateTz } = require("../helpers/date-tz.helper");
const { ELoginPlatform, ELoginStatus } = require("./authen.service");
const { HistoryPwdService } = require("./history-pwd.service");
const env = require('../configuration');

const LOGGER = require('../middleware/logger');
const historyPwdService = require("./history-pwd.service");

class AccountsService {
  setPicture(picture) {
    return {
      object: picture?.object || "LINE",
      newName: picture?.newName || "",
      originalName: picture?.originalName || "",
      type: picture?.type || "",
      size: picture?.size || null,
      fileUrl: picture?.fileUrl || "",
    };
  }

  async findAccountByUuid(uuid) {
    try {
      const data = await db.connection
        .getRepository("CmsAccount")
        .createQueryBuilder("account")
        .leftJoinAndSelect("account.chanelLogin", "login")
        .where(
          ` 
            account.uuid_account = :uuid AND 
            account.active = :isActive AND 
            login.active = :isActive AND 
            login.status IN (:...logStatus)
          `,
          {
            uuid: uuid,
            isActive: true,
            logStatus: [
              ELoginStatus.DONE,
              ELoginStatus.LOCK_PWD,
              ELoginStatus.BLOCK,
            ],
          }
        )
        .getOne();

      return data;
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async getAccountByUuid(uuid) {
    try {
      return await db.connection
        .getRepository("CmsAccount")
        .findOne({ where: { uuidAccount: uuid } });
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async findAccount(uuid) {
    try {
      return await db.connection.getRepository("CmsAccount").findOne({
        where: {
          uuidAccount: uuid,
          active: true,
        },
      });
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async updateAccountById(id, attribs) {
    try {
      return await db.connection.getRepository("CmsAccount").update(
        {
          accId: id,
        },
        attribs
      );
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async getConnectLine(uuid) {
    try {
      return await db.connection
        .getRepository("CmsLogin")
        .createQueryBuilder()
        .where(
          "uuid_account = :uuid and active = :isActive and login_platform = :loginPlatform and status not in (:...status)",
          {
            uuid: uuid,
            isActive: true,
            loginPlatform: ELoginPlatform.LINE,
            status: [ELoginStatus.DISCONNECT]
          }
        )
        .getOne();
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async saveConsentLine(loginId, body) {
    try {
      return await db.connection.getRepository("CmsLogin").update(
        {
          id: loginId,
        },
        {
          targetConsentCode: body.ffdTargetConsentCode,
          targetConsentVersion: body.ffdTargetConsentVersion,
          acceptStatus: body.option,
        }
      );
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async findAccountAuthenByUuid(uuid) {
    try {
      return await db.connection
        .getRepository("CmsAccount")
        .createQueryBuilder("account")
        .select([
          "account.compCode",
          "account.uuidAccount",
          "account.accFirstname",
        ])
        .where("account.uuid_account = :uuid and account.active = :isActive", {
          uuid: uuid,
          isActive: true,
        })
        .getOne();
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async disconnectChanelLogin(loginId) {
    try {
      //-- update password
      return await db.connection.getRepository("CmsLogin").update(
        {
          id: loginId,
        },
        {
          status: ELoginStatus.DISCONNECT,
        }
      );
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async lockPassword(loginId) {
    try {
      //-- update password
      return await db.connection.getRepository("CmsLogin").update(
        {
          id: loginId,
        },
        {
          status: ELoginStatus.LOCK_PWD,
        }
      );
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async clearPasswordByID(id, username) {
    return await this.updateAccountById(id, {
      accPassword: null,
      updatedBy: username,
    });
  }

  async createAccountAndChanelLogin(attribsAccount, attribsLogin) {
    let isInsert = false;

    const queryRunner = db.connection.createQueryRunner();
    //-- start transaction
    await queryRunner.startTransaction();
    try {
      //-- repo create account
      await queryRunner.manager
        .getRepository("CmsAccount")
        .save(attribsAccount);

      //-- repo create login
      await queryRunner.manager.getRepository("CmsLogin").save(attribsLogin);

      //-- save history PWD
      if (
        [ELoginPlatform.EMAIL, ELoginPlatform.PHONE].includes(
          attribsLogin.loginPlatform
        ) &&
        attribsAccount?.uuidAccount &&
        attribsAccount?.accPassword
      ) {
        const queryHistoryPwd =
          queryRunner.manager.getRepository("CmsHistoryPwd");
        const attribsHistoryPwd = queryHistoryPwd.create({
          uuidAccount: attribsAccount.uuidAccount,
          pwdHash: attribsAccount.accPassword,
          pwdDate: DateTz.dateNow("YYYY-MM-DD"),
          createdBy: attribsAccount.createdBy,
          updatedBy: attribsAccount.updatedBy,
        });
        await queryHistoryPwd.save(attribsHistoryPwd);
      }

      //-- commit transaction now:
      await queryRunner.commitTransaction();
      isInsert = true;
    } catch (error) {
      LOGGER.error(error);
      console.error(error);
      //-- rollback transaction now
      await queryRunner.rollbackTransaction();
    } finally {
      //-- end transaction
      await queryRunner.release();
    }

    return isInsert;
  }

  async changePassword(uuid, body) {
    try {
      //-- update password
      const result = await db.connection.getRepository("CmsAccount").update(
        {
          uuidAccount: uuid,
        },
        {
          accPassword: body.hash,
          updatedBy: body.username,
        }
      );

      if(result) {
        await db.connection.getRepository("CmsLogin").update(
          {
            uuidAccount: uuid,
          },
          {
            status: ELoginStatus.DONE,
          }
        );

        //-- clear history log
        await HistoryPwdService.clearActivityAuthenPwdByHash(uuid);
      }

      //-- save history PWD
      await HistoryPwdService.saveHistoryPwd(uuid, body);

      return result;
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async connectLogin(uuid, { loginData, loginPlatform, lineClientId }, username) {
    try {
      const clientId = lineClientId ?? null;
      return await db.connection.getRepository("CmsLogin").save({
        uuidAccount: uuid,
        loginData,
        loginPlatform,
        lineClientId: clientId,
        createdBy: username || null,
        updatedBy: username || null
      });
    } catch (error) {
      LOGGER.error(error);
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }

  async createHistory(attribsHistory) {
    try {
      const otpHistoryRepository = db.connection.getRepository('SysOtpHistory');
      const newOtpHistory = otpHistoryRepository.create(attribsHistory);
      const timeDuration = env.FFD_OTP_BLOCK_DURATION_MINUTES;
      
      await db.connection.getRepository('SysOtpHistory')
        .createQueryBuilder()
        .insert()
        .values({
          ...attribsHistory,
          otpHisTime: () => `NOW() + interval '${timeDuration} minutes'`
        })
        .execute();

      //-- update history old
      await db.connection.getRepository('SysOtpHistory')
      .createQueryBuilder()
      .update()
      .set({
        otpHisTime: () => `NOW() + interval '${timeDuration} minutes'`
      })
      .where('active = true AND otp_his_action = :otpHisAction AND otp_his_type = :otpHisType AND otp_his_input = :otpHisInput', 
      { 
        otpHisAction: attribsHistory.otpHisAction, 
        otpHisType: attribsHistory.otpHisType,
        otpHisInput: attribsHistory.otpHisInput,
        //otpHisSecret: attribsHistory.otpHisSecret
      })
      .execute();

      //-- verify otp pass
      if(attribsHistory?.otpHisIsValid == true) {
        await db.connection.getRepository('SysOtpHistory')
        .createQueryBuilder()
        .delete() //.update().set({ active: false })
        .where('active = true AND otp_his_type = :otpHisType AND otp_his_input = :otpHisInput', 
        { 
          otpHisType: attribsHistory.otpHisType,
          otpHisInput: attribsHistory.otpHisInput,
        })
        .execute();
      }

      return newOtpHistory;
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async FindHistoryOtp(attribsHistory, isAll = false) {
    try {
      const otpHisAction = attribsHistory.otpHisAction;
      const otpHisInput = attribsHistory.otpHisInput;

      const otpHistoryRepository = db.connection.getRepository('SysOtpHistory').createQueryBuilder('otpHis');
      otpHistoryRepository.where('otpHis.active = true AND otpHis.otpHisInput = :otpHisInput ', 
      { 
        otpHisInput,
        otpHisType: attribsHistory.otpHisType,
      });

      if(isAll == false) {
        otpHistoryRepository.andWhere('otpHis.otpHisAction = :otpHisAction', {
          otpHisAction,
        });
      }

      otpHistoryRepository.orderBy('otpHis.otpHisId','DESC');
      return await otpHistoryRepository.getRawMany();

    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async clearHistoryOTP() {
    try {
      const timeDuration = env.FFD_OTP_BLOCK_DURATION_MINUTES;
      return await db.connection.getRepository('SysOtpHistory')
        .createQueryBuilder()
        .delete() //.update().set({ active: false})
        .where(`NOW() > otp_his_time and active = true`)
        .execute()
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }

  async lockPasswordByUuid(uuid) {
    try {
      //-- update password
      return await db.connection.getRepository("CmsLogin").update(
        {
          uuidAccount: uuid,
        },
        {
          status: ELoginStatus.LOCK_PWD,
        }
      );
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error?.message);
    }
  }
}

module.exports = { AccountsService: new AccountsService() };
