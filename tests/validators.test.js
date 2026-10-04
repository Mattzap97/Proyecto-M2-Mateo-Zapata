import { describe, test, expect } from 'vitest';
import validators from '../utils/validators.js';

const { validarAutor, validarPost, validarId, validarPublished } = validators;

/*=========================================================================================================================================================================
                                                            TEST PARA VALIDAR AUTOR
==========================================================================================================================================================================*/
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


/*===================================================================================================================================================================
                                                            TEST PARA VALIDAR ID
=====================================================================================================================================================================*/

describe('validarId', () => {

    test('Acepta un ID válido', () => {
        expect(validarId('12')).toBe(null);
    })

    test('Rechaza un ID que no es númerico', () => {
        expect(validarId('abc')).toContain('número');
    })

    test('Rechaza un ID menor o igual a 0', () => {
        expect(validarId('0')).toContain('mayor que 0');
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


/*====================================================================================================================================================================
                                                        TEST PARA VALIDAR PUBLISHED
=========================================================================================================================================================================*/

describe('validarPublished', () => {

    test('Acepta true', () => {
        expect(validarPublished('true')).toBe(null);
    })

    test('Acepta false', () => {
        expect(validarPublished('false')).toBe(null);
    })

    test('Acepta undefined porque es opcional', () => {
        expect(validarPublished(undefined)).toBe(null);
    })

    test('Rechaza un valor diferente de true o false', () => {
        expect(validarPublished('hola')).toContain('true o false');
    })
    
})