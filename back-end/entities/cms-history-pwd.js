const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "CmsHistoryPwd",
    tableName: "cms_history_pwds", // Assuming table name is 'cms_history_pwds'
    columns: {
        pwdId: {
            primary: true,
            type: "int",
            generated: true,
            name: "pwd_id"
        },
        uuidAccount: {
            type: "varchar",
            length: 250,
            nullable: false,
            name: "uuid_account"
        },
        pwdHash: {
            type: "varchar",
            length: 255,
            nullable: false,
            name: "pwd_hash"
        },
        pwdDate: {
            type: "date",
            nullable: false,
            name: "pwd_date"
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

