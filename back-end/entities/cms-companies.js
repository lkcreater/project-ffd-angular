const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "CmsCompanies",
    tableName: "cms_companies", // Assuming table name is 'cms_companies'
    columns: {
        compId: {
            type: "int",
            primary: true,
            generated: true,
            name: "comp_id"
        },
        order: {
            type: "int",
            default: 0,
            name: "order"
        },
        compCode: {
            type: "varchar",
            length: 150,
            name: "comp_code"
        },
        compName: {
            type: "varchar",
            length: 255,
            name: "comp_name"
        },
        active: {
            type: "boolean",
            name: "active",
            default: true,
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
        },
    },
});

