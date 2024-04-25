const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "CmsAccountIcon",
    tableName: "cms_account_icon",
    columns: {
        acciId: {
            type: "int",
            primary: true,
            generated: true,
            name: "acci_id"
        },
        uuidAccount: {
            type: "varchar",
            length: 250,
            name: "uuid_account"
        },
        iconLevel: {
            type: 'int',
            name: 'icon_level',
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
          },
    },
    
});
