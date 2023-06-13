const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.POSTGRESS_USERNAME,
  password: process.env.POSTGRESS_PASSWORD,
  host: process.env.POSTGRESS_HOST,
  port: process.env.POSTGRESS_PORT,
  database: process.env.POSTGRESS_DB,
});

module.exports = pool;
