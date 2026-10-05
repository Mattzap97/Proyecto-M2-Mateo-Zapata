function validarAutor(name, email) {

    if(!name || !email) {
        return 'Nombre y email son requeridos';
    }

    return null;

}

function validarId(id) {

    if(!/^\d+$/.test(id)) {
        return 'El ID debe ser un número';
    }

    if(Number(id) <= 0) {
        return 'El ID debe ser mayor que 0';
    }

    return null;
}


function validarPost(title, content, author_id) {

    if(!title || !content || !author_id) {
        return 'Título, contenido y author_id son requeridos';
    }

    return null;

}


function validarPublished(published) {

    if(published === undefined) {
        return null
    }

    if(published !== 'true' && published !== 'false') {
        return 'published debe ser true o false';
    }

    return null;

}



module.exports = {
    validarAutor,
    validarPost,
    validarId,
    validarPublished
}