const { loadEnvFile } = require('node:process');
loadEnvFile('.env')

const express = require('express');
const router = express.Router();

const pool = require('../src/db/config');


console.log('posts.js cargado correctamente');


let posts = [
    {

        id: 1,
        title: 'Introducción a Node.js',
        content: 'Node.js es un runtime de JavaScript...',
        author_id: 1,
        published: true

    },

    {

        id: 2,
        title: 'PostgreSQL vs MySQL',
        content: 'Ambas bases de datos tienen ventajas...',
        author_id: 2,
        published: true

    },

    {

        id: 3,
        title: 'APIs RESTful',
        content: 'REST es un estilo arquitectónico...',
        author_id: 1,
        published: true

    },

    {

        id: 4,
        title: 'Manejo de errores en Express',
        content: 'El manejo apropiado de errores...',
        author_id: 3,
        published: false

    },

    {

        id: 5,
        title: 'Async/Await explicado',
        content: 'Las promesas simplifican el código asíncrono...',
        author_id: 1,
        published: false

    }
]


//GET /api/posts - Obtener todos los posts
router.get('/', async (req, res) => {
    const { published } = req.query;

    try{

        let query = 'SELECT * FROM posts';
        let params = []

        if(published !== undefined) {
            query += 'WHERE published = $1';
            params.push(published === 'true');
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {

        console.error('Error al obtener posts', error);
        res.status.json({ error: 'Error al obtener posts'});
        
    }
})


//GET /api/posts/:id - Obtener un post por id
router.get('/:id', async (req, res) => {

    try{ 

        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);

        if(result.rows.length === 0) {
            return res.status(404).json({error: 'Post no encontrado'});
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener post', error);
        res.status(500).json({error: 'Error al obtener post'});

    }
})


//GET /api/posts/author/:authorid - Obtener posts por autor
router.get('/author/:authorId', async (req, res) => {

    try{

        const result = await pool.query('SELECT * FROM posts WHERE author_id = $1', [req.params.authorId]); 

        if(result.rows.length === 0) {
            return res.status(404).json({error: 'Post por autor no encontrado'});
        }

        res.json(result.rows);

    } catch (error) {

        console.error('Error al obtener posts por autor', error);
        res.status(500).json({error: 'Error al obtener posts por autor'});

    }
})


//POST /api/posts - Crear un nuevo post
router.post('/', async (req, res) => {

    const {title, content, author_id, published} = req.body;

    if(!title || !content || !author_id) {
        return res.status(404).json({error: 'Título, contenido y author_id son necesarios para continuar'});
    }

    try {

        const result = await pool.query('INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING*',
            [title, content, author_id, published || false]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error('Error al crear un post', error);

        if(error.code === '23503') {
            return res.status(404).json({ error: 'El autor especificado no existe'});
        }

        res.status(500).json({ error: 'Error al crear un post'});

    }

})



//PUT /api/posts/:id - Actualizar un post
router.put('/:id', async (req, res) => {

    const {title, content, published} = req.body;

    try {

        const result = await pool.query('UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE($3, published) WHERE id = $4 RETURNING *',
            [title, content, published, req.params.id]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado'});
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al actualizar post:', error);
        res.status(500).json({ error: 'Error al actualizar post'});
        
    }
})



//DELETE /api/posts/:id - Eliminar un post
router.delete('/:id', (req, res) => {

    const index = posts.findIndex(p => p.id === parseInt(req.params.id));

    if(index === -1) {
        return res.status(404).json({error: 'Post no encontrado'})
    }

    posts.splice(index, 1)

    res.json({message: 'Post eliminado con éxito'})

})


module.exports = router;