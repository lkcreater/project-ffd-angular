const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "CmsContent",
    tableName: "cms_content",
    columns: {
        contId: {
            type: "int",
            primary: true,
            generated: true,
            name: "cont_id"
        },
        order: {
            type: "int",
            default: 0,
            name: "order"
        },
        contSubject: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "cont_subject"
        },
        contPicture: {
            type: "jsonb",
            nullable: true,
            name: "cont_picture"
        },
        contSlug: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "cont_slug"
        },
        contAuthor: {
            type: "varchar",
            length: 100,
            nullable: true,
            name: "cont_author"
        },
        contDetail: {
            type: "text",
            nullable: true,
            name: "cont_detail"
        },
        contPostDate: {
            type: "date",
            nullable: true,
            name: "cont_post_date"
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
    }
});
