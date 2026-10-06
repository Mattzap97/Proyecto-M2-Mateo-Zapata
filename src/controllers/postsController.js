/*===================================================================================================================================================
                                        EJECUCIÓN DE LA LÓGICA Y CONSULTAS SQL PARA POSTS
======================================================================================================================================================*/

const pool = require('../config/dbConnect');

const obtenerPosts = async (req, res) => {
    const { published } = req.query;

    try{
        let query = 'SELECT * FROM posts';
        let params = [];

        if (published !== undefined) {
            query += ' WHERE published = $1';
            params.push(published === 'true');
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {

        console.error('Error al obtener posts:', error);
        res.status(500).json({error: 'Error al obtener posts'});

    }
}



const obtenerPost = async (req, res) => {

    try{

        const result = await pool.query('SELECT * FROM posts WHERE id_post = $1', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No se pudo encontrar el post'});
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener el post:', error);
        res.status(500).json({error: 'Error al obtener el post'});

    }
}



const obtenerPostsPorAutor = async (req, res) => {

    try {

        const result = await pool.query ('SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
            [req.params.authorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No se encontró post relacionado al autor'})
        }

        res.json(result.rows);

    } catch (error) {

        console.error('Error obteniendo posts del autor:', error);
        res.status(500).json({error: 'Error obteniendo posts del autor'});

    }

}



const crearPost = async (req, res) => {
    const { title, content, author_id, published } = req.body;

    try {

        const result = await pool.query('INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, author_id, published || false]
        );

        res.status(201).json({
            message: 'Post creado exitosamente',
            post: result.rows[0]
        });

    } catch (error) {
        console.error('Error al crear post:', error);

        if (error.code === '23503') {
            return res.status(404).json({error: 'El autor especificado no existe'});
        }

        res.status(500).json({error: 'Error al crear post'});
    }

}



const actualizarPost = async (req, res) => {

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

}



const eliminarPost = async (req, res) => {

    try{

        const result = await pool.query('DELETE FROM posts WHERE id_post = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({error: 'No se encontró el post'});
        }

        res.json({message: 'Post eliminado exitosamente'});

    } catch (error) {

        console.error('Error al eliminar post:', error);
        res.status(500).json({error: 'Error al eliminar post'});
    }

}




module.exports = {
    obtenerPosts,
    obtenerPost,
    obtenerPostsPorAutor,
    crearPost,
    actualizarPost,
    eliminarPost
}