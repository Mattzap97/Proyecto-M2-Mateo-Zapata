function validarAutor(name, email) {

    if(!name || !email) {
        return 'Nombre y email son requeridos';
    }

    return null;

}


function validarPost(title, content, author_id) {

    if(!title || !content || !author_id) {
        return 'Título, contenido y author_id son requeridos';
    }

    return null;

}


module.exports = {
    validarAutor,
    validarPost
}