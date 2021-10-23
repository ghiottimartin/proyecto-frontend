import history from "../history";

//Actions
import { logout } from "./AuthenticationActions";

//Api
import categorias from "../api/categorias";

//Constants
import * as rutas from '../constants/rutas.js';
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import {normalizeDato, normalizeDatos} from "../normalizers/normalizeCategorias";

//CATEGORIA CREATE
export const CREATE_CATEGORIA		 = 'CREATE_CATEGORIA';
export const RESET_CREATE_CATEGORIA   = "RESET_CREATE_CATEGORIA";
export const REQUEST_CREATE_CATEGORIA = "REQUEST_CREATE_CATEGORIA";
export const RECEIVE_CREATE_CATEGORIA = "RECEIVE_CREATE_CATEGORIA";
export const ERROR_CREATE_CATEGORIA   = "ERROR_CREATE_CATEGORIA";

//CATEGORIALOGUEADO CREATE
function requestCreateCategoria() {
    return {
        type: REQUEST_CREATE_CATEGORIA,
    }
}

function reveiceCreateCategoria(message, ruta) {
    return {
        type: RECEIVE_CREATE_CATEGORIA,
        message: message,
        receivedAt: Date.now(),
        nueva: {},
        ruta: ruta
    }
}

export function errorCreateCategoria(error) {
    return {
        type: ERROR_CREATE_CATEGORIA,
        error: error,
    }
}

export function resetCreateCategoria() {
    return {
        type: RESET_CREATE_CATEGORIA
    }
}

export function createCategoria(categoria) {
    return {
        type: CREATE_CATEGORIA,
        categoria
    }
}

export function saveCreateCategoria(volverA) {
    return (dispatch, getState) => {
        dispatch(requestCreateCategoria());
        return categorias.saveCreate(getState().categorias.create.nuevo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(function (data) {
                let mensaje = "La categoria ha sido creado con éxito"
                if (data.message) {
                    mensaje = data.message;
                }
                dispatch(reveiceCreateCategoria(mensaje));
                dispatch(resetCreateCategoria());
                if (rutas.validarRuta(volverA)) {
                    history.push(volverA);
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateCategoria(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then((error) => {
                                if (error.message !== "")
                                    dispatch(errorCreateCategoria(error.message));
                                else
                                    dispatch(errorCreateCategoria(errorMessages.GENERAL_ERROR));
                            })
                            .catch((error) => {
                                dispatch(errorCreateCategoria(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//CATEGORIA UPDATE
export const UPDATE_CATEGORIA		  = 'UPDATE_CATEGORIA';
export const RESET_UPDATE_CATEGORIA   = "RESET_UPDATE_CATEGORIA";
export const REQUEST_UPDATE_CATEGORIA = "REQUEST_UPDATE_CATEGORIA";
export const RECEIVE_UPDATE_CATEGORIA = "RECEIVE_UPDATE_CATEGORIA";
export const ERROR_UPDATE_CATEGORIA   = "ERROR_UPDATE_CATEGORIA";

function requestUpdateCategoria() {
    return {
        type: REQUEST_UPDATE_CATEGORIA,
    }
}

function receiveUpdateCategoria() {
    return {
        type: RECEIVE_UPDATE_CATEGORIA,
        receivedAt: Date.now()
    }
}

function errorUpdateCategoria(error) {
    return {
        type: ERROR_UPDATE_CATEGORIA,
        error: error,
    }
}

export function resetUpdateCategoria() {
    return {
        type: RESET_UPDATE_CATEGORIA
    }
}

export function updateCategoria(categoria) {
    return {
        type: UPDATE_CATEGORIA,
        categoria
    }
}

export function saveUpdateCategoria() {
    return (dispatch, getState) => {
        dispatch(requestUpdateCategoria());
        return categorias.saveUpdate(getState().categorias.update.activo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    dispatch(receiveUpdateCategoria());
                    return response.json();
                }
            })
            .then((respuesta) => {
                dispatch(resetUpdateCategoria());
                history.push(rutas.CATEGORIAS_LISTAR_ADMIN);
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateCategoria(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorUpdateCategoria(error.message));
                                else
                                    dispatch(errorUpdateCategoria(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorUpdateCategoria(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//CATEGORIA LOGUEADO
export const INVALIDATE_CATEGORIAS = 'INVALIDATE_CATEGORIAS';
export const REQUEST_CATEGORIAS    = "REQUEST_CATEGORIAS";
export const RECEIVE_CATEGORIAS    = "RECEIVE_CATEGORIAS";
export const ERROR_CATEGORIAS      = "ERROR_CATEGORIAS";
export const RESET_CATEGORIAS      = "RESET_CATEGORIAS";

export function invalidateCategorias() {
    return {
        type: INVALIDATE_CATEGORIAS,
    }
}

export function resetCategorias() {
    return {
        type: RESET_CATEGORIAS
    }
}

function requestCategorias() {
    return {
        type: REQUEST_CATEGORIAS,
    }
}

function receiveCategorias(json) {
    return {
        type: RECEIVE_CATEGORIAS,
        categorias: normalizeDatos(json.categorias),
        receivedAt: Date.now()
    }
}

function errorCategorias(error) {
    return {
        type: ERROR_CATEGORIAS,
        error: error,
    }
}

export function fetchCategorias() {
    return dispatch => {
        dispatch(requestCategorias());
        return categorias.getAll()
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveCategorias(data.datos));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCategorias(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorCategorias(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchCategorias(state) {
    const categoriasById   = state.categorias.byId;
    const categoriasAllIds = state.categorias.allIds;
    if (categoriasById.isFetching) {
        return false;
    } else if (categoriasAllIds.length === 0) {
        return true;
    } else {
        return categoriasById.didInvalidate;
    }
}

export function fetchCategoriasIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchCategorias(getState())) {
            return dispatch(fetchCategorias())
        }
    }
}

//CATEGORIA
export const INVALIDATE_CATEGORIA_ID = 'INVALIDATE_CATEGORIA_ID';
export const REQUEST_CATEGORIA_ID    = "REQUEST_CATEGORIA_ID";
export const RECEIVE_CATEGORIA_ID    = "RECEIVE_CATEGORIA_ID";
export const ERROR_CATEGORIA_ID      = "ERROR_CATEGORIA_ID";
export const RESET_CATEGORIA_ID      = "RESET_CATEGORIA_ID";

export function invalidateCategoriaById() {
    return {
        type: INVALIDATE_CATEGORIA_ID,
    }
}

export function resetCategoriaById() {
    return {
        type: RESET_CATEGORIA_ID
    }
}

function requestCategoriaById() {
    return {
        type: REQUEST_CATEGORIA_ID,
    }
}

function receiveCategoriaById(json) {
    return {
        type: RECEIVE_CATEGORIA_ID,
        categoria: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorCategoriaById(error) {
    return {
        type: ERROR_CATEGORIA_ID,
        error: error,
    }
}

export function fetchCategoriaById(id) {
    return dispatch => {
        dispatch(requestCategoriaById());
        return categorias.getCategoria(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveCategoriaById(data));
                dispatch(updateCategoria(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(logout());
                        dispatch(errorCategorias(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorCategorias(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchCategoriaById(id, state) {
    const categoriasById   = state.categorias.byId;
    const categoriasAllIds = state.categorias.allIds;
    if (categoriasById.isFetchingCategoria) {
        return false;
    } else if (categoriasAllIds.length === 0) {
        return true;
    } else {
        return categoriasById.didInvalidateCategoria;
    }
}

export function fetchCategoriaByIdIfNeeded(id) {
    return (dispatch, getState) => {
        if (shouldFetchCategorias(id, getState())) {
            return dispatch(fetchCategorias())
        }
    }
}

//CATEGORIA DELETE
export const RESET_DELETE_CATEGORIA   = "RESET_DELETE_CATEGORIA";
export const REQUEST_DELETE_CATEGORIA = "REQUEST_DELETE_CATEGORIA";
export const RECEIVE_DELETE_CATEGORIA = "RECEIVE_DELETE_CATEGORIA";
export const ERROR_DELETE_CATEGORIA   = "ERROR_DELETE_CATEGORIA";

function requestDeleteCategoria() {
    return {
        type: REQUEST_DELETE_CATEGORIA,
    }
}

function receiveDeleteCategoria(id, mensaje) {
    return {
        type: RECEIVE_DELETE_CATEGORIA,
        receivedAt: Date.now(),
        idCategoria: id,
        success: mensaje
    }
}

function errorDeleteCategoria(error) {
    return {
        type: ERROR_DELETE_CATEGORIA,
        error: error,
    }
}

export function resetDeleteCategoria() {
    return {
        type: RESET_DELETE_CATEGORIA,
    }
}

export function saveDeleteCategoria(id) {
    return (dispatch, getState) => {
        dispatch(requestDeleteCategoria());
        return categorias.borrarCategoria(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then((respuesta) => {
                let mensaje = respuesta.message;
                dispatch(receiveDeleteCategoria(id, mensaje));
                dispatch(resetDeleteCategoria());
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorDeleteCategoria(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorDeleteCategoria(error.message));
                                else
                                    dispatch(errorDeleteCategoria(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorDeleteCategoria(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}