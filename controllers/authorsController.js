const pool = require('../config/dbConnect')

const obtenerAutores = async (req, res) => {

    try {

        const result = await pool.query('SELECT * FROM authors ORDER BY name');

        res.json(result.rows);

    } catch (error) {

        console.error('Error al obtener autores', error);
        res.status(500).json({error: 'Error al obtener autores'});

    }
}


module.exports = {
    obtenerAutores
}