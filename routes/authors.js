
const express = require('express');
const router = express.Router();

const pool = require('../config/dbConnect');

const { validarAutor, validarId } = require('../utils/validators.js');

/*=====================================================================================================================================
                                                ENDPOINTS CRUD PARA AUTHORS
===========================================================================================================================================*/


//GET api/authors - OBTENER TODOS LOS AUTORES
router.get('/', async (req, res) => {

    try{

        const result = await pool.query('SELECT * FROM authors ORDER BY name');
        res.json(result.rows);

    } catch (error) {

        console.error('Error al obtener autores', error);
        res.status(500).json({error: 'Error al obtener autores'});
    }

})




//GET api/authors/:id - OBTENER UN AUTOR POR ID
router.get('/:id', async (req, res) => {

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion})
    }

    try {
        
        const result = await pool.query('SELECT * FROM authors WHERE id_author = $1', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No se encontró el autor'})
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener autor:', error);
        res.status(500).json({error: 'Error al obtener autor'});
    }

})




//POST /api/authors - CREAR UN NUEVO AUTOR
router.post('/', async (req, res) => {

    const { name, email, bio } = req.body;
    
    const errorValidacion = validarAutor(name, email);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion})
    }

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

        if (error.code === '23505') {
            return res.status(409).json({error: 'El email ya está registrado'});
        }

        res.status(500).json({error: 'Error al crear autor'});
    }

})




//PUT /api/authors/:id - ACTUALIZAR UN AUTOR
router.put('/:id', async (req, res) => {
    const { name, email, bio } = req.body;

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

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
})




//DELETE /api/authors/:id - ELIMINAR UN AUTOR
router.delete('/:id', async (req, res) => {

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    try{

        const result = await pool.query('DELETE FROM authors WHERE id_author = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({error: 'No se encontró el autor'});
        }

        res.json({msg: 'Autor eliminado exitosamente'});

    } catch (error) {

        console.error('Error al eliminar autor:', error);
        res.status(500).json({error: 'Error al eliminar autor'});
    }
    
})

module.exports = router;