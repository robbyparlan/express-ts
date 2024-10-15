import 'dotenv/config';

let configDB: Object = {
  client: process.env.DB_CONNECTION,
  connection: {
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  },
  pool: {
    min: 2,
    max: 10
  }
}

export const db = require('knex')(configDB)
