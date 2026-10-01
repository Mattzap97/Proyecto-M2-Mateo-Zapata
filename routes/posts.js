const { loadEnvFile } = require('node:process');
loadEnvFile('.env');


const express = require('express');
const router = express.Router();

const pool = require('../config/dbConnect');

/*=================================================================================================================================================================
                                                        ENDPOINTS CRUD PARA POSTS
====================================================================================================================================================================*/


//GET /api/posts - OBTENER TODOS LOS POSTS
router.get('/',  async (req, res) => {
    const { published } = req.body;

    try{
        let query = 'SELECT * FROM posts';
        let params = [];

        if (published !== undefined) {
            query += 'WHERE published = $1';
            params.push(published === 'true');
        }

        query += 'ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {

        console.error('Error al obtener posts:', error);
        res.status(500).json({error: 'Error al obtener posts'});

    }

})




//GET api/posts/:id - OBTENER UN POST POR ID
router.get('/:id', async (req, res) => {

    try{

        const result = await pool.query('SELECT * FROM posts WHERE id_post = $1', [req.params.id_post]);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No se pudo encontrar el post'});
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener el post:', error);
        res.status(500).json({error: 'Error al obtener el post'})
    }

})




//GET /api/posts/author/:authorId - OBTENER POSTS POR AUTOR
router.get('/author/:authorId', async (req, res) => {

    try {

        const result = await pool.query ('SELECT FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
            [req.params.authorId]
        );

        res.json(result.rows);

    } catch (error) {

        console.error('Error obteniendo posts del autor:', error);
        res.status(500).json({error: 'Error obteniendo posts del autor'});

    }

})




//POST api/posts - CREAR UN NUEVO POST
router.post('/', async (req, res) => {
    const { title, content, author_id, published } = req.body;

    if(!title || !content || !author_id) {
        return res.status(400).json({ error: 'Título, contenido y author_id son requeridos'});
    }

    try {

        const result = await pool.query('INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, author_id, published || false]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error al crear post:', error);

        if (error.code = '23503') {
            return res.status(404).json({error: 'El autor especificado no existe'});
        }

        res.status(500).json({error: 'Error al crear post'});
    }

})




//PUT api/posts/:id - ACTUALIZAR UN POST
router.put('/:id', async (req, res) => {
    const { title, content, published } = req.body;

    try{

        const result = await pool.query('UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE ($3, published) WHERE id_post = $4 RETURNING *',
            [title, content, published, req.params.id_post]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No se encontró el post'});
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al actualizar el post:', error);
        res.status(500).json({error: 'Error al actualizar el post'});

    }
})




//DELETE /api/posts/:id - ELIMINAR UN POST
router.delete('/:id', async (req, res) => {

    try{

        const result = await pool.query('DELETE FROM posts WHERE id_post = $1', [req.params.id_post]);

        if (result.rowCount === 0) {
            return res.status(404).json({error: 'No se encontró el post'});
        }

        res.json({msg: 'Post eliminado exitosamente'});

    } catch (error) {

        console.error('Error al eliminar post:', error);
        res.status(500).json({error: 'Error al eliminar post'});
    }
})


module.exports = router;