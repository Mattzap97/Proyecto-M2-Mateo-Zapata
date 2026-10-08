const { loadEnvFile } = require('node:process');

if (process.env.NODE_ENV !== 'production') {
    loadEnvFile('.env')
}

const DATABASE_URL = process.env.DATABASE_URL

const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

module.exports = {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DATABASE_URL
}
