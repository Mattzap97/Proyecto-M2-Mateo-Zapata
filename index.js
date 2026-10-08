/*================================================================================================================================================
                                            CONFIGURACIÓN PARA LEVANTAR EL SERVIDOR
===================================================================================================================================================*/

const { loadEnvFile } = require('node:process');

if (process.env.NODE_ENV !== 'production') {
    loadEnvFile('.env')
}

const app = require('./app');

const PORT = process.env.PORT || 3000;



//PUERTO
app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})