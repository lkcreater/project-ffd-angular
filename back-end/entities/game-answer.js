const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "GameAnswer",
    tableName: "game_answer",
    columns: {
        gmAnsId: {
            type: "int",
            primary: true,
            generated: true,
            name: "gm_ans_id"
        },
        gmQuestId: {
            type: "int",
            name: "gm_quest_id"
        },
        order: {
            type: "int",
            default: 0,
            name: "order"
        },
        gmAnsChoice: {
            type: "jsonb",
            nullable: true,
            name: "gm_ans_choice"
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
        question: {
            type: 'many-to-one',
            target: 'GameQuestion', // ชื่อ Entity ของคำถาม
            inverseSide: 'answers', // ชื่อฟิลด์ที่ใช้เป็น inverse side ใน Entity ของคำถาม
            createForeignKeyConstraints: false,
            cascade: false,
            joinColumn: {
                name: 'gm_quest_id',
                referencedColumnName: 'gmQuestId',
            },
        },
    },
});
