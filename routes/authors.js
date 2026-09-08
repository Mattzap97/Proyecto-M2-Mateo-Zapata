const { loadEnvFile } = require('node:process');
loadEnvFile('.env')

const express = require('express');
const router = express.Router();

const pool = require('../src/db/config');


console.log('authors.js cargado correctamente');


//GET /api/authors - Obtener todos los autores
router.get('/',  async (req, res) => {

    try{

        const result = await pool.query('SELECT * FROM authors ORDER BY NAME');
        res.json(result.rows);

    } catch (error) {

        console.error('Error al obtener autores:', error);
        res.status(500).json({error: 'Error al obtener autores'});

    }
})


//GET /api/authors/:id - Obtener un autor por id
router.get('/:id', async (req, res) => {

    try{

        const result = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.id]);

        if(result.rows.length === 0) {
            return res.status(404).json({error: 'Autor no encontrado'});
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener autor', error)
        res.status(500).json({error: 'Error al obtener autor'});

    }
    
})


//POST /api/authors - Crear un nuevo autor
router.post('/', async (req, res) => {
    const {name, email, bio} = req.body;

    if(!name || !name.trim() || !email || !email.trim()) {
        return res.status(400).json({error: 'Nombre y email son requeridos'});
    }

    try {

        const result = await pool.query('INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *', [name, email, bio || null]);
        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error('Error al crear un autor', error);

        if(error.code === '23505') {
            return res.status(409).json({error: 'Este email ya está registrado'});
        }

        res.status(500).json({error: 'Error al crear un autor'});
        
    }
})



//PUT /api/authors/:id - Actualizar un autor
router.put('/:id', async (req, res) => {
    const {name, email, bio} = req.body;

    if (name !== undefined && !name.trim()) {
        return res.status(400).json({ error: 'El nombre no puede estar vacío'})
    }
    if (email !== undefined && !email.trim()) {
        return res.status(400).json({error: 'El email no puede estar vacío'});
    }

    try{

        const result = await pool.query('UPDATE authors SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4 RETURNING *',
            [name, email, bio, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Autor no encontrado'});
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al actualizar autor', error);

        if(error.code === '23505') {
            return res.status(409).json({error: 'Este email ya está registrado'});
        }

        res.status(500).json({error: 'Error al actualizar autor'});

    }

})



//DELETE /api/authors/:id - Eliminar un autor
router.delete('/:id', async (req, res) => {

    if(!Number.isInteger(Number(req.params.id)) || Number(req.params.id) <= 0) {
        return res.status(400).json({error: 'El ID debe ser un número entero positivo'});
    }

    try {

        const result = await pool.query('DELETE FROM authors WHERE id = $1', [req.params.id]);

        if(result.rowCount === 0) {
            return res.status(404).json({error: 'Autor no encontrado'});
        }

        res.json({message: 'Autor eliminado con éxito'});

    } catch ( error) {

        console.error('Error al eliminar autor', error);
        res.status(500).json({error: 'Error al eliminar autor'});

    }
})




module.exports = router;