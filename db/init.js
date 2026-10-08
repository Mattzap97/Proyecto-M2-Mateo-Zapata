const { loadEnvFile } = require('node:process');
const fs = require('node:fs');
const { Pool } = require('pg');

if (fs.existsSync('.env')) {
    loadEnvFile('.env');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function initializeDatabase() {
    const client = await pool.connect();

    try {
        const result = await client.query(`
            SELECT to_regclass('public.authors') AS table_name;
        `);

        if (!result.rows[0].table_name) {
            console.log('Creando tablas...');

            const setupSQL = fs.readFileSync(
                './db/setup.sql',
                'utf8'
            );

            const seedSQL = fs.readFileSync(
                './db/seed.sql',
                'utf8'
            );

            await client.query(setupSQL);
            console.log('Tablas creadas correctamente.');

            await client.query(seedSQL);
            console.log('Datos de ejemplo insertados correctamente.');
        } else {
            console.log('La base de datos ya está inicializada.');
        }
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

initializeDatabase();