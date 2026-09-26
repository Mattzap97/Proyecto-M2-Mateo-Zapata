const express = require('express');
const router = express.Router();

//ARRAYS CON DATOS EN MEMORIA LOCAL PARA DESPUÉS REEMPLAZAR CON LA BASE DE DATOS
let posts = [

    {
        id_post: 1,
        title: 'Introducción a Node.js',
        content: 'Node.js es un runtime de JavaScript...',
        author_id: 1,
        published: true
    },
    {
        id_post: 2,
        title: 'PostgreSQl vs MySQL',
        content: 'Ambas bases de datos tienen ventajas...',
        author_id: 2,
        published: true
    },
    {
        id_post: 3,
        title: 'APIs RESTful',
        content: 'REST es un estilo arquitectónico...',
        author_id: 1,
        published: true
    },
    {
        id_post: 4,
        title: 'Manejo de errores en Express',
        content: 'El manejo apropiado de errores...',
        author_id: 3,
        published: false
    },
    {
        id_post: 5,
        title: 'Async/Await explicado',
        content: 'Las promesas simplifican el código asíncrono...',
        author_id: 1,
        published: false
    }
]