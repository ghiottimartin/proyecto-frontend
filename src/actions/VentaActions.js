import history from "../history";

//Actions
import { logout } from "./AuthenticationActions";
import { fetchProductos, resetProductos } from "./ProductoActions";
import { downloadBlob } from "./FileActions";

//Api
import ventas from "../api/ventas";

//Constants
import * as rutas from '../constants/rutas.js';
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import { normalizeDato, normalizeDatos } from "../normalizers/normalizeVentas";

//VENTA CREATE
export const CREATE_VENTA = 'CREATE_VENTA';
export const RESET_CREATE_VENTA = "RESET_CREATE_VENTA";
export const REQUEST_CREATE_VENTA = "REQUEST_CREATE_VENTA";
export const RECEIVE_CREATE_VENTA = "RECEIVE_CREATE_VENTA";
export const ERROR_CREATE_VENTA = "ERROR_CREATE_VENTA";

function requestCreateVenta() {
    return {
        type: REQUEST_CREATE_VENTA,
    }
}

function reveiceCreateVenta(message, ruta) {
    return {
        type: RECEIVE_CREATE_VENTA,
        message: message,
        receivedAt: Date.now(),
        nuevo: {},
        ruta: ruta
    }
}

export function errorCreateVenta(error) {
    return {
        type: ERROR_CREATE_VENTA,
        error: error
    }
}

export function resetCreateVenta() {
    return {
        type: RESET_CREATE_VENTA
    }
}

export function createVenta(venta) {
    return {
        type: CREATE_VENTA,
        venta
    }
}

export function saveCreateVenta() {
    return (dispatch, getState) => {
        dispatch(requestCreateVenta());
        return ventas.saveCreate(getState().ventas.create.nueva)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                let mensaje = "La venta ha sido creado con éxito."
                if (data.message) {
                    mensaje = data.message;
                }
                dispatch(resetProductos())
                dispatch(fetchProductos(false))
                dispatch(reveiceCreateVenta(mensaje));
                dispatch(resetCreateVenta());
                history.push(rutas.VENTA_LISTADO);
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateVenta(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorCreateVenta(error.message));
                                    else
                                        dispatch(errorCreateVenta(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorCreateVenta(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorCreateVenta(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

//BÚSQUEDA DE VENTAS
export const INVALIDATE_VENTAS = 'INVALIDATE_VENTAS';
export const REQUEST_VENTAS = "REQUEST_VENTAS";
export const RECEIVE_VENTAS = "RECEIVE_VENTAS";
export const ERROR_VENTAS = "ERROR_VENTAS";
export const RESET_VENTAS = "RESET_VENTAS";

export function invalidateVentas() {
    return {
        type: INVALIDATE_VENTAS,
    }
}

export function resetVentas() {
    return {
        type: RESET_VENTAS
    }
}

function requestVentas() {
    return {
        type: REQUEST_VENTAS,
    }
}

function receiveVentas(json) {
    return {
        type: RECEIVE_VENTAS,
        ventas: normalizeDatos(json.ventas),
        total: json.total,
        registros: json.registros,
        receivedAt: Date.now()
    }
}

function errorVentas(error) {
    return {
        type: ERROR_VENTAS,
        error: error,
    }
}

export function fetchVentas() {
    return (dispatch, getState) => {
        dispatch(requestVentas());
        return ventas.getAll(getState().ventas.byId.filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveVentas(data.datos));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorVentas(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout())
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorVentas(error.message));
                                    else
                                        dispatch(errorVentas(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorVentas(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorVentas(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

function shouldFetchVentas(state) {
    const ventasById = state.ventas.byId;
    const ventasAllIds = state.ventas.allIds;
    if (ventasById.isFetching) {
        return false;
    } else if (ventasAllIds.length === 0) {
        return true;
    } else {
        return ventasById.didInvalidate;
    }
}

export function fetchVentasIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchVentas(getState())) {
            return dispatch(fetchVentas())
        }
    }
}


// FILTROS VENTA
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

// VENTA UPDATE
export const UPDATE_VENTA = 'UPDATE_VENTA';

export function updateVenta(venta) {
    return {
        type: UPDATE_VENTA,
        venta: venta
    }
}

// BUSCAR VENTA
export const INVALIDATE_VENTA_ID = 'INVALIDATE_VENTA_ID';
export const REQUEST_VENTA_ID = "REQUEST_VENTA_ID";
export const RECEIVE_VENTA_ID = "RECEIVE_VENTA_ID";
export const ERROR_VENTA_ID = "ERROR_VENTA_ID";
export const RESET_VENTA_ID = "RESET_VENTA_ID";

export function invalidateVentaById() {
    return {
        type: INVALIDATE_VENTA_ID,
    }
}

export function resetVentaById() {
    return {
        type: RESET_VENTA_ID
    }
}

function requestVentaById() {
    return {
        type: REQUEST_VENTA_ID,
    }
}

function receiveVentaById(json) {
    return {
        type: RECEIVE_VENTA_ID,
        venta: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorVentaById(error) {
    return {
        type: ERROR_VENTA_ID,
        error: error,
    }
}

export function fetchVentaById(id) {
    return dispatch => {
        dispatch(requestVentaById());
        return ventas.getVenta(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveVentaById(data))
                dispatch(updateVenta(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(logout())
                        dispatch(errorVentaById(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorVentaById(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

// ANULAR VENTA
export const REQUEST_ANULAR_VENTA = "REQUEST_ANULAR_VENTA";
export const RECEIVE_ANULAR_VENTA = "RECEIVE_ANULAR_VENTA";
export const ERROR_ANULAR_VENTA = "ERROR_ANULAR_VENTA";


function requestAnularVenta() {
    return {
        type: REQUEST_ANULAR_VENTA,
    }
}

function receiveAnularVenta(id, message) {
    return {
        type: RECEIVE_ANULAR_VENTA,
        idAnulado: id,
        message: message,
        receivedAt: Date.now()
    }
}

function errorAnularVenta(error) {
    return {
        type: ERROR_ANULAR_VENTA,
        error: error,
    }
}

export function anularVenta(id) {
    return dispatch => {
        dispatch(requestAnularVenta());
        return ventas.anularVenta(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveAnularVenta(id, data.message));
                dispatch(resetVentas())
                dispatch(fetchVentas())
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorAnularVenta(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    case 404:
                        dispatch(errorAnularVenta(errorMessages.GENERAL_ERROR));
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorAnularVenta(error.message));
                                    else
                                        dispatch(errorAnularVenta(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorAnularVenta(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorAnularVenta(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

// PDF VENTA
export const REQUEST_PDF_VENTA = "REQUEST_PDF_VENTA";
export const RECEIVE_PDF_VENTA = "RECEIVE_PDF_VENTA";
export const ERROR_PDF_VENTA = "ERROR_PDF_VENTA";


function requestPdfVenta() {
    return {
        type: REQUEST_PDF_VENTA,
    }
}

function receivePdfVenta(blob, nombre) {
    downloadBlob(blob, nombre);
    return {
        type: RECEIVE_PDF_VENTA,
        message: 'La venta se ha exportado a pdf con éxito',
        receivedAt: Date.now()
    }
}

function errorPdfVenta(error) {
    return {
        type: ERROR_PDF_VENTA,
        error: error,
    }
}

export function pdfVenta(id) {
    return dispatch => {
        dispatch(requestPdfVenta());
        return ventas.pdf(id)
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
                var nombre = `Venta ${id_texto}.pdf`;
                dispatch(receivePdfVenta(blob, nombre));
                dispatch(resetVentas())
                dispatch(fetchVentas())
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorPdfVenta(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    case 404:
                        dispatch(errorPdfVenta(errorMessages.GENERAL_ERROR));
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorPdfVenta(error.message));
                                    else
                                        dispatch(errorPdfVenta(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorPdfVenta(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorPdfVenta(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

// PDF COMANDA VENTA
export const REQUEST_COMANDA_VENTA = "REQUEST_COMANDA_VENTA";
export const RECEIVE_COMANDA_VENTA = "RECEIVE_COMANDA_VENTA";
export const ERROR_COMANDA_VENTA = "ERROR_COMANDA_VENTA";


function requestComandaVenta() {
    return {
        type: REQUEST_COMANDA_VENTA,
    }
}

function receiveComandaVenta(blob, nombre) {
    downloadBlob(blob, nombre);
    return {
        type: RECEIVE_COMANDA_VENTA,
        message: 'La comanda de la venta se ha exportado a pdf con éxito',
        receivedAt: Date.now()
    }
}

function errorComandaVenta(error) {
    return {
        type: ERROR_COMANDA_VENTA,
        error: error,
    }
}

export function comandaVenta(id) {
    return dispatch => {
        dispatch(requestComandaVenta());
        return ventas.comanda(id)
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
                var nombre = `Comanda Venta ${id_texto}.pdf`;
                dispatch(receiveComandaVenta(blob, nombre));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorComandaVenta(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    case 404:
                        dispatch(errorComandaVenta(errorMessages.GENERAL_ERROR));
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorComandaVenta(error.message));
                                    else
                                        dispatch(errorComandaVenta(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorComandaVenta(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorComandaVenta(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}