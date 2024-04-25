const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "SysFfdConsent",
    tableName: "sys_ffd_consents", // Assuming table name is 'sys_ffd_consents'
    columns: {
        consId: {
            primary: true,
            type: "int8",
            generated: true,
            name: "cons_id"
        },
        ffdBusinessConsentGroup: {
            type: "int",
            name: "ffd_business_consent_group"
        },
        ffdExecutionApplication: {
            type: "int",
            name: "ffd_execution_application"
        },
        ffdTargetConsentId: {
            type: "int",
            name: "ffd_target_consent_id"
        },
        ffdTargetConsentCode: {
            type: "varchar",
            length: 100,
            name: "ffd_target_consent_code"
        },
        ffdTargetConsentVersion: {
            type: "varchar",
            length: 100,
            name: "ffd_target_consent_version"
        },
        ffdTargetProductType: {
            type: "varchar",
            length: 100,
            nullable: true,
            name: "ffd_target_product_type"
        },
        ffdTargetConsentTopicThai: {
            type: "varchar",
            length: 255,
            nullable: true,
            name: "ffd_target_consent_topic_thai"
        },
        ffdTargetConsentTopicEnglish: {
            type: "varchar",
            length: 255,
            nullable: true,
            name: "ffd_target_consent_topic_english"
        },
        ffdTargetConsentThai: {
            type: "text",
            nullable: true,
            name: "ffd_target_consent_thai"
        },
        ffdTargetConsentEnglish: {
            type: "text",
            nullable: true,
            name: "ffd_target_consent_english"
        },
        ffdTargetConsentOptionThai: {
            type: "jsonb",
            nullable: true,
            name: "ffd_target_consent_option_thai"
        },
        ffdTargetConsentOptionEnglish: {
            type: "jsonb",
            nullable: true,
            name: "ffd_target_consent_option_english"
        },
        ffdTargetPrivacyNoticeThai: {
            type: "text",
            nullable: true,
            name: "ffd_target_privacy_notice_thai"
        },
        ffdTargetPrivacyNoticeEnglish: {
            type: "text",
            nullable: true,
            name: "ffd_target_privacy_notice_english"
        },
        ffdTheme: {
            type: "varchar",
            length: 255,
            nullable: true,
            name: "ffd_theme"
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
        },
    },
});

