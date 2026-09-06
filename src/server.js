/*==============================================================================================================
                                    CONFIGURACIÓN DEL SERVIDOR EXPRESS
==================================================================================================================*/

const { loadEnvFile } = require('node:process');
const express = require('express');


loadEnvFile('.env');
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware para parsear JSON
app.use(express.json());

app.get('/', (req, res) => {

    res.json({
        message:'miniBlog API',
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