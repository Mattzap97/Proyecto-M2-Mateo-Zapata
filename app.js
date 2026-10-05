/*===================================================================================================================================================
                                                    CONFIGURACIÓN DE EXPRESS
=====================================================================================================================================================*/

const express = require('express');


const authorsRouter = require('./src/routes/authors');
const postsRouter = require('./src/routes/posts');

const app = express();
app.use(express.json());  //Middleware para parsear JSON


//=====================================================   RUTAS    ===========================================================================

app.use('/api/authors', authorsRouter);
app.use('/api/posts', postsRouter);


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