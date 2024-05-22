const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "SysChanelLine",
    tableName: "sys_chanel_line", // Assuming table name is 'sys_ffd_consents'
    columns: {
        chanelId: {
            primary: true,
            type: "int8",
            generated: true,
            name: "chanel_id"
        },
        order: {
            type: "int",
            name: "order",
            default: 0,
        },
        ffdBusinessConsentGroup: {
            type: "int",
            name: "ffd_business_consent_group"
        },
        ffdExecutionApplication: {
            type: "int",
            name: "ffd_execution_application"
        },
        lineClientId: {
            type: "varchar",
            length: 150,
            nullable: true,
            default: null,
            name: "line_client_id"
        },
        chanelClientSecret: {
            type: "varchar",
            length: 250,
            nullable: true,
            default: null,
            name: "chanel_client_secret"
        },
        chanelLiffId: {
            type: "varchar",
            length: 150,
            nullable: true,
            default: null,
            name: "chanel_liff_id"
        },
        chanelLabel: {
            type: "varchar",
            length: 200,
            nullable: true,
            default: null,
            name: "chanel_label"
        },
        chanelIcon: {
            type: "jsonb",
            nullable: true,
            name: "chanel_icon"
        },
        chanelCallBack: {
            type: "varchar",
            length: 250,
            nullable: true,
            default: null,
            name: "chanel_call_back"
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
    },
});