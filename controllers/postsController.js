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


module.exports = {
    obtenerPosts,
    obtenerPost
}