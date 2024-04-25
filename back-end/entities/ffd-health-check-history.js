const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: 'FfdHealthCheckHistory',
    tableName: 'ffd_health_check_history',
    columns: {
        hcHisId: {
            type: 'int',
            primary: true,
            generated: true,
            name: 'hc_his_id',
        },
        uuidAccount: {
            type: 'varchar',
            length: 250,
            name: 'uuid_account',
        },
        hcHisSystem: {
            type: 'jsonb',
            name: 'hc_his_system',
        },
        hcHisAnswer: {
            type: 'jsonb',
            name: 'hc_his_answer',
        },
        hcTypeRule:{
            type: 'varchar',
            length: 150,
            name: 'hc_type_rule',
        },
        hcScoreInitil:{
            type: 'int',
            name: 'hc_score_initil',
        },
        hcHisScore: {
            type: 'int',
            name: 'hc_his_score',
        },
        active: {
            type: 'boolean',
            default: true,
            name: 'active',
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
        account: {
            type: 'many-to-one',
            target: 'CmsAccount',
            inverseSide: 'healthCheckHistory',
            joinColumn: {
                name: 'uuid_account',
                referencedColumnName: 'uuidAccount',
            },
        },
    },
});
