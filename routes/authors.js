const { loadEnvFile } = require('node:process');
loadEnvFile('.env')

const express = require('express');
const router = express.Router();

const pool = require('../src/db/config');


console.log('authors.js cargado correctamente');


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
        bio: 'Escritor técnico especializado en bases de datos'

    },

    {

        id: 3,
        name: 'María López',
        email: 'maria@example.com',
        bio: 'Ingeniera de software con foco en APIs REST'

    }
];

//GET /api/authors - Obtener todos los autores
router.get('/',  async (req, res) => {

    try{

        const result = await pool.query('SELECT * FROM authors ORDER BY NAME');
        res.json(result.rows);

    } catch (error) {

        console.error('Error al obtener autores:', error.message);
        res.status(500).json({error: 'Error al obtener autores'});

    }
})
/*router.get('/', (req, res) => {
    
    res.status(200).json(authors);
})*/

//GET /api/authors/:id - Obtener un autor por id
router.get('/:id', async (req, res) => {

    try{

        const result = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.id]);

        if(result.rows.length === 0) {
            return res.status(404).json({error: 'Autor no encontrado'});
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener autor', error.message)
        res.status(500).json({error: 'Error al obtener autor'});
        
    }
    
})

/*router.get('/:id', (req, res) => {

    const author = authors.find(a => a.id === parseInt(req.params.id));

    if(!author){
        return res.status(404).json({ error: 'Autor no encontrado'});
    }
    res.json(author);

})*/

//POST /api/authors - Crear un nuevo autor
router.post('/', (req, res) => {

    const {name, email, bio} = req.body;

    if(!name || !email) {
        return res.status(400).json({ error: 'Nombre y email son requeridos'});
    }

    const newAuthor = {
        id: authors.length +1,
        name,
        email,
        bio: bio || ''
    }

    authors.push(newAuthor);
    res.status(201).json(newAuthor)

})

//PUT /api/authors/:id - Actualizar un autor
router.put('/:id', (req, res) => {

    const author = authors.find(a => a.id === parseInt(req.params.id));

    if (!author) {
        return res.status(404).json({ error: 'Autor no encontrado'})
    }

    const {name, email, bio} = req.body;

    if (name) author.name = name;
    if (email) author.email = email;
    if (bio !== undefined) author.bio = bio;

    res.json(author);

})

//DELETE /api/authors/:id - Eliminar un autor
router.delete('/:id', (req, res) => {

    const index = authors.findIndex(a => a.id === parseInt(req.params.id));
    
    if(index === -1) {
        return res.status(404).json({ error: 'Autor no encontrado'});
    }

    authors.splice(index, 1);
    res.json({ message: 'Autor eliminado con éxito'});

})


module.exports = router;