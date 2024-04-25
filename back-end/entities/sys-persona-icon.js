const EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
  name: 'SysPersonaIcon',
  tableName: 'sys_persona_icon',
  columns: {
    iconId: {
      type: 'int',
      primary: true,
      generated: true,
      name: 'icon_id',
    },
    iconLevel: {
      type: 'int',
      name: 'icon_level',
    },
    iconName: {
      type: 'varchar',
      length: 255,
      name: 'icon_name',
    },
    iconImage: {
      type: 'jsonb',
      name: 'icon_image',
    },
    iconDetail: {
      type: 'text',
      name: 'icon_detail',
    },
    iconMinScore: {
      type: 'int',
      name: 'icon_min_score',
    },
    iconMaxScore: {
      type: 'int',
      name: 'icon_max_score',
    },
    active: {
      type: 'boolean',
      default: true,
      name: 'active',
    },
    createdBy: {
      type: 'varchar',
      length: 255,
      name: 'created_by',
    },
    updatedBy: {
      type: 'varchar',
      length: 255,
      name: 'updated_by',
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
