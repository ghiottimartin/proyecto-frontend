import history from "../history";

//Actions
import { logout } from "./AuthenticationActions";
import { downloadBlob } from "./FileActions";

//Api
import pedidos from "../api/pedidos";

//Constants
import * as rutas from '../constants/rutas.js';
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import { normalizeDato, normalizeDatos } from "../normalizers/normalizePedidos";
import { fetchProductos, resetProductos } from "./ProductoActions";

//PEDIDO CREATE
export const CREATE_PEDIDO = 'CREATE_PEDIDO';
export const RESET_CREATE_PEDIDO = "RESET_CREATE_PEDIDO";
export const REQUEST_CREATE_PEDIDO = "REQUEST_CREATE_PEDIDO";
export const RECEIVE_CREATE_PEDIDO = "RECEIVE_CREATE_PEDIDO";
export const ERROR_CREATE_PEDIDO = "ERROR_CREATE_PEDIDO";

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
            .then(() => {
                //Necesario para que actualice las líneas del carrito.
                dispatch(resetCerrarPedido())
            })
            .catch(function (error) {
                dispatch(resetPedidoAbierto())
                dispatch(fetchPedidoAbierto())
                switch (error.status) {
                    case 401:
                        dispatch(errorCreatePedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        try {
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
                        } catch (e) {
                            dispatch(errorCreatePedido(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

//PEDIDO CERRAR
export const CERRAR_PEDIDO = 'CERRAR_PEDIDO';
export const RESET_CERRAR_PEDIDO = "RESET_CERRAR_PEDIDO";
export const REQUEST_CERRAR_PEDIDO = "REQUEST_CERRAR_PEDIDO";
export const RECEIVE_CERRAR_PEDIDO = "RECEIVE_CERRAR_PEDIDO";
export const ERROR_CERRAR_PEDIDO = "ERROR_CERRAR_PEDIDO";

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

export function saveCerrarPedido(id, cambio) {
    return (dispatch, getState) => {
        dispatch(requestCerrarPedido());
        return pedidos.cerrarPedido(id, cambio)
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
                    dispatch(resetProductos())
                    dispatch(fetchProductos(false))
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCerrarPedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        try {
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
                        } catch (e) {
                            dispatch(errorCerrarPedido(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

// BUSCAR PEDIDOS
export const INVALIDATE_PEDIDOS = 'INVALIDATE_PEDIDOS';
export const REQUEST_PEDIDOS = "REQUEST_PEDIDOS";
export const RECEIVE_PEDIDOS = "RECEIVE_PEDIDOS";
export const ERROR_PEDIDOS = "ERROR_PEDIDOS";
export const RESET_PEDIDOS = "RESET_PEDIDOS";

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
        pedidos: normalizeDatos(json.pedidos),
        total: json.total,
        registros: json.registros,
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
    return (dispatch, getState) => {
        dispatch(requestPedidos());
        let filtros = getState().pedidos.byId.filtros;
        return pedidos.getAll(idUsuario, filtros)
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
    const pedidosById = state.pedidos.byId;
    const pedidosAllIds = state.pedidos.allIds;
    if (pedidosById.isFetching) {
        return false;
    } else if (pedidosAllIds.length === 0) {
        return true;
    } else {
        return pedidosById.didInvalidate;
    }
}

//PEDIDO
export const INVALIDATE_PEDIDO_ID = 'INVALIDATE_PEDIDO_ID';
export const REQUEST_PEDIDO_ID = "REQUEST_PEDIDO_ID";
export const RECEIVE_PEDIDO_ID = "RECEIVE_PEDIDO_ID";
export const ERROR_PEDIDO_ID = "ERROR_PEDIDO_ID";
export const RESET_PEDIDO_ID = "RESET_PEDIDO_ID";

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
    const pedidosById = state.pedidos.byId;
    const pedidosAllIds = state.pedidos.allIds;
    if (pedidosById.isFetchingPedido) {
        return false;
    } else if (pedidosAllIds.length === 0) {
        return true;
    } else {
        return pedidosById.didInvalidatePedido;
    }
}

//PEDIDO
export const INVALIDATE_PEDIDO_ABIERTO = 'INVALIDATE_PEDIDO_ABIERTO';
export const REQUEST_PEDIDO_ABIERTO = "REQUEST_PEDIDO_ABIERTO";
export const RECEIVE_PEDIDO_ABIERTO = "RECEIVE_PEDIDO_ABIERTO";
export const ERROR_PEDIDO_ABIERTO = "ERROR_PEDIDO_ABIERTO";
export const RESET_PEDIDO_ABIERTO = "RESET_PEDIDO_ABIERTO";

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
    const datos = json.datos ? json.datos : {};
    const en_curso = datos && datos.en_curso !== undefined && datos.en_curso === true;
    const disponible = datos && datos.disponible !== undefined && datos.disponible === true;
    return {
        type: RECEIVE_PEDIDO_ABIERTO,
        pedido: datos,
        en_curso: en_curso,
        disponible: disponible,
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
                        //dispatch(logout()); No realizamos logout porque se le permite estar logueado.
                        return;
                    default:
                        try {
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
                        } catch (e) {
                            dispatch(errorPedidoAbierto(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

function shouldFetchPedidoAbierto(state) {
    const pedidosById = state.pedidos.byId;
    const abierto = pedidosById.abierto;
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
export const RESET_DELETE_PEDIDO = "RESET_DELETE_PEDIDO";
export const REQUEST_DELETE_PEDIDO = "REQUEST_DELETE_PEDIDO";
export const RECEIVE_DELETE_PEDIDO = "RECEIVE_DELETE_PEDIDO";
export const ERROR_DELETE_PEDIDO = "ERROR_DELETE_PEDIDO";

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
                        try {
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
                        } catch (e) {
                            dispatch(errorDeletePedido(errorMessages.GENERAL_ERROR));
                        }
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

// ENTREGAR PEDIDO
export const REQUEST_ENTREGAR_PEDIDO = "REQUEST_ENTREGAR_PEDIDO";
export const RECEIVE_ENTREGAR_PEDIDO = "RECEIVE_ENTREGAR_PEDIDO";
export const ERROR_ENTREGAR_PEDIDO = "ERROR_ENTREGAR_PEDIDO";


function requestEntregarPedido() {
    return {
        type: REQUEST_ENTREGAR_PEDIDO,
    }
}

function receiveEntregarPedido(message) {
    return {
        type: RECEIVE_ENTREGAR_PEDIDO,
        success: message,
        receivedAt: Date.now()
    }
}

function errorEntregarPedido(error) {
    return {
        type: ERROR_ENTREGAR_PEDIDO,
        error: error,
    }
}

export function entregarPedido(id, idUsuario, listadoVendedor) {
    return dispatch => {
        dispatch(requestEntregarPedido());
        return pedidos.entregarPedido(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveEntregarPedido(data.message));
                dispatch(resetPedidos())
                if (listadoVendedor) {
                    dispatch(fetchPedidosVendedor())
                    history.push(rutas.PEDIDOS_VENDEDOR)
                } else {
                    dispatch(fetchPedidos(idUsuario))
                    history.push(rutas.PEDIDOS_COMENSAL)
                }
            })
            .catch(function (error) {
                dispatch(resetPedidos())
                if (listadoVendedor) {
                    dispatch(fetchPedidosVendedor())
                    history.push(rutas.PEDIDOS_VENDEDOR)
                } else {
                    dispatch(fetchPedidos(idUsuario))
                    history.push(rutas.PEDIDOS_COMENSAL)
                }
                switch (error.status) {
                    case 401:
                        dispatch(errorEntregarPedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorEntregarPedido(error.message));
                                    else
                                        dispatch(errorEntregarPedido(errorMessages.GENERAL_ERROR));
                                })
                                .catch(() => {
                                    dispatch(errorEntregarPedido(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorEntregarPedido(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

// ANULAR PEDIDO
export const REQUEST_ANULAR_PEDIDO = "REQUEST_ANULAR_PEDIDO";
export const RECEIVE_ANULAR_PEDIDO = "RECEIVE_ANULAR_PEDIDO";
export const ERROR_ANULAR_PEDIDO = "ERROR_ANULAR_PEDIDO";


function requestAnularPedido() {
    return {
        type: REQUEST_ANULAR_PEDIDO,
    }
}

function receiveAnularPedido(id, message) {
    return {
        type: RECEIVE_ANULAR_PEDIDO,
        idAnulado: id,
        success: message,
        receivedAt: Date.now()
    }
}

function errorAnularPedido(error) {
    return {
        type: ERROR_ANULAR_PEDIDO,
        error: error,
    }
}

export function anularPedido(id, idUsuario, listadoVendedor, motivo) {
    return dispatch => {
        dispatch(requestAnularPedido());
        return pedidos.anularPedido(id, motivo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveAnularPedido(id, data.message));
                dispatch(resetPedidos())
                dispatch(resetPedidoAbierto())
                dispatch(fetchPedidoAbierto())
                if (listadoVendedor) {
                    dispatch(fetchPedidosVendedor())
                } else {
                    dispatch(fetchPedidos(idUsuario))
                }
            })
            .catch(function (error) {
                dispatch(resetPedidos())
                if (listadoVendedor) {
                    dispatch(fetchPedidosVendedor())
                    history.push(rutas.PEDIDOS_VENDEDOR)
                } else {
                    dispatch(fetchPedidos(idUsuario))
                    history.push(rutas.PEDIDOS_COMENSAL)
                }
                switch (error.status) {
                    case 401:
                        dispatch(errorAnularPedido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    case 404:
                        dispatch(errorAnularPedido(errorMessages.GENERAL_ERROR));
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorAnularPedido(error.message));
                                    else
                                        dispatch(errorAnularPedido(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorAnularPedido(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorAnularPedido(errorMessages.GENERAL_ERROR));
                        }

                        return;
                }
            });
    }
}

//PEDIDO VENDEDOR
export const INVALIDATE_PEDIDOS_VENDEDOR = 'INVALIDATE_PEDIDOS_VENDEDOR';
export const REQUEST_PEDIDOS_VENDEDOR = "REQUEST_PEDIDOS_VENDEDOR";
export const RECEIVE_PEDIDOS_VENDEDOR = "RECEIVE_PEDIDOS_VENDEDOR";
export const ERROR_PEDIDOS_VENDEDOR = "ERROR_PEDIDOS_VENDEDOR";
export const RESET_PEDIDOS_VENDEDOR = "RESET_PEDIDOS_VENDEDOR";

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
        pedidos: normalizeDatos(json.pedidos),
        total: json.total,
        registros: json.registros,
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
    return (dispatch, getState) => {
        dispatch(requestPedidosVendedor());
        let filtros = getState().pedidos.byId.filtros;
        return pedidos.getPedidosVendedor(filtros)
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
                dispatch(resetPedidoAbierto())
                dispatch(fetchPedidoAbierto())
                history.push(rutas.PEDIDOS_VENDEDOR)
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorPedidos("No está autorizado para ver los pedidos vendidos."));
                        history.push(rutas.PEDIDOS_COMENSAL)
                        return;
                    default:
                        dispatch(errorPedidos(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

// FILTROS PEDIDO
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

// PEDIDO DISPONIBLE
export const REQUEST_PEDIDO_DISPONIBLE = "REQUEST_PEDIDO_DISPONIBLE";
export const RECEIVE_PEDIDO_DISPONIBLE = "RECEIVE_PEDIDO_DISPONIBLE";
export const ERROR_PEDIDO_DISPONIBLE = "ERROR_PEDIDO_DISPONIBLE";


function requestPedidoDisponible() {
    return {
        type: REQUEST_PEDIDO_DISPONIBLE,
    }
}

function receivePedidoDisponible(message) {
    return {
        type: RECEIVE_PEDIDO_DISPONIBLE,
        success: message,
        receivedAt: Date.now()
    }
}

function errorPedidoDisponible(error) {
    return {
        type: ERROR_PEDIDO_DISPONIBLE,
        error: error,
    }
}

export function pedidoDisponible(id, idUsuario, listadoVendedor) {
    return dispatch => {
        dispatch(requestPedidoDisponible());
        return pedidos.pedidoDisponible(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receivePedidoDisponible(data.message));
                dispatch(resetPedidos())
                dispatch(resetPedidoAbierto())
                dispatch(fetchPedidoAbierto())
                if (listadoVendedor) {
                    dispatch(fetchPedidosVendedor())
                } else {
                    dispatch(fetchPedidos(idUsuario))
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorPedidoDisponible(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    case 404:
                        dispatch(errorPedidoDisponible(errorMessages.GENERAL_ERROR));
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorPedidoDisponible(error.message));
                                    else
                                        dispatch(errorPedidoDisponible(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorPedidoDisponible(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorPedidoDisponible(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

// PDF COMANDA PEDIDO
export const REQUEST_COMANDA_PEDIDO = "REQUEST_COMANDA_PEDIDO";
export const RECEIVE_COMANDA_PEDIDO = "RECEIVE_COMANDA_PEDIDO";
export const ERROR_COMANDA_PEDIDO = "ERROR_COMANDA_PEDIDO";


function requestComanda() {
    return {
        type: REQUEST_COMANDA_PEDIDO,
    }
}

function receiveComanda(blob, nombre) {
    downloadBlob(blob, nombre);
    return {
        type: RECEIVE_COMANDA_PEDIDO,
        message: 'La comanda del pedido se ha exportado a pdf con éxito',
        receivedAt: Date.now()
    }
}

function errorComanda(error) {
    return {
        type: ERROR_COMANDA_PEDIDO,
        error: error,
    }
}

export function comanda(id) {
    return dispatch => {
        dispatch(requestComanda());
        return pedidos.comanda(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.blob();
                    return data;
                }
            })
            .then(function (blob) {
                var id_texto = id.toString().padStart(5, 0);
                var nombre = `Comanda Pedido ${id_texto}.pdf`;
                dispatch(receiveComanda(blob, nombre));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorComanda(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    case 404:
                        dispatch(errorComanda(errorMessages.GENERAL_ERROR));
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorComanda(error.message));
                                    else
                                        dispatch(errorComanda(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorComanda(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorComanda(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}