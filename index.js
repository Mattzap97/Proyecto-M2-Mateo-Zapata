const { loadEnvFile } = require('node:process');
const express = require('express');



loadEnvFile('.env');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  //Middleware para parsear JSON

//============================== RUTAS ========================================




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

//PUERTO
app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})