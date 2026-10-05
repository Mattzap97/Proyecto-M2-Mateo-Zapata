
const express = require('express');
const router = express.Router();

const pool = require('../config/dbConnect');

const { validarPost, validarId, validarPublished } = require('../utils/validators.js');
const { obtenerPosts, obtenerPost, obtenerPostsPorAutor, crearPost, actualizarPost, eliminarPost } = require('../controllers/postsController.js');

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
router.put('/:id', (req, res, next) => {


    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    next();

}, actualizarPost)




//DELETE /api/posts/:id - ELIMINAR UN POST
router.delete('/:id', (req, res, next) => {

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    next();

}, eliminarPost)


module.exports = router;