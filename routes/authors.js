
const express = require('express');
const router = express.Router();

//const pool = require('../config/dbConnect');

const { validarAutor, validarId } = require('../utils/validators.js');
const { obtenerAutores, obtenerAutor, crearAutor, actualizarAutor, eliminarAutor } = require('../controllers/authorsController.js')

/*=====================================================================================================================================
                                                ENDPOINTS CRUD PARA AUTHORS
===========================================================================================================================================*/


//GET api/authors - OBTENER TODOS LOS AUTORES
router.get('/', obtenerAutores);




//GET api/authors/:id - OBTENER UN AUTOR POR ID
router.get('/:id', (req, res, next) => {

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({ error: errorValidacion});
    }

    next();

}, obtenerAutor);




//POST /api/authors - CREAR UN NUEVO AUTOR
router.post('/', (req, res, next) => {

    const { name, email } = req.body;

    const errorValidacion = validarAutor(name, email);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    next();

}, crearAutor)




//PUT /api/authors/:id - ACTUALIZAR UN AUTOR
router.put('/:id', (req, res, next) => {

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    next();

}, actualizarAutor)




//DELETE /api/authors/:id - ELIMINAR UN AUTOR
router.delete('/:id', (req, res, next) => {

    const errorValidacion = validarId(req.params.id);

    if(errorValidacion) {
        return res.status(400).json({error: errorValidacion});
    }

    next();

}, eliminarAutor)


module.exports = router;