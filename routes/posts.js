
const express = require('express');
const router = express.Router();

const pool = require('../config/dbConnect');

const { validarPost, validarId, validarPublished } = require('../utils/validators.js');
const { obtenerPosts, obtenerPost, obtenerPostsPorAutor, crearPost } = require('../controllers/postsController.js');

/*=================================================================================================================================================================
                                                        ENDPOINTS CRUD PARA POSTS
====================================================================================================================================================================*/


//GET /api/posts - OBTENER TODOS LOS POSTS
router.get('/', (req, res, next) => {

    const errorValidacion = validarPublished(req.query.published);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    next();

}, obtenerPosts);




//GET api/posts/:id - OBTENER UN POST POR ID
router.get('/:id', (req, res, next) => {

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    next();
    
}, obtenerPost)




//GET /api/posts/author/:authorId - OBTENER POSTS POR AUTOR
router.get('/author/:authorId', (req, res, next) => {

    const errorValidacion = validarId(req.params.authorId);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    next();

}, obtenerPostsPorAutor)




//POST api/posts - CREAR UN NUEVO POST
router.post('/', (req, res, next) => {

    const { title, content, author_id } = req.body;
    
    const errorValidacion = validarPost(title, content, author_id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    next();

}, crearPost)




//PUT api/posts/:id - ACTUALIZAR UN POST
router.put('/:id', async (req, res) => {

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    const { title, content, published } = req.body;

    try{

        const result = await pool.query('UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE ($3, published) WHERE id_post = $4 RETURNING *',
            [title, content, published, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No se encontró el post'});
        }

        res.status(200).json({
            message: 'Post actualizado con éxito',
            post: result.rows[0]
        });

    } catch (error) {

        console.error('Error al actualizar el post:', error);
        res.status(500).json({error: 'Error al actualizar el post'});

    }
})




//DELETE /api/posts/:id - ELIMINAR UN POST
router.delete('/:id', async (req, res) => {

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    try{

        const result = await pool.query('DELETE FROM posts WHERE id_post = $1', [req.params.id]);

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