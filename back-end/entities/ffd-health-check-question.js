const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: 'FfdHealthCheckQuestion',
    tableName: 'ffd_health_check_question',
    columns: {
        hcqId: {
            type: 'int',
            primary: true,
            generated: true,
            name: 'hcq_id',
        },
        order: {
            type: 'int',
            default: 0,
            name: 'order',
        },
        hcqType: {
            type: 'varchar',
            length: 150,
            nullable: true,
            default: null,
            name: 'hcq_type',
        },
        hcGroupUuid:{
            type: 'varchar',
            length: 150,
            nullable: true,
            name: 'hc_group_uuid',
        },
        hcqLevel: {
            type: 'int',
            name: 'hcq_level',
        },
        hcqDate: {
            type: 'date',
            nullable: true,
            name: 'hcq_date',
        },
        hcqSubject: {
            type: 'varchar',
            length: 255,
            nullable: true,
            name: 'hcq_subject',
        },
        hcqDetail: {
            type: 'text',
            nullable: true,
            name: 'hcq_detail',
        },
        hcqImage: {
            type: 'jsonb',
            nullable: true,
            name: 'hcq_image',
        },
        hcqOptions: {
            type: 'jsonb',
            name: 'hcq_options',
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
        answers: {
            type: 'one-to-many',
            target: 'FfdHealthCheckAnswer', // ชื่อ Entity ของคำตอบ
            inverseSide: 'question', // ชื่อฟิลด์ที่ใช้เป็น inverse side ใน Entity ของคำตอบ
            joinColumn: {
                name: 'hcq_id',
                referencedColumnName: 'hcqId',
            },
        },
    },
});
