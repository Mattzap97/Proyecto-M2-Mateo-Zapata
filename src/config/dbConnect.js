const { Pool } = require('pg');

const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DATABASE_URL
} = require ('./envs')

const pool = new Pool( DATABASE_URL ? { connectionString: DATABASE_URL } :

    {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
    
    });


module.exports = pool;
