const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "GameQuestion",
    tableName: "game_questions",
    columns: {
        gmQuestId: {
            type: "int",
            primary: true,
            generated: true,
            name: "gm_quest_id"
        },
        gmBoardId: {
            type: "int",
            nullable: true,
            name: "gm_board_id"
        },
        order: {
            type: "int",
            default: 0,
            name: "order"
        },
        gmQuestLevel: {
            type: "int",
            name: "gm_quest_level"
        },
        gmQuestSlug: {
            type: "varchar",
            length: 150,
            nullable: true,
            name: "gm_quest_slug"
        },
        gmQuestImage: {
            type: "jsonb",
            nullable: true,
            name: "gm_quest_image"
        },
        gmQuestTitle: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "gm_quest_title"
        },
        gmQuestDetail: {
            type: "text",
            nullable: true,
            name: "gm_quest_detail"
        },
        gmQuestOption: {
            type: "jsonb",
            nullable: true,
            name: "gm_quest_option"
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
    relations: {
        // กำหนดความสัมพันธ์ระหว่างคำถามและคำตอบ
        answers: {
            type: 'one-to-many',
            target: 'GameAnswer', // ชื่อ Entity ของคำตอบ
            inverseSide: 'question', // ชื่อฟิลด์ที่ใช้เป็น inverse side ใน Entity ของคำตอบ
            createForeignKeyConstraints: false,
            cascade: false,
            joinColumn: {
                name: 'gm_quest_id',
                referencedColumnName: 'gmQuestId',
            },
        },
        board: {
            type: 'many-to-one',
            target: 'GameBoard', // ชื่อ Entity ของคำตอบ
            inverseSide: 'question', // ชื่อฟิลด์ที่ใช้เป็น inverse side ใน Entity ของคำตอบ
            createForeignKeyConstraints: false,
            cascade: false,
            joinColumn: {
                name: "gm_board_id",
                referencedColumnName: "gmBoardId"
            },
        },
    },
});
