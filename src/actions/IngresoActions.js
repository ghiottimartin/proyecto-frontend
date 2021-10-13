import history from "../history";

//Actions
import { logout } from "./AuthenticationActions";
import { fetchProductos, resetProductos } from "./ProductoActions";

//Api
import ingresos from "../api/ingresos";

//Constants
import * as rutas from '../constants/rutas.js';
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import {normalizeDato, normalizeDatos} from "../normalizers/normalizeIngresos";

//INGRESO CREATE
export const CREATE_INGRESO		 = 'CREATE_INGRESO';
export const RESET_CREATE_INGRESO   = "RESET_CREATE_INGRESO";
export const REQUEST_CREATE_INGRESO = "REQUEST_CREATE_INGRESO";
export const RECEIVE_CREATE_INGRESO = "RECEIVE_CREATE_INGRESO";
export const ERROR_CREATE_INGRESO   = "ERROR_CREATE_INGRESO";

// INGRESO CREATE
function requestCreateIngreso() {
    return {
        type: REQUEST_CREATE_INGRESO,
    }
}

function reveiceCreateIngreso(message, ruta) {
    return {
        type: RECEIVE_CREATE_INGRESO,
        message: message,
        receivedAt: Date.now(),
        nuevo: {},
        ruta: ruta
    }
}

export function errorCreateIngreso(error) {
    return {
        type: ERROR_CREATE_INGRESO,
        error: error
    }
}

export function resetCreateIngreso() {
    return {
        type: RESET_CREATE_INGRESO
    }
}

export function createIngreso(ingreso) {
    return {
        type: CREATE_INGRESO,
        ingreso
    }
}

export function saveCreateIngreso() {
    return (dispatch, getState) => {
        dispatch(requestCreateIngreso());
        return ingresos.saveCreate(getState().ingresos.create.nuevo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                let mensaje = "El ingreso ha sido creado con éxito"
                if (data.message) {
                    mensaje = data.message;
                }
                dispatch(resetProductos())
                dispatch(fetchProductos())
                dispatch(reveiceCreateIngreso(mensaje));
                dispatch(resetCreateIngreso());
                history.push(rutas.INGRESO_MERCADERIA);
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateIngreso(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorCreateIngreso(error.message));
                                else
                                    dispatch(errorCreateIngreso(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorCreateIngreso(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//INGRESOS LOGUEADO
export const INVALIDATE_INGRESOS = 'INVALIDATE_INGRESOS';
export const REQUEST_INGRESOS    = "REQUEST_INGRESOS";
export const RECEIVE_INGRESOS    = "RECEIVE_INGRESOS";
export const ERROR_INGRESOS      = "ERROR_INGRESOS";
export const RESET_INGRESOS      = "RESET_INGRESOS";

export function invalidateIngresos() {
    return {
        type: INVALIDATE_INGRESOS,
    }
}

export function resetIngresos() {
    return {
        type: RESET_INGRESOS
    }
}

function requestIngresos() {
    return {
        type: REQUEST_INGRESOS,
    }
}

function receiveIngresos(json) {
    return {
        type: RECEIVE_INGRESOS,
        ingresos: normalizeDatos(json.ingresos),
        total: json.total,
        registros: json.registros,
        receivedAt: Date.now()
    }
}

function errorIngresos(error) {
    return {
        type: ERROR_INGRESOS,
        error: error,
    }
}

export function fetchIngresos() {
    return (dispatch, getState) => {
        dispatch(requestIngresos());
        return ingresos.getAll(getState().ingresos.byId.filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveIngresos(data.datos));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorIngresos(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout())
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorIngresos(error.message));
                                else
                                    dispatch(errorIngresos(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorIngresos(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

function shouldFetchIngresos(state) {
    const ingresosById   = state.ingresos.byId;
    const ingresosAllIds = state.ingresos.allIds;
    if (ingresosById.isFetching) {
        return false;
    } else if (ingresosAllIds.length === 0) {
        return true;
    } else {
        return ingresosById.didInvalidate;
    }
}

export function fetchIngresosIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchIngresos(getState())) {
            return dispatch(fetchIngresos())
        }
    }
}


// FILTROS PEDIDO
export const UPDATE_FILTROS = 'UPDATE_FILTROS';
export const RESET_FILTROS  = 'RESET_FILTROS';

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