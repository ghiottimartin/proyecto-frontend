import history from '../history';

//Actions
import { logout, changeLogin } from "./AuthenticationActions";

//Api
import usuarios from "../api/usuarios";

//Constants
import * as rutas from '../constants/rutas.js';
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import {normalizeDato, normalizeDatos} from "../normalizers/normalizeUsuarios";

//USUARIOLOGUEADO CREATE
export const CREATE_USUARIO = 'CREATE_USUARIO';
export const RESET_CREATE_USUARIO = "RESET_CREATE_USUARIO";
export const REQUEST_CREATE_USUARIO = "REQUEST_CREATE_USUARIO";
export const RECEIVE_CREATE_USUARIO = "RECEIVE_CREATE_USUARIO";
export const ERROR_CREATE_USUARIO = "ERROR_CREATE_USUARIO";

//USUARIOLOGUEADO CREATE
function requestCreateUsuario() {
    return {
        type: REQUEST_CREATE_USUARIO,
    }
}

function reveiceCreateUsuario(message, ruta) {
    return {
        type: RECEIVE_CREATE_USUARIO,
        message: message,
        receivedAt: Date.now(),
        nuevo: {},
        ruta: ruta
    }
}

export function errorCreateUsuario(error) {
    return {
        type: ERROR_CREATE_USUARIO,
        error: error,
    }
}

export function resetCreateUsuario() {
    return {
        type: RESET_CREATE_USUARIO
    }
}

export function createUsuario(usuario) {
    return {
        type: CREATE_USUARIO,
        usuario
    }
}

export function saveCreateUsuario(admin, volverA) {
    return (dispatch, getState) => {
        dispatch(requestCreateUsuario());
        return usuarios.saveCreate(getState().usuarios.create.nuevo, admin)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(function (data) {
                let mensaje = "¡Se ha registro con éxito! Para poder ingresar debe validar su email ingresando al link que le enviamos a su correo."
                if (data.message) {
                    mensaje = data.message;
                }
                let ruta = data.admin ? rutas.GESTION : rutas.LOGIN;
                if (volverA) {
                    ruta = volverA;
                }
                dispatch(reveiceCreateUsuario(mensaje, ruta));
                dispatch(resetCreateUsuario());
                if (ruta) {
                    history.push(ruta);
                } else if(data.admin) {
                    history.push(rutas.GESTION);
                } else {
                    history.push(rutas.LOGIN);
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateUsuario(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then((error) => {
                                if (error.message)
                                    dispatch(errorCreateUsuario(error.message));
                                else
                                    dispatch(errorCreateUsuario(errorMessages.GENERAL_ERROR));
                            })
                            .catch((error) => {
                                dispatch(errorCreateUsuario(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//USUARIO UPDATE
export const UPDATE_USUARIO = 'UPDATE_USUARIO';
export const RESET_UPDATE_USUARIO = "RESET_UPDATE_USUARIO";
export const REQUEST_UPDATE_USUARIO = "REQUEST_UPDATE_USUARIO";
export const RECEIVE_UPDATE_USUARIO = "RECEIVE_UPDATE_USUARIO";
export const ERROR_UPDATE_USUARIO = "ERROR_UPDATE_USUARIO";
function requestUpdateUsuario() {
    return {
        type: REQUEST_UPDATE_USUARIO,
    }
}

function receiveUpdateUsuario(message) {
    return {
        type: RECEIVE_UPDATE_USUARIO,
        receivedAt: Date.now(),
        message: message,
    }
}

function errorUpdateUsuario(error) {
    return {
        type: ERROR_UPDATE_USUARIO,
        error: error,
    }
}

export function resetUpdateUsuario() {
    return {
        type: RESET_UPDATE_USUARIO
    }
}

export function updateUsuario(usuario) {
    return {
        type: UPDATE_USUARIO,
        usuario
    }
}

export function saveUpdateUsuario(habilitar) {
    return (dispatch, getState) => {
        dispatch(requestUpdateUsuario());
        return usuarios.saveUpdate(getState().usuarios.update.activo, habilitar)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    dispatch(receiveUpdateUsuario());
                    return response.json();
                }
            })
            .then((respuesta) => {
                if (habilitar) {
                    dispatch(receiveUpdateUsuario("Usuario habilitado con éxito"));
                    dispatch(resetUsuarios())
                    dispatch(fetchUsuarios())
                    return;
                }
                let usuario  = respuesta.datos.usuario;
                let logueado = getState().usuarios.update.logueado;
                dispatch(resetUpdateUsuario());
                dispatch(updateUsuario(usuario));
                if (logueado.id === usuario.id) {
                    dispatch(receiveUsuarioLogueado(usuario));
                }
                const volverA = rutas.getQuery('volverA');
                const valido  = rutas.validarRuta(volverA);
                if (valido && respuesta.datos.esAdmin) {
                    history.push(volverA);
                } else {
                    history.push(rutas.INICIO);
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateUsuario(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorUpdateUsuario(error.message));
                                else
                                    dispatch(errorUpdateUsuario(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorUpdateUsuario(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//USUARIO LOGUEADO
export const INVALIDATE_USUARIO_LOGUEADO = 'INVALIDATE_USUARIO_LOGUEADO';
export const REQUEST_USUARIO_LOGUEADO = "REQUEST_USUARIO_LOGUEADO";
export const RECEIVE_USUARIO_LOGUEADO = "RECEIVE_USUARIO_LOGUEADO";
export const ERROR_USUARIO_LOGUEADO = "ERROR_USUARIO_LOGUEADO";
export const RESET_USUARIO_LOGUEADO = "RECET_USUARIO_LOGUEADO";

export function invalidateUsuarioLogueado() {
    return {
        type: INVALIDATE_USUARIO_LOGUEADO,
    }
}

export function resetUsuarioLogueado() {
    return {
        type: RESET_USUARIO_LOGUEADO
    }
}

function requestUsuarioLogueado() {
    return {
        type: REQUEST_USUARIO_LOGUEADO,
    }
}

function receiveUsuarioLogueado(json) {
    return {
        type: RECEIVE_USUARIO_LOGUEADO,
        usuario: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorUsuarioLogueado(error) {
    return {
        type: ERROR_USUARIO_LOGUEADO,
        error: error,
    }
}

export function fetchUsuarioLogueado() {
    return dispatch => {
        dispatch(requestUsuarioLogueado());
        return usuarios.getLogueado()
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveUsuarioLogueado(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUsuarioLogueado(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        dispatch(errorUsuarioLogueado(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchUsuarioLogueado(state) {
    const usuarios = state.usuarios.update;
    if (usuarios.isFetchingUsuarioLogueado) {
        return false
    } else if (!usuarios.activo.id && state.authentication.token) {
        return true
    } else {
        return usuarios.didInvalidate;
    }
}

export function fetchUsuarioLogueadoIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchUsuarioLogueado(getState())) {
            return dispatch(fetchUsuarioLogueado())
        }
    }
}

//USUARIO LOGUEADO
export const INVALIDATE_USUARIOS = 'INVALIDATE_USUARIOS';
export const REQUEST_USUARIOS    = "REQUEST_USUARIOS";
export const RECEIVE_USUARIOS    = "RECEIVE_USUARIOS";
export const ERROR_USUARIOS      = "ERROR_USUARIOS";
export const RESET_USUARIOS      = "RESET_USUARIOS";

export function invalidateUsuarios() {
    return {
        type: INVALIDATE_USUARIOS,
    }
}

export function resetUsuarios() {
    return {
        type: RESET_USUARIOS
    }
}

function requestUsuarios() {
    return {
        type: REQUEST_USUARIOS,
    }
}

function receiveUsuarios(json) {
    return {
        type: RECEIVE_USUARIOS,
        usuarios: normalizeDatos(json.usuarios),
        total: json.total,
        registros: json.registros,
        receivedAt: Date.now()
    }
}

function errorUsuarios(error) {
    return {
        type: ERROR_USUARIOS,
        error: error,
    }
}

export function fetchUsuarios() {
    return (dispatch, getState) => {
        dispatch(requestUsuarios());
        return usuarios.getUsuarios(getState().usuarios.byId.filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                if (data.exito) {
                    dispatch(receiveUsuarios(data.datos));
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUsuarios(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorUsuarios(error.message));
                                else
                                    dispatch(errorUsuarios(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorUsuarios(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

function shouldFetchUsuarios(state) {
    const usuariosById   = state.usuarios.byId;
    const usuariosAllIds = state.usuarios.allIds;
    if (usuariosById.isFetching) {
        return false;
    } else if (usuariosAllIds.length === 0) {
        return true;
    } else {
        return usuariosById.didInvalidate;
    }
}

export function fetchUsuariosIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchUsuarios(getState())) {
            return dispatch(fetchUsuarios())
        }
    }
}

//USUARIO LOGUEADO
export const INVALIDATE_USUARIO_ID = 'INVALIDATE_USUARIO_ID';
export const REQUEST_USUARIO_ID    = "REQUEST_USUARIO_ID";
export const RECEIVE_USUARIO_ID    = "RECEIVE_USUARIO_ID";
export const ERROR_USUARIO_ID      = "ERROR_USUARIO_ID";
export const RESET_USUARIO_ID      = "RESET_USUARIO_ID";

export function invalidateUsuarioById() {
    return {
        type: INVALIDATE_USUARIO_ID,
    }
}

export function resetUsuarioById() {
    return {
        type: RESET_USUARIO_ID
    }
}

function requestUsuarioById() {
    return {
        type: REQUEST_USUARIO_ID,
    }
}

function receiveUsuarioById(json) {
    return {
        type: RECEIVE_USUARIO_ID,
        usuario: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorUsuarioById(error) {
    return {
        type: ERROR_USUARIO_ID,
        error: error,
    }
}

export function fetchUsuarioById(id) {
    return dispatch => {
        dispatch(requestUsuarioById());
        return usuarios.getUsuario(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveUsuarioById(data));
                dispatch(updateUsuario(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUsuarios(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        dispatch(errorUsuarios(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchUsuarioById(id, state) {
    const usuariosById   = state.usuarios.byId;
    const usuariosAllIds = state.usuarios.allIds;
    if (usuariosById.isFetchingUsuario) {
        return false;
    } else if (usuariosAllIds.length === 0) {
        return true;
    } else {
        return usuariosById.didInvalidateUsuario;
    }
}

export function fetchUsuarioByIdIfNeeded(id) {
    return (dispatch, getState) => {
        if (shouldFetchUsuarios(id, getState())) {
            return dispatch(fetchUsuarios())
        }
    }
}

//USUARIO DELETE
export const RESET_DELETE_USUARIO   = "RESET_DELETE_USUARIO";
export const REQUEST_DELETE_USUARIO = "REQUEST_DELETE_USUARIO";
export const RECEIVE_DELETE_USUARIO = "RECEIVE_DELETE_USUARIO";
export const ERROR_DELETE_USUARIO = "ERROR_DELETE_USUARIO";
export const RECEIVE_INHABILITAR_USUARIO   = "RECEIVE_INHABILITAR_USUARIO";

function requestDeleteUsuario() {
    return {
        type: REQUEST_DELETE_USUARIO,
    }
}

function receiveDeleteUsuario(id, mensaje) {
    return {
        type: RECEIVE_DELETE_USUARIO,
        receivedAt: Date.now(),
        idUsuario: id,
        success: mensaje
    }
}

function receiveInhabilitarUsuario(mensaje) {
    return {
        type: RECEIVE_INHABILITAR_USUARIO,
        receivedAt: Date.now(),
        success: mensaje
    }
}

function errorDeleteUsuario(error) {
    return {
        type: ERROR_DELETE_USUARIO,
        error: error,
    }
}

export function resetDeleteUsuario() {
    return {
        type: RESET_DELETE_USUARIO,
    }
}

export function saveDeleteUsuario(id, motivo) {
    return (dispatch, getState) => {
        dispatch(requestDeleteUsuario());
        return usuarios.borrarUsuario(id, motivo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                }
            })
            .then(() => {
                let mensaje = "Usuario borrado con éxito";
                if (motivo) {
                    mensaje = "Usuario inhabilitado con éxito";
                    dispatch(receiveInhabilitarUsuario(mensaje))
                    dispatch(resetUsuarios());
                    dispatch(fetchUsuarios());
                } else {
                    dispatch(resetDeleteUsuario());
                    dispatch(receiveDeleteUsuario(id, mensaje));
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorDeleteUsuario(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorDeleteUsuario(error.message));
                                else
                                    dispatch(errorDeleteUsuario(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorDeleteUsuario(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

// FILTROS INGRESO
export const UPDATE_FILTROS = 'UPDATE_FILTROS';
export const RESET_FILTROS = 'RESET_FILTROS';

export function updateFiltros(filtros) {
    return {
        type: UPDATE_FILTROS,
        filtros
    }
}

export function resetFiltros() {
    return {
        type: RESET_FILTROS
    }
}