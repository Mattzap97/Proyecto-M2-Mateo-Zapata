const express = require('express');
const router = express.Router();

//ARRAYS CON DATOS EN MEMORIA LOCAL PARA DESPUÉS REEMPLAZAR CON LA BASE DE DATOS
let authors = [

    {
        id: 1,
        name: 'Ana García',
        email: 'ana@example.com',
        bio: 'Desarrolladora full-stack apasionada por Node.js'
    },
    {
        id: 2,
        name: 'Carlos Ruiz',
        email: 'carlos@example.com',
        bio:'Escritor técnico especializado en bases de datos'
    },
    {
        id: 3,
        name: 'María López',
        email: 'maria@example.com',
        bio: 'Ingeniería de software con foco en APIs REST'
    }
]



//GET api/authors - OBTENER TODOS LOS AUTORES
router.get('/', (req, res) => {

    res.json(authors);

})



//GET api/authors/:id - OBTENER UN AUTOR POR ID
router.get('/:id', (req, res) => {

    const author = authors.find(a => a.id === parseInt(req.params.id));

    if(!author) {
        return res.status(404).json({ error: 'No se encontró al autor'})
    }

    res.json(author);

})




//POST /api/authors - CREAR UN NUEVO AUTOR
router.post('/', (req, res) => {

    const { name, email, bio } = req.body;

    if(!name || !email) {
        return res.status(400).json({error: 'Nombre y email son requeridos'})
    }

    const newAuthor = {
        
        id: authors.length + 1,
        name,
        email,
        bio: bio || ''

    }

    authors.push(newAuthor);
    res.status(201).json(newAuthor);

})



//PUT /api/authors/:id - ACTUALIZAR UN AUTOR
router.put('/:id', (req, res) => {
    const author = authors.find(a => a.id === parseInt(req.params.id));

    if(!author) {
        return res.status(404).json({error: 'No se encontró al autor'})
    }

    const { name, email, bio } = req.body;

    if(name) author.name = name;
    if(email) author.email = email;
    if(bio !== undefined) author.bio = bio;

    res.json(author);

})



//DELETE /api/authors/:id - ELIMINAR UN AUTOR
router.delete('/:id', (req, res) => {

    const index = authors.findIndex( a => a.id === parseInt(req.params.id));

    if(index === -1) {
        return res.status(404).json({error: 'No se encontró al autor'})
    }

    authors.splice(index, 1);
    res.json({ message: 'Autor eliminado exitosamente'})

})

module.exports = router;