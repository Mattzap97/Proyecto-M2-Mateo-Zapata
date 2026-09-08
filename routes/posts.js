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
/*router.get('/', (req, res) => {

    const { published } = req.query;

    if(published !== undefined) {
        const isPublished = published === 'true';
        const filtered = posts.filter(p => p.published === isPublished);
        return res.json(filtered);
    }

    res.json(posts);

})*/


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
/*router.get('/:id', (req, res) => {

    const post = posts.find(p => p.id === parseInt(req.params.id));

    if(!post) {
        return res.status(404).json({error: 'Post no encontrado'});
    }

    res.json(post);

})*/


//GET /api/posts/author/:authorid - Obtener posts por autor
router.get('/author/:authorId', (req, res) => {

    const authorPosts = posts.filter(p => p.author_id === parseInt(req.params.authorId));

    res.json(authorPosts);

})


//POST /api/posts - Crear un nuevo post
router.post('/', (req, res) => {

    const { title, content, author_id, published } = req.body;

    if(!title || !content || !author_id) {
        return res.status(400).json({ error: 'Título, contenido y author_id son requeridos'});
    }

    const newPost = {

        id: posts.length + 1,
        title,
        content,
        author_id: parseInt(author_id),
        published: published || false

    }

    posts.push(newPost);

    res.status(201).json(newPost);

})


//PUT /api/posts/:id - Actualizar un post
router.put('/:id', (req, res) => {

    const post = posts.find(p => p.id === parseInt(req.params.id));

    if(!post) {
        return res.status(404).json({ error: 'Post no encontrado'});
    }

    const {title, content, published} = req.body;

    if(title) post.title = title;
    if(content) post.content = content;
    if(published !== undefined) post.published = published;

    res.json(post);

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