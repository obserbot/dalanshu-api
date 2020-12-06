// db.js

import { Pool } from 'pg'

export function initPostgres () {
  const poolConf = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    max: 20,
    idleTimeoutMillis: 3000
  }

  global.pgPool = new Pool(poolConf)
}
