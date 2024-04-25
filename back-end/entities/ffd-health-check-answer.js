const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: 'FfdHealthCheckAnswer',
    tableName: 'ffd_health_check_answer',
    columns: {
        ansId: {
            type: 'int',
            primary: true,
            generated: true,
            name: 'ans_id',
        },
        hcqId: {
            type: 'int',
            name: 'hcq_id',
        },
        order: {
            type: 'int',
            name: 'order',
            default: 0,
        },
        ansDate: {
            type: 'date',
            name: 'ans_date',
        },
        ansSubject: {
            type: 'varchar',
            length: 255,
            name: 'ans_subject',
        },
        ansScore: {
            type: 'int',
            name: 'ans_score',
        },
        active: {
            type: 'boolean',
            name: 'active',
            default: true,
        },
        createdBy: {
            type: 'varchar',
            length: 255,
            name: 'created_by',
        },
        updatedBy: {
            type: 'varchar',
            length: 255,
            name: 'updated_by',
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
    relations: {
        // กำหนดความสัมพันธ์ระหว่างคำถามและคำตอบ
        question: {
            type: 'many-to-one',
            target: 'FfdHealthCheckQuestion', // ชื่อ Entity ของคำถาม
            inverseSide: 'answers', // ชื่อฟิลด์ที่ใช้เป็น inverse side ใน Entity ของคำถาม
            joinColumn: {
                name: 'hcq_id',
                referencedColumnName: 'hcqId',
            },
        },
    },
});
