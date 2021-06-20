import history from "../history";

//Actions
import { logout } from "./AuthenticationActions";

//Api
import pedidos from "../api/pedidos";

//Constants
import * as rutas from '../constants/rutas.js';
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import {normalizeDato, normalizeDatos} from "../normalizers/normalizePedidos";

//Librerias
import Swal from 'sweetalert2';

//PEDIDO CREATE
export const CREATE_PEDIDO		 = 'CREATE_PEDIDO';
export const RESET_CREATE_PEDIDO   = "RESET_CREATE_PEDIDO";
export const REQUEST_CREATE_PEDIDO = "REQUEST_CREATE_PEDIDO";
export const RECEIVE_CREATE_PEDIDO = "RECEIVE_CREATE_PEDIDO";
export const ERROR_CREATE_PEDIDO   = "ERROR_CREATE_PEDIDO";

//PEDIDOLOGUEADO CREATE
function requestCreatePedido() {
    return {
        type: REQUEST_CREATE_PEDIDO,
    }
}

function reveiceCreatePedido(message, ruta) {
    return {
        type: RECEIVE_CREATE_PEDIDO,
        message: message,
        receivedAt: Date.now(),
        nuevo: {},
        ruta: ruta
    }
}

export function errorCreatePedido(error) {
    return {
        type: ERROR_CREATE_PEDIDO,
        error: error
    }
}

export function resetCreatePedido() {
    return {
        type: RESET_CREATE_PEDIDO
    }
}

export function createPedido(pedido) {
    return {
        type: CREATE_PEDIDO,
        pedido
    }
}

export function saveCreatePedido(volverA) {
    return (dispatch, getState) => {
        dispatch(requestCreatePedido());
        return pedidos.saveCreate(getState().pedidos.create.nuevo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(reveiceCreatePedido());
                dispatch(resetCreatePedido());
                if (data.success && data.pedido) {
                    dispatch(receivePedidoAbierto(data.pedido));
                }
                if (data.forzar) {
                    Swal.fire({
                        title: data.message,
                        icon: 'question',
                        showCloseButton: true,
                        showCancelButton: true,
                        focusConfirm: true,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: 'rgb(88, 219, 131)',
                        cancelButtonColor: '#bfbfbf',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            dispatch(createPedido(data.pedido))
                            dispatch(saveCreatePedido())
                        }
                    });
                }
                if (rutas.validarRuta(volverA)) {
                    history.push(volverA);
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreatePedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorCreatePedido(error.message));
                                else
                                    dispatch(errorCreatePedido(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorCreatePedido(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//PEDIDO FINALIZAR
export const FINALIZAR_PEDIDO		 = 'FINALIZAR_PEDIDO';
export const RESET_FINALIZAR_PEDIDO   = "RESET_FINALIZAR_PEDIDO";
export const REQUEST_FINALIZAR_PEDIDO = "REQUEST_FINALIZAR_PEDIDO";
export const RECEIVE_FINALIZAR_PEDIDO = "RECEIVE_FINALIZAR_PEDIDO";
export const ERROR_FINALIZAR_PEDIDO   = "ERROR_FINALIZAR_PEDIDO";

function requestFinalizarPedido() {
    return {
        type: REQUEST_FINALIZAR_PEDIDO,
    }
}

function receiveFinalizarPedido(mensaje) {
    return {
        type: RECEIVE_FINALIZAR_PEDIDO,
        receivedAt: Date.now(),
        message: mensaje
    }
}

function errorFinalizarPedido(error) {
    return {
        type: ERROR_FINALIZAR_PEDIDO,
        error: error,
    }
}

export function resetFinalizarPedido() {
    return {
        type: RESET_FINALIZAR_PEDIDO
    }
}

export function finalizarPedido(pedido) {
    return {
        type: FINALIZAR_PEDIDO,
        pedido: normalizeDato(pedido)
    }
}

export function saveFinalizarPedido(id) {
    return (dispatch, getState) => {
        dispatch(requestFinalizarPedido());
        return pedidos.saveFinalizar(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then((data) => {
                dispatch(resetCreatePedido());
                if (data.message) {
                    dispatch(receiveFinalizarPedido(data.message));
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorFinalizarPedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorFinalizarPedido(error.message));
                                else
                                    dispatch(errorFinalizarPedido(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorFinalizarPedido(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//PEDIDO LOGUEADO
export const INVALIDATE_PEDIDOS = 'INVALIDATE_PEDIDOS';
export const REQUEST_PEDIDOS    = "REQUEST_PEDIDOS";
export const RECEIVE_PEDIDOS    = "RECEIVE_PEDIDOS";
export const ERROR_PEDIDOS      = "ERROR_PEDIDOS";
export const RESET_PEDIDOS      = "RESET_PEDIDOS";

export function invalidatePedidos() {
    return {
        type: INVALIDATE_PEDIDOS,
    }
}

export function resetPedidos() {
    return {
        type: RESET_PEDIDOS
    }
}

function requestPedidos() {
    return {
        type: REQUEST_PEDIDOS,
    }
}

function receivePedidos(json) {
    return {
        type: RECEIVE_PEDIDOS,
        pedidos: normalizeDatos(json),
        receivedAt: Date.now()
    }
}

function errorPedidos(error) {
    return {
        type: ERROR_PEDIDOS,
        error: error,
    }
}

export function fetchPedidos() {
    return dispatch => {
        dispatch(requestPedidos());
        return pedidos.getAll()
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receivePedidos(data));
            })
            .catch(function (error) {
                //dispatch(logout());
                switch (error.status) {
                    case 401:
                        dispatch(errorPedidos(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorPedidos(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchPedidos(state) {
    const pedidosById   = state.pedidos.byId;
    const pedidosAllIds = state.pedidos.allIds;
    if (pedidosById.isFetching) {
        return false;
    } else if (pedidosAllIds.length === 0) {
        return true;
    } else {
        return pedidosById.didInvalidate;
    }
}

export function fetchPedidosIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchPedidos(getState())) {
            return dispatch(fetchPedidos())
        }
    }
}

//PEDIDO
export const INVALIDATE_PEDIDO_ID = 'INVALIDATE_PEDIDO_ID';
export const REQUEST_PEDIDO_ID    = "REQUEST_PEDIDO_ID";
export const RECEIVE_PEDIDO_ID    = "RECEIVE_PEDIDO_ID";
export const ERROR_PEDIDO_ID      = "ERROR_PEDIDO_ID";
export const RESET_PEDIDO_ID      = "RESET_PEDIDO_ID";

export function invalidatePedidoById() {
    return {
        type: INVALIDATE_PEDIDO_ID,
    }
}

export function resetPedidoById() {
    return {
        type: RESET_PEDIDO_ID
    }
}

function requestPedidoById() {
    return {
        type: REQUEST_PEDIDO_ID,
    }
}

function receivePedidoById(json) {
    return {
        type: RECEIVE_PEDIDO_ID,
        pedido: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorPedidoById(error) {
    return {
        type: ERROR_PEDIDO_ID,
        error: error,
    }
}

export function fetchPedidoById(id) {
    return dispatch => {
        dispatch(requestPedidoById());
        return pedidos.getPedido(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receivePedidoById(data));
            })
            .catch(function (error) {
                //dispatch(logout());
                switch (error.status) {
                    case 401:
                        dispatch(errorPedidos(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorPedidos(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchPedidoById(id, state) {
    const pedidosById   = state.pedidos.byId;
    const pedidosAllIds = state.pedidos.allIds;
    if (pedidosById.isFetchingPedido) {
        return false;
    } else if (pedidosAllIds.length === 0) {
        return true;
    } else {
        return pedidosById.didInvalidatePedido;
    }
}

export function fetchPedidoByIdIfNeeded(id) {
    return (dispatch, getState) => {
        if (shouldFetchPedidos(id, getState())) {
            return dispatch(fetchPedidos())
        }
    }
}

//PEDIDO
export const INVALIDATE_PEDIDO_ABIERTO = 'INVALIDATE_PEDIDO_ABIERTO';
export const REQUEST_PEDIDO_ABIERTO    = "REQUEST_PEDIDO_ABIERTO";
export const RECEIVE_PEDIDO_ABIERTO    = "RECEIVE_PEDIDO_ABIERTO";
export const ERROR_PEDIDO_ABIERTO      = "ERROR_PEDIDO_ABIERTO";
export const RESET_PEDIDO_ABIERTO      = "RESET_PEDIDO_ABIERTO";

export function invalidatePedidoAbierto() {
    return {
        type: INVALIDATE_PEDIDO_ABIERTO,
    }
}

export function resetPedidoAbierto() {
    return {
        type: RESET_PEDIDO_ABIERTO
    }
}

function requestPedidoAbierto() {
    return {
        type: REQUEST_PEDIDO_ABIERTO,
    }
}

function receivePedidoAbierto(json) {
    return {
        type: RECEIVE_PEDIDO_ABIERTO,
        pedido: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorPedidoAbierto(error) {
    return {
        type: ERROR_PEDIDO_ABIERTO,
        error: error,
    }
}

export function fetchPedidoAbierto() {
    return dispatch => {
        dispatch(requestPedidoAbierto());
        return pedidos.getPedidoAbierto()
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receivePedidoAbierto(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorPedidoAbierto(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorPedidoAbierto(error.message));
                                else
                                    dispatch(errorPedidoAbierto(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorPedidoAbierto(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

function shouldFetchPedidoAbierto(state) {
    const pedidosById = state.pedidos.byId;
    const abierto     = pedidosById.abierto;
    if (pedidosById.isFetchingPedido) {
        return false;
    } else if (!abierto.id) {
        return true;
    } else {
        return pedidosById.didInvalidatePedido;
    }
}

export function fetchPedidoAbiertoIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchPedidoAbierto(getState())) {
            return dispatch(fetchPedidoAbierto())
        }
    }
}

//PEDIDO DELETE
export const RESET_DELETE_PEDIDO   = "RESET_DELETE_PEDIDO";
export const REQUEST_DELETE_PEDIDO = "REQUEST_DELETE_PEDIDO";
export const RECEIVE_DELETE_PEDIDO = "RECEIVE_DELETE_PEDIDO";
export const ERROR_DELETE_PEDIDO   = "ERROR_DELETE_PEDIDO";

function requestDeletePedido() {
    return {
        type: REQUEST_DELETE_PEDIDO,
    }
}

function receiveDeletePedido(id, mensaje) {
    return {
        type: RECEIVE_DELETE_PEDIDO,
        receivedAt: Date.now(),
        idPedido: id,
        success: mensaje
    }
}

function errorDeletePedido(error) {
    return {
        type: ERROR_DELETE_PEDIDO,
        error: error,
    }
}

export function resetDeletePedido() {
    return {
        type: RESET_DELETE_PEDIDO,
    }
}

export function saveDeletePedido(id) {
    return (dispatch, getState) => {
        dispatch(requestDeletePedido());
        return pedidos.borrarPedido(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then((respuesta) => {
                let mensaje = respuesta.message;
                dispatch(receiveDeletePedido(id, mensaje));
                dispatch(resetCreatePedido());
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorDeletePedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorDeletePedido(error.message));
                                else
                                    dispatch(errorDeletePedido(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorDeletePedido(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}