/*========================================================================================================================================
                                    CONFIGURACIÓN QUE PERMITE VERIFICAR LA CONEXIÓN A POSTGRESQL
=========================================================================================================================================*/


const { loadEnvFile } = require('node:process');
loadEnvFile('.env');

const pool = require('./config');

async function testConection() {

    try{

        const result = await pool.query('SELECT NOW()');
        console.log('Conexión exitosa a PostgreSQL');
        console.log('Hora del servidor de base de datos:', result.rows[0].now);
        await pool.end();

    } catch (error) {
        console.error('Error de conexión a PostgreSQL:', error.message);
    }
}



testConection();