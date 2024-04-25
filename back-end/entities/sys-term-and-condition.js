const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "SysTermAndCondition",
    tableName: "sys_term_and_conditions", // Assuming table name is 'sys_term_and_conditions'
    columns: {
        condiId: {
            primary: true,
            type: "int",
            generated: true,
            name: "condi_id"
        },
        condiTopic: {
            type: "varchar",
            length: 255,
            name: "condi_topic"
        },
        condiVersion: {
            type: "varchar",
            length: 100,
            name: "condi_version"
        },
        condiText: {
            type: "text",
            name: "condi_text"
        },
        condiPrivacyNotice: {
            type: "text",
            nullable: true,
            name: "condi_privacy_notice"
        },
        condiOption: {
            type: "jsonb",
            name: "condi_option"
        },
        active: {
            type: "boolean",
            name: "active",
            default: true,
        },
        createdBy: {
            type: "varchar",
            length: 255,
            name: "created_by"
        },
        updatedBy: {
            type: "varchar",
            length: 255,
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
