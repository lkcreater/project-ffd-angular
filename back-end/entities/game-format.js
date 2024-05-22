const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "GameFormat",
    tableName: "game_format",
    columns: {
        gmFormId: {
            type: "int",
            primary: true,
            generated: true,
            name: "gm_form_id"
        },
        order: {
            type: "int",
            name: "order"
        },
        gmFormImage: {
            type: "jsonb",
            nullable: true,
            name: "gm_form_image"
        },
        gmFormName: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "gm_form_name"
        },
        gmFormDetail: {
            type: "text",
            nullable: true,
            name: "gm_form_detail"
        },
        gmRuleGame: {
            type: "jsonb",
            nullable: true,
            name: "gm_rule_game"
        },
        gmRulePoint: {
            type: "jsonb",
            nullable: true,
            name: "gm_rule_point"
        },
        gmRuleReward: {
            type: "jsonb",
            nullable: true,
            name: "gm_rule_reward"
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
    relations: {
        board: {
            type: "one-to-one",
            target: "GameBoard",
            inverseSide: "format",
            createForeignKeyConstraints: false,
            cascade: false,
            joinColumn: {
                name: "gm_form_id",
                referencedColumnName: "gmFormId"
            }
        }
    }
});
