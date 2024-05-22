const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "SysOtpHistory",
    tableName: "sys_otp_history",
    columns: {
        otpHisId: {
            type: "int",
            primary: true,
            generated: true,
            name: "otp_his_id"
        },
        otpHisAction: {
            type: "varchar",
            length: 100,
            name: "otp_his_action"
        },
        otpHisType: {
            type: "varchar",
            length: 100,
            name: "otp_his_type"
        },
        otpHisInput: {
            type: "varchar",
            length: 255,
            name: "otp_his_input"
        },
        otpHisSecret: {
            type: "varchar",
            length: 255,
            name: "otp_his_secret",
            nullable: true
        },
        otpHisPac: {
            type: "varchar",
            length: 100,
            name: "otp_his_pac",
            nullable: true
        },
        otpHisTime: {
            type: "timestamp",
            name: "otp_his_time"
        },
        otpHisIsValid: {
            type: "boolean",
            nullable: true,
            default: null,
            name: "otp_his_is_valid"
        },
        active: {
            type: "boolean",
            default: true,
            name: "active"
        },
        createdBy: {
            type: "varchar",
            length: 255,
            nullable: true,
            name: "created_by"
        },
        updatedBy: {
            type: "varchar",
            length: 255,
            nullable: true,
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
    }
});
