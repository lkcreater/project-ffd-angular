const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "RankRecord",
    tableName: "rank_record",
    columns: {
        rankId: {
            type: "int",
            primary: true,
            generated: true,
            name: "rank_id"
        },
        uuidAccount: {
            type: "varchar",
            length: 250,
            name: "uuid_account"
        },
        // gmBoardId: {
        //     type: "int",
        //     name: "gm_board_id"
        // },
        rankScore: {
            type: "int",
            name: "rank_score",
            nullable: true
        },
        rankScoreTotal: {
            type: "int",
            name: "rank_score_total",
            nullable: true
        },
        rankDateCalculate: {
            type: "date",
            name: "rank_date_calculate"
        },
        rankObject: {
            type: "jsonb",
            nullable: true,
            name: "rank_object"
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
        // board: {
        //     type: "many-to-one",
        //     target: "GameBoard",
        //     inverseSide: "rankRecords",
        //     createForeignKeyConstraints: false,
        //     cascade: false,
        //     joinColumn: {
        //         name: "gm_board_id",
        //         referencedColumnName: "gmBoardId"
        //     }
        // }
    }
});
