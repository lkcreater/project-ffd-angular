const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "GameGroup",
    tableName: "game_groups",
    columns: {
        gaGroupId: {
            type: "int",
            primary: true,
            generated: true,
            name: "ga_group_id"
        },
        compCode: {
            type: "varchar",
            length: 150,
            nullable: true,
            name: "comp_code"
        },
        gmBoardId: {
            type: "int",
            name: "gm_board_id"
        },
        isDefault: {
            type: "boolean",
            default: false,
            name: "is_default"
        },
        active: {
            type: "boolean",
            default: true,
            name: "active"
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
        }
    },
});
