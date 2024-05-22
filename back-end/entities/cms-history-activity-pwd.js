const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "CmsHistoryActivityPwd",
    tableName: "cms_history_activity_pwd",
    columns: {
        pwdAtId: {
            type: "int",
            primary: true,
            generated: true,
            name: "pwd_at_id"
        },
        pwdAtHash: {
            type: "varchar",
            length: 255,
            name: "pwd_at_hash",
            nullable: true,
        },
        pwdAtInput: {
            type: "varchar",
            length: 250,
            name: "pwd_at_input"
        },
        pwdAtTime: {
            type: "timestamp",
            name: "pwd_at_time"
        },
        pwdResult: {
            type: "boolean",
            nullable: true,
            name: "pwd_result"
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
        }
    },
});