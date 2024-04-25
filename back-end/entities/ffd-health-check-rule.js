const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
  name: "FfdHealthCheckRule",
  tableName: "ffd_health_check_rule",
  columns: {
    hcrId: {
      type: "int",
      primary: true,
      generated: true,
      name: "hcr_id"
    },
    hcqType: {
      type: "varchar",
      length: 150,
      name: "hcq_type"
    },
    hcGroupUuid:{
        type: 'varchar',
        length: 150,
        nullable: true,
        name: 'hc_group_uuid',
    },
    hcrResult: {
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'hcr_result',
    },
    hcrMin: {
      type: "int",
      name: "hcr_min"
    },
    hcrMax: {
      type: "int",
      name: "hcr_max"
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
  }
});
