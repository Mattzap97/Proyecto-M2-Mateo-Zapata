/*==============================================================================================================================================
                                        EJECUCIÓN DE LA LÓGICA Y CONSULTAS SQL PARA AUTHORS
=================================================================================================================================================*/

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


const crearAutor = async (req, res) => {

    const {name, email, bio } = req.body;

    try{

        const result = await pool.query('INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
            [name, email, bio || null]
        );

        res.status(201).json({
            message: 'Autor creado exitosamente',
            autor: result.rows[0]
        });

    } catch (error) {
        console.error('Error al crear autor:', error);

        if(error.code === '23505') {
            return res.status(409).json({error: 'El email ya está registrado'})
        }

        res.status(500).json({error: 'Error al crear autor'});

    }
}


const actualizarAutor = async (req, res) => {

    const { name, email, bio } = req.body;

    try{

        const result = await pool.query('UPDATE authors SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id_author = $4 RETURNING *',
            [name, email, bio, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró el autor'});
        }

        res.status(200).json({
            message: 'Autor actualizado con éxito',
            autor: result.rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar autor:', error);

        if (error.code === '23505') {
            return res.status(409).json({error: 'El email ya está registrado'});
        }

        res.status(500).json({error: 'Error al actualizar autor'});
    }
}


const eliminarAutor = async (req, res) => {

    try{

        const result = await pool.query('DELETE FROM authors WHERE id_author = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({error: 'No se encontró el autor'});
        }

        res.json({message: 'Autor eliminado exitosamente'});

    } catch (error) {

        console.error('Error al eliminar autor:', error);
        res.status(500).json({error: 'Error al eliminar autor'});

    }

}




module.exports = {
    obtenerAutores,
    obtenerAutor,
    crearAutor,
    actualizarAutor,
    eliminarAutor
}