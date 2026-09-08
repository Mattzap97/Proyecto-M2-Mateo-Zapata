/*==============================================================================================================
                                    CONFIGURACIÓN DEL SERVIDOR EXPRESS
==================================================================================================================*/

const { loadEnvFile } = require('node:process');
const express = require('express');

const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');


loadEnvFile('.env');
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware para parsear JSON
app.use(express.json());

//==========================================================================================================================
//RUTA DE PRUEBA PARA CONFIRMAR CONEXIÓN EXPRESS -> POOL -> POSTGRESQL
app.get('/api/test-db', async (req, res) => {
    try {

        const result = await pool.query('SELECT NOW()');

        res.json({
            message: 'Express está conectado a PostgreSQL',
            databaseTime: result.rows[0].now
        });

    } catch (error) {
        console.error('Error al consultar PostgreSQL:', error.message);

        res.status(500).json({
            error: 'Error al conectar con PostgreSQL'
        });
    }
});
//============================================================================================================================


//Rutas
app.use('/api/authors', authorsRouter);
app.use('/api/posts', postsRouter);


//Ruta raíz
app.get('/', (req, res) => {

    res.json({
        message:'Blog API',
        endpoints: {
            authors: '/api/authors',
            posts: '/api/posts'
        }
    })
})

//Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada'})
})

//Manejo de errores
app.use((err, req, res, next) => {
        console.error(err.stack);
    res.status(500).json({ error: 'Lo sentimos, error interno del servidor'});
})

//Correr confirmación del puerto
app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
})