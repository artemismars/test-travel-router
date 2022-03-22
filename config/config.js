require("dotenv").config();
const env = process.env;

const development = {
  username: env.DATABASE_USER,
  password: env.DATABASE_PASS,
  database: env.DATABASE_NAME,
  host: env.DATABASE_HOST,
  dialect: env.DATABASE_DIALECT,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
  define: {
    timestamps: false,
  },
};

const production = {
  username: env.DATABASE_USER,
  password: env.DATABASE_PASS,
  database: env.DATABASE_NAME,
  host: env.DATABASE_HOST,
  dialect: env.DATABASE_DIALECT,
};

const test = {
  username: env.DATABASE_USER,
  password: env.DATABASE_PASS,
  database: env.DATABASE_NAME_TEST,
  host: env.DATABASE_HOST,
  dialect: env.DATABASE_DIALECT,
};

module.exports = { development, production, test };
