const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "GameUserHistory",
    tableName: "game_user_history",
    columns: {
        gmHisId: {
            type: "int",
            primary: true,
            generated: true,
            name: "gm_his_id"
        },
        uuidAccount: {
            type: "varchar",
            length: 250,
            name: "uuid_account"
        },
        gmBoardId: {
            type: "int",
            name: "gm_board_id"
        },
        gmGameFormatKey: {
            type: "varchar",
            length: 150,
            nullable: true,
            name: "gm_game_format_key"
        },
        gmGameLevel: {
            type: "int",
            name: "gm_game_level"
        },
        gmScore: {
            type: "int",
            name: "gm_score"
        },
        gmScoreTotal: {
            type: "int",
            default: 0,
            name: "gm_score_total"
        },
        gmTime: {
            type: "int",
            nullable: true,
            name: "gm_time"
        },
        gmHisSystem: {
            type: "jsonb",
            nullable: true,
            name: "gm_his_system"
        },
        gmHisRecord: {
            type: "jsonb",
            nullable: true,
            name: "gm_his_record"
        },
        gmHisGameRule: {
            type: "jsonb",
            nullable: true,
            name: "gm_his_game_rule"
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
