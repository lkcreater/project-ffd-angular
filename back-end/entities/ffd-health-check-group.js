const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "FfdHealthCheckGroup",
  tableName: "ffd_health_check_group",
  columns: {
    hcGroupId: {
      type: "int",
      primary: true,
      generated: true,
      name: "hc_group_id"
    },
    hcGroupUuid: {
      type: "varchar",
      length: 150,
      name: "hc_group_uuid"
    },
    hcGroupLabel: {
      type: "varchar",
      length: 255,
      name: "hc_group_label"
    },
    compCode: {
      type: "varchar",
      length: 150,
      nullable: true,
      name: "comp_code"
    },
    isDefault: {
      type: "boolean",
      default: false,
      name: "is_default"
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
//   relations: {
//     company: {
//       type: "many-to-one",
//       target: "CmsCompany",
//       joinColumn: {
//         name: "comp_code",
//         referencedColumnName: "compCode"
//       }
//     }
//   }
});
