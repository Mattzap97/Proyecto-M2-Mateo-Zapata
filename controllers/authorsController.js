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


const obtenerAutor = async (req, res) => {

    try {

        const result = await pool.query('SELECT * FROM authors WHERE id_author = $1', [req.params.id]);

        if(result.rows.length === 0) {
            return res.status(404).json({error: 'No se encontró el autor'});
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener autor', error);
        res.status(500).json({error: 'Error al obtener autor'});

    }
}


module.exports = {
    obtenerAutores,
    obtenerAutor
}