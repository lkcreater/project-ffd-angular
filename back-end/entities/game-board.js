const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "GameBoard",
    tableName: "game_board",
    columns: {
        gmBoardId: {
            type: "int",
            primary: true,
            generated: true,
            name: "gm_board_id"
        },
        gmCateId: {
            type: "int",
            name: "gm_cate_id"
        },
        order: {
            type: "int",
            name: "order"
        },
        gmFormId: {
            type: "int",
            name: "gm_form_id"
        },
        gmBoardSlug: {
            type: "varchar",
            length: 150,
            name: "gm_board_slug"
        },
        gmBoardImage: {
            type: "jsonb",
            nullable: true,
            name: "gm_board_image"
        },
        gmBoardTitle: {
            type: "varchar",
            length: 250,
            nullable: true,
            name: "gm_board_title"
        },
        gmBoardDetail: {
            type: "text",
            nullable: true,
            name: "gm_board_detail"
        },
        gmBoardOption: {
            type: "jsonb",
            nullable: true,
            name: "gm_board_option"
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
        }
    },
    relations: {
        format: {
            type: "one-to-one",
            target: "GameFormat",
            inverseSide: "board",
            cascade: false,
            createForeignKeyConstraints: false,
            joinColumn: {
                name: "gm_form_id",
                referencedColumnName: "gmFormId"
            }
        },
        categories: {
            type: "one-to-one",
            target: "GameCategory",
            inverseSide: "board",
            createForeignKeyConstraints: false,
            cascade: false,
            joinColumn: {
                name: "gm_cate_id",
                referencedColumnName: "gmCateId"
            }
        },
        question: {
            type: "one-to-many",
            target: "GameQuestion",
            inverseSide: "board",
            createForeignKeyConstraints: false,
            cascade: false,
            joinColumn: {
                name: "gm_board_id",
                referencedColumnName: "gmBoardId"
            }
        },
        // rankRecords: {
        //     type: "one-to-many",
        //     target: "RankRecord",
        //     inverseSide: "board",
        //     createForeignKeyConstraints: false,
        //     cascade: false,
        //     joinColumn: {
        //         name: "gm_board_id",
        //         referencedColumnName: "gmBoardId"
        //     }
        // }
    }
    
});
