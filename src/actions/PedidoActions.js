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
                if (data.exito) {
                    dispatch(resetCreatePedido());
                    dispatch(receivePedidoAbierto(data));
                }
                if (data.datos && data.datos.pedido === 'borrado') {
                    dispatch(fetchPedidoAbierto())
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

//PEDIDO CERRAR
export const CERRAR_PEDIDO		 = 'CERRAR_PEDIDO';
export const RESET_CERRAR_PEDIDO   = "RESET_CERRAR_PEDIDO";
export const REQUEST_CERRAR_PEDIDO = "REQUEST_CERRAR_PEDIDO";
export const RECEIVE_CERRAR_PEDIDO = "RECEIVE_CERRAR_PEDIDO";
export const ERROR_CERRAR_PEDIDO   = "ERROR_CERRAR_PEDIDO";

function requestCerrarPedido() {
    return {
        type: REQUEST_CERRAR_PEDIDO,
    }
}

function receiveCerrarPedido(mensaje) {
    return {
        type: RECEIVE_CERRAR_PEDIDO,
        receivedAt: Date.now(),
        message: mensaje
    }
}

function errorCerrarPedido(error) {
    return {
        type: ERROR_CERRAR_PEDIDO,
        error: error,
    }
}

export function resetCerrarPedido() {
    return {
        type: RESET_CERRAR_PEDIDO
    }
}

export function saveCerrarPedido(id) {
    return (dispatch, getState) => {
        dispatch(requestCerrarPedido());
        return pedidos.cerrarPedido(id)
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
                    dispatch(receiveCerrarPedido(data.message));
                    dispatch(fetchPedidoAbierto())
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCerrarPedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorCerrarPedido(error.message));
                                else
                                    dispatch(errorCerrarPedido(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorCerrarPedido(errorMessages.GENERAL_ERROR));
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

export function fetchPedidos(idUsuario) {
    return dispatch => {
        dispatch(requestPedidos());
        return pedidos.getAll(idUsuario)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receivePedidos(data.datos));
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
                dispatch(receivePedidoById(data.datos))
                dispatch(updatePedido(data.datos));
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
    if (json && json.datos && json.datos.id) {
        json = normalizeDato(json);
    }
    return {
        type: RECEIVE_PEDIDO_ABIERTO,
        pedido: json,
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
                if (data.exito) {
                    dispatch(receivePedidoAbierto(data));
                }                
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
                dispatch(fetchPedidoAbierto())
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

//PEDIDO UPDATE
export const UPDATE_PEDIDO = 'UPDATE_PEDIDO';

export function updatePedido(pedido) {
    return {
        type: UPDATE_PEDIDO,
        pedido
    }
}

// RECIBIR PEDIDO
export const REQUEST_RECIBIR_PEDIDO = "REQUEST_RECIBIR_PEDIDO";
export const RECEIVE_RECIBIR_PEDIDO = "RECEIVE_RECIBIR_PEDIDO";
export const ERROR_RECIBIR_PEDIDO   = "ERROR_RECIBIR_PEDIDO";


function requestRecibirPedido() {
    return {
        type: REQUEST_RECIBIR_PEDIDO,
    }
}

function receiveRecibirPedido(message) {
    return {
        type: RECEIVE_RECIBIR_PEDIDO,
        success: message,
        receivedAt: Date.now()
    }
}

function errorRecibirPedido(error) {
    return {
        type: ERROR_RECIBIR_PEDIDO,
        error: error,
    }
}

export function recibirPedido(id, idUsuario) {
    return dispatch => {
        dispatch(requestRecibirPedido());
        return pedidos.recibirPedido(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveRecibirPedido(data.message));
                dispatch(resetPedidos())
                dispatch(fetchPedidos(idUsuario))
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorRecibirPedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorRecibirPedido(error.message));
                                else
                                    dispatch(errorRecibirPedido(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorRecibirPedido(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

// CANCELAR PEDIDO
export const REQUEST_CANCELAR_PEDIDO = "REQUEST_CANCELAR_PEDIDO";
export const RECEIVE_CANCELAR_PEDIDO = "RECEIVE_CANCELAR_PEDIDO";
export const ERROR_CANCELAR_PEDIDO   = "ERROR_CANCELAR_PEDIDO";


function requestCancelarPedido() {
    return {
        type: REQUEST_CANCELAR_PEDIDO,
    }
}

function receiveCancelarPedido(message) {
    return {
        type: RECEIVE_CANCELAR_PEDIDO,
        success: message,
        receivedAt: Date.now()
    }
}

function errorCancelarPedido(error) {
    return {
        type: ERROR_CANCELAR_PEDIDO,
        error: error,
    }
}

export function cancelarPedido(id, idUsuario) {
    return dispatch => {
        dispatch(requestCancelarPedido());
        return pedidos.cancelarPedido(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveCancelarPedido(data.message));
                dispatch(resetPedidos())
                dispatch(fetchPedidos(idUsuario))
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCancelarPedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    case 404:
                        dispatch(errorCancelarPedido(errorMessages.GENERAL_ERROR));
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorCancelarPedido(error.message));
                                else
                                    dispatch(errorCancelarPedido(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorCancelarPedido(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//PEDIDO VENDEDOR
export const INVALIDATE_PEDIDOS_VENDEDOR = 'INVALIDATE_PEDIDOS_VENDEDOR';
export const REQUEST_PEDIDOS_VENDEDOR    = "REQUEST_PEDIDOS_VENDEDOR";
export const RECEIVE_PEDIDOS_VENDEDOR    = "RECEIVE_PEDIDOS_VENDEDOR";
export const ERROR_PEDIDOS_VENDEDOR      = "ERROR_PEDIDOS_VENDEDOR";
export const RESET_PEDIDOS_VENDEDOR      = "RESET_PEDIDOS_VENDEDOR";

export function invalidatePedidosVendedor() {
    return {
        type: INVALIDATE_PEDIDOS_VENDEDOR,
    }
}

export function resetPedidosVendedor() {
    return {
        type: RESET_PEDIDOS_VENDEDOR
    }
}

function requestPedidosVendedor() {
    return {
        type: REQUEST_PEDIDOS_VENDEDOR,
    }
}

function receivePedidosVendedor(json) {
    return {
        type: RECEIVE_PEDIDOS_VENDEDOR,
        pedidos: normalizeDatos(json),
        receivedAt: Date.now()
    }
}

function errorPedidosVendedor(error) {
    return {
        type: ERROR_PEDIDOS_VENDEDOR,
        error: error,
    }
}

export function fetchPedidosVendedor() {
    return dispatch => {
        dispatch(requestPedidosVendedor());
        return pedidos.getPedidosVendedor()
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receivePedidosVendedor(data.datos));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorPedidos(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        dispatch(errorPedidos(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}