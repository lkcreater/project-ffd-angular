const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "SysTempSecret",
    tableName: "sys_temp_secret", // Assuming table name is 'sys_temp_secret'
    columns: {
        tempId: {
            primary: true,
            type: "int8",
            generated: true,
            name: "temp_id"
        },
        tempUuid: {
            type: "varchar",
            length: 250,
            nullable: false,
            name: "temp_uuid"
        },
        tempType: {
            type: "varchar",
            length: 100,
            nullable: true,
            name: "temp_type"
        },
        tempLog: {
            type: "jsonb",
            nullable: true,
            name: "temp_log"
        },
        tempTimestamp: {
            type: "timestamp",
            createDate: true,
            name: "temp_timestamp"
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