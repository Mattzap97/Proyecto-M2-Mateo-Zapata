const express = require('express');
const router = express.Router();

//ARRAYS CON DATOS EN MEMORIA LOCAL PARA DESPUÉS REEMPLAZAR CON LA BASE DE DATOS
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
        title: 'PostgreSQl vs MySQL',
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


//GET /api/posts - OBTENER TODOS LOS POSTS
router.get('/', (req, res) => {

    const { published } = req.body;

    if(published !== undefined) {
        
        const isPublished = published === 'true';
        const filtered = posts.filter(p => p.id === parseInt(req.params.id));
        return res.json(filtered);

    }

    res.json(posts);

})



//GET api/posts/:id - OBTENER UN POST POR ID
router.get('/:id', (req, res) => {

    const post = posts.find(p => p.id === parseInt(req.params.id));

    if(!post) {
        return res.status(404).json({ error: 'No se encontró el post'});
    }

    res.json(post);

})



//GET /api/posts/author/author:id - OBTENER POSTS POR AUTOR
router.get('/author/authorId', (req, res) => {

    const authorPosts = posts.filter(p => p.id === parseInt(req.params.authorId));
    res.json(authorPosts);

})



//POST api/posts - CREAR UN NUEVO POST
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



//PUT api/posts/:id - ACTUALIZAR UN POST
router.put('/:id', (req, res) => {

    const post = posts.find(p => p.id === parseInt(req.params.id));

    if(!post) {
        return res.status(404).json({ error: 'No se encontró el post'});
    }

    const { title, content, published } = req.body;

    if(title) post.title = title;
    if(content) post.content = content;
    if(published !== undefined) post.published = published;

    res.json(post);

})



//DELETE /api/posts/:id - ELIMINAR UN POST
router.delete('/:id', (req, res) => {

    const index = posts.findIndex(p => p.id === parseInt(req.params.id));

    if(index === -1) {
        return res.status(404).json({error: 'No se encontró el post'});
    }

    posts.splice(index, 1);
    res.json({ message: 'Post eliminado exitosamente'});

})


module.exports = router;