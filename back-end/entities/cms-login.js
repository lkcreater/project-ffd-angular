const { ELoginPlatform, ELoginStatus } = require("../services/authen.service");

const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "CmsLogin",
    tableName: "cms_logins", // Assuming table name is 'cms_logins'
    columns: {
        id: {
            primary: true,
            type: "int8",
            generated: true,
            name: "id"
        },
        uuidAccount: {
            type: "varchar",
            length: 255,
            nullable: false,
            name: "uuid_account"
        },
        loginPlatform: {
            type: "enum",
            enum: ELoginPlatform,
            default: ELoginPlatform.NONE,
            name: "login_platform"
        },
        loginData: {
            type: "varchar",
            length: 255,
            nullable: true,
            name: "login_data"
        },
        loginVerify: {
            type: "int",
            default: 0, // 0 ค่าเริ่มต้น 1 connect 2 not connect
            name: "login_verify"
        },
        loginSecret: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "login_secret"
        },
        lineClientId: {
            type: "varchar",
            length: 150,
            nullable: true,
            default: null,
            name: "line_client_id"
        },
        targetConsentCode: {
            type: "varchar",
            length: 100,
            nullable: true,
            name: "target_consent_code"
        },
        targetConsentVersion: {
            type: "varchar",
            length: 100,
            nullable: true,
            name: "target_consent_version"
        },
        acceptStatus: {
            type: "int",
            default: 0,
            name: "accept_status"
        },
        status: {
            type: "enum",
            enum: ELoginStatus,
            default: ELoginStatus.DONE,
            name: "status"
        },
        isDefault: {
            type: "boolean",
            default: false,
            name: "is_default"
        },
        isLineLiff: {
            type: "boolean",
            default: false,
            name: "is_line_liff"
        },
        active: {
            type: "boolean",
            default: true,
            name: "active"
        },
        lastLogin: {
            type: "timestamp",
            nullable: true,
            default: null,
            name: "last_login"
        },
        createdBy: {
            type: "varchar",
            length: 255,
            nullable: true,
            default: null,
            name: "created_by"
        },
        updatedBy: {
            type: "varchar",
            length: 255,
            nullable: true,
            default: null,
            name: "updated_by"
        },
        createdDatetime: {
            type: "timestamp with time zone",
            createDate: true,
            name: "created_datetime"
        },
        updatedDatetime: {
            type: "timestamp with time zone",
            updateDate: true,
            name: "updated_datetime"
        },
    },
    relations: {
        account: {
            type: "many-to-one",
            target: "CmsAccount",
            inverseSide: 'chanelLogin',
            joinColumn: {
                name: "uuid_account",
                referencedColumnName: "uuidAccount"
            }
        }
    }
});


