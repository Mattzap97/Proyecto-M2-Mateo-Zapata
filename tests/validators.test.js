import { describe, test, expect } from 'vitest';
import validators from '../utils/validators.js';

const { validarAutor, validarPost } = validators;

/*==========================================================================================================================================
                                                    TEST PARA VALIDAR AUTOR
====================================================================================================================================================*/
describe('validarAutor', () => {

    test('Acepta un autor válido', () => {

        expect(validarAutor('Mateo Zapata', 'mateo@email.com')).toBe(null);

    })

    test('Rechaza autor sin nombre', () => {

        expect(validarAutor('', 'mateo@email.com')).toBe('Nombre y email son requeridos');

    })

    test('Rechaza autor sin email', () => {

        expect(validarAutor('Mateo Zapata', '')).toBe('Nombre y email son requeridos');

    })

    test('Rechaxa autor sin nombre ni email', () => {

        expect(validarAutor('', '')).toBe('Nombre y email son requeridos');
    })

})


/*=======================================================================================================================================================
                                                    TEST PARA VALIDAR POSTS
=========================================================================================================================================================*/

describe('validarPost', () => {

    test('Acepta un post válido', () => {

        expect(validarPost('Introducción a Node.js', 'Contenido del post', 1)).toBe(null);

    })

    test('Rechaza post sin título', () => {

        expect(validarPost('', 'Contenido del post', 1)).toBe('Título, contenido y author_id son requeridos');

    })

    test('Rechaza post sin contenido', () => {

        expect(validarPost('Introducción a Node.js', '', 1)).toBe('Título, contenido y author_id son requeridos');

    })

    test('Rechaza post sin author_id', () => {

        expect(validarPost('Título', 'Contenido', null)).toBe('Título, contenido y author_id son requeridos');

    })


})