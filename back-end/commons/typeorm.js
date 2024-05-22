const env = require("../configuration");
const typeorm = require("typeorm");
const fs = require("fs");

class TypeORMService {
  constructor() {
    this.connection = null;
  }

  async initialize() {
    try {
      var dataSource = new typeorm.DataSource({
        type: "postgres",
        host: env.DATABASE_HOST,
        port: env.DATABASE_PORT,
        username: env.DATABASE_USERNAME,
        password: env.DATABASE_PASSWORD,
        database: env.DATABASE_NAME,
        schema: env.SCHEMA,
        entities: [`${__dirname}/../entities/**/*.js`],
        synchronize: env.DATABASE_SYNCHRONIZE,
        logging: env.DATABASE_LOGGING,
        ...this.extraOptions(),
      });
      this.connection = await dataSource.initialize();
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connection to the database", error);
      throw error;
    }
  }

  extraOptions() {
    if (["local"].includes(env.envMode)) {
      return {};
    }
    return {
      extra: {
        ssl: {
          rejectUnauthorized: env.RDS_REJECT_UNAUTHORIZED === "true",
        },
      },
    };
  }

  getConnection() {
    if (!this.connection) {
      throw new Error("Connection not initialized");
    }
    return this.connection;
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
      console.log("Database connection closed");
    }
  }
}

module.exports = new TypeORMService();
