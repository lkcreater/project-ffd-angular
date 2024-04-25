const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "CmsAccount",
    tableName: "cms_account", // Assuming table name is 'cms_account'
    columns: {
        accId: {
            primary: true,
            type: "int",
            generated: true,
        },
        uuidAccount: {
            type: "varchar",
            length: 255,
            nullable: false,
            unique: true,
            name: "uuid_account"
        },
        compCode: {
            type: "varchar",
            length: 150,
            nullable: true,
            name: "comp_code"
        },
        condiVersion: {
            type: "varchar",
            length: 100,
            nullable: true,
            name: "condi_version"
        },
        condiAccept: {
            type: "int",
            nullable: true,
            name: "condi_accept"
        },
        accPassword: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "acc_password"
        },
        accPicture: {
            type: "jsonb",
            nullable: true,
            name: "acc_picture"
        },
        accFirstname: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "acc_firstname"
        },
        accLastname: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "acc_lastname"
        },
        active: {
            type: "boolean",
            name: 'active',
            default: true
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
    relations: {
        chanelLogin: {
            type: "one-to-many",
            target: "CmsLogin",
            inverseSide: 'account',
            joinColumn: {
                name: "uuid_account",
                referencedColumnName: "uuidAccount"
            }
        },
        healthCheckHistory: {
            type: "one-to-many",
            target: "FfdHealthCheckHistory",
            inverseSide: "account", 
            joinColumn: {
                name: "uuid_account", 
                referencedColumnName: "uuidAccount",
            },
        },
    }
});