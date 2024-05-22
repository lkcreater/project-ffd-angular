const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "GameCategory",
    tableName: "game_categories",
    columns: {
        gmCateId: {
            type: "int",
            primary: true,
            generated: true,
            name: "gm_cate_id"
        },
        order: {
            type: "int",
            default: 0,
            name: "order"
        },
        gmCateSlug: {
            type: "varchar",
            length: 150,
            nullable: true,
            name: "gm_cate_slug"
        },
        gmCateImage: {
            type: "jsonb",
            nullable: true,
            name: "gm_cate_image"
        },
        gmCateTitle: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "gm_cate_title"
        },
        gmCateDetail: {
            type: "text",
            nullable: true,
            name: "gm_cate_detail"
        },
        gmCateOption: {
            type: "jsonb",
            nullable: true,
            name: "gm_cate_option"
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
        board: {
            type: "one-to-one",
            target: "GameBoard",
            inverseSide: "categories",
            createForeignKeyConstraints: false,
            cascade: false,
            joinColumn: {
                name: "gm_cate_id",
                referencedColumnName: "gmCateId"
            }
        }
    }
});
