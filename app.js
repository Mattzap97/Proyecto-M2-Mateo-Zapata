/*===================================================================================================================================================
                                                    CONFIGURACIÓN DE EXPRESS
=====================================================================================================================================================*/

const express = require('express');


const authorsRouter = require('./src/routes/authors');
const postsRouter = require('./src/routes/posts');

const app = express();
app.use(express.json());  //Middleware para parsear JSON


/*=======================================================================================================================================================
                                            CONFIGURACIÓN PARA USAR SWAGGER UI EN PROYECTO EXPRESS
=========================================================================================================================================================*/

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

//=====================================================   RUTAS    ===========================================================================

app.use('/api/authors', authorsRouter);
app.use('/api/posts', postsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//RUTA RAÍZ
app.get('/', (req, res) => {
    res.json({
        message: 'Miniblog API funcionando correctamente',
        endpoints: {
            authors:'/api/authors',
            posts: '/api/posts'
        }
    })
});


//MANEJO DE TUTAS NO ENCONTRADAS
app.use((req, res) => {
    res.status(404).json({error: 'Ruta no encontrada'})
})

//MANEJO DE ERRORES
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Lo sentimos, error interno del servidor'});
});


module.exports = app;