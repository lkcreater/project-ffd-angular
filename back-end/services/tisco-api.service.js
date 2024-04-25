// authenticationService.js
const { default: axios } = require("axios");
const { ELoginPlatform } = require("./authen.service");
const env = require('../configuration');
const LOGGER = require('../middleware/logger');
const constrant = require('../commons/constrant');
const config = {
    host_api: env.FFD_API_HOST,
    user_id: env.FFD_API_USER_ID,
    user_name: env.FFD_API_USER_NAME,
    state: env.FFD_API_STATE,
    client_id: env.FFD_API_CLIENT_ID,
    client_secret: env.FFD_API_CLIENT_SECRET,
    verify_member: env.FFD_PATH_API_VERIFY_MEMBER,
    consent: env.FFD_PATH_API_CONSENT,
    otp: env.FFD_PATH_API_OTP,
    x_channel_id: env.FFD_X_CHANNEL_ID,
    reference_name: env.FFD_REFERENCE_NAME,
    policy_name: env.FFD_OTP_POLICY_NAME,
    templateId : { sms: env.FFD_OTP_TEMPLATE_ID_SMS, email: env.FFD_OTP_TEMPLATE_ID_EMAIL },
    notiType : { sms: env.FFD_OTP_NOTITYPE_SMS, email: env.FFD_OTP_NOTITYPE_EMAIL}
}

class TiscoApiService {

    _urlVerifyTisco = `${config.host_api}${config.verify_member}`;
    _urlConsent = `${config.host_api}${config.consent}`;
    _urlOtp = `${config.host_api}${config.otp}`;
    _testOtp = {
        pac: '37ABE',
        token_uuid: '1111111-2222-3333-4444-abcdef789012',
        test_phone: '023',
        test_email: '3wJVRPHoGA',
        test_otp: '329759',
    };

    headerConfig(logSessionId) {
        const metaOption = {
            user_id: config.user_id,
            user_name: config.user_name,
            request_datetime: new Date().toLocaleString(),
            log_session_id: logSessionId,
            sub_state: '',
            app_code: config.x_channel_id,
            ip: '',
        };
        return {
            'Content-Type': 'application/json',
            'app-meta': JSON.stringify(metaOption),
            client_id: config.client_id,
            client_secret: config.client_secret,
            'X-Channel-Id': config.x_channel_id,
        };
    }

    async getVersionConsentTisco(idNo, passwordNo, business_consent_group = 1, execution_application = 274, req) {
        try {
            const url = `${this._urlConsent}checkConsentAcceptanceMaster`;
            const body = {
                id_no: idNo,
                password_no: passwordNo,
                business_consent_group: business_consent_group,
                execution_application: execution_application,
                data_controller: [],
                data_processor: [],
            };
            const res = await axios.post(url, body, { headers: this.headerConfig(req.sessionId) });
            if (res.status == 200) {
                return res.data;
            }
            return null
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async getConsentTisco(
        businessConsentGroup,
        executionApplication,
        req
    ) {
        try {
            const url = `${this._urlConsent}getConsentContent`;
            const body = {
                business_consent_group: businessConsentGroup,
                execution_application: executionApplication,
            };
            const res = await axios.post(url, body, { headers: this.headerConfig(req.sessionId) });
            if (res.status == 200) {
                return res.data;
            }
            return null
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async saveMember(account, accountLine, consent, adapterLine, req) {
        try {
            const url = `${this._urlConsent}createUpdateConsentAcceptanceTransaction`;
            const body = {
                id_no: `${adapterLine.idNo}`,
                passport_no: `${adapterLine.passwordNo}`,
                cust_type: 1,
                first_name: `${account.accFirstname}`,
                middle_name: '',
                last_name: `${account.accLastname}`,
                execution_application: consent.ffdExecutionApplication,
                data_processor: '',
                data_controller: '',
                sub_controller: '',
                app_data_code: '',
                app_ref_no: '',
                consent_id: consent.ffdTargetConsentId,
                consent_code: `${consent.ffdTargetConsentCode}`,
                consent_version: `${consent.ffdTargetConsentVersion}`,
                accept_status: accountLine.acceptStatus,
                product_type: consent.ffdTargetProductType,
                consent_ref: '',
                consent_date: 0,
                expiry_date: 0
            };
            const res = await axios.post(url, body, { headers: this.headerConfig(req.sessionId) });
            if (res.status == 200) {
                return res.data;
            }
            return null
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async verifyMember(line_uid, req) {
        try {
            const url = `${this._urlVerifyTisco}`;
            const body = {
                line_uid: `${line_uid}`,
            };
            const res = await axios.post(url, body, {
                headers: this.headerConfig(req.sessionId)
            });
            if (res.status == 200) {
                return res.data;
            }
            return null
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }
    async revokeSendingOtp(token_uuid) {
        try {
            const url = `${this._urlOtp}revokeOTP`;
            const body = {
                data: {
                    token_uuid: token_uuid,
                },
            };
            const res = await axios.post(url, body, { headers: this.headerConfig() });
            if (res.status == 200) {
                return res.data;
            }
            return null
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async callSendingOtp(type, input, sessionId) {
        try {
            const test = this.istestSendingOtp(type, input);
            if (test.isTest) {
                delete test.isTest;
                return {
                    data: test,
                };
            }
            const url = `${this._urlOtp}sendOTP`;
            const body = this.getBodyOtpSettings(type, input);
            const res = await axios.post(url, body, { headers: this.headerConfig(sessionId) });
            if (res.status == 200) {
                return res.data;
            }
            return null
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    async verifySendingOtp(req = { otp, secret }) {
        try {
            const test = this.verifyTestSendingOtp(req.otp, req.secret);
            if (test) {
                return {
                    meta: {
                        isTest: true,
                        response_code: '20000',
                        response_desc: 'Success',
                    },
                };
            }

            const url = `${this._urlOtp}verifyOTP`;
            const body = {
                data: {
                    otp: req.otp,
                    token_uuid: req.secret,
                },
            };
            const res = await axios.post(url, body, { headers: this.headerConfig() });
            if (res.status == 200) {
                return res.data;
            }
            return null
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    getBodyOtpSettings(type, input) {
        if (![ELoginPlatform.EMAIL, ELoginPlatform.PHONE].includes(type)) {
            throw Error('Invalid type');
        }

        let template_id;
        let noti_type;
        let send_to;
        const templateId = config.templateId;
        const notiType = config.notiType;

        if (type == ELoginPlatform.PHONE) {
            template_id = templateId.sms;
            noti_type = Number(notiType.sms);
            send_to = {
                mobile_no: [`${input.replace(/^0/, '66')}`],
            };
        } else {
            template_id = templateId.email;
            noti_type = Number(notiType.email);
            send_to = {
                recipient: [`${input}`],
            };
        }
        return {
            data: {
                template_id: template_id,
                noti_type: [
                    noti_type
                ],
                application_code: config.x_channel_id,
                template_data: [
                    {
                        send_to: send_to,
                        reference_name: [config.reference_name],
                    },
                ],
                otp: {
                    policy_name: config.policy_name,
                    auto_detect_variable: true,
                },
            },
        };
    }

    istestSendingOtp(type, input) {
        if (![ELoginPlatform.EMAIL, ELoginPlatform.PHONE].includes(type)) {
            throw Error('Invalid type');
        }
        const pac = this._testOtp.pac;
        const token_uuid = this._testOtp.token_uuid;

        if (
            type == ELoginPlatform.PHONE &&
            input.startsWith(this._testOtp.test_phone)
        ) {
            return {
                isTest: true,
                pac: pac,
                token_uuid: token_uuid,
            };
        }

        const pattern = /^[\w-]+@(\w+)(\.\w+)+$/;
        const match = input.match(pattern);
        if (
            type == ELoginPlatform.EMAIL &&
            match &&
            match[1] === this._testOtp.test_email
        ) {
            return {
                isTest: true,
                pac: pac,
                token_uuid: token_uuid,
            };
        }

        return {
            isTest: false,
            pac: pac,
            token_uuid: token_uuid,
        };
    }

    verifyTestSendingOtp(otp, secret) {
        if (otp == this._testOtp.test_otp && secret == this._testOtp.token_uuid) {
            return true;
        }
        return false;
    }

}

module.exports = { TiscoApiService: new TiscoApiService() };
