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



module.exports = {
    obtenerPosts
}