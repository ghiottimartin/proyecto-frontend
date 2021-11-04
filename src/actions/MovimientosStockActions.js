//Actions
import { logout } from "./AuthenticationActions";

//Api
import movimientos from "../api/movimientos";

//Constants
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import { normalizeDatos } from "../normalizers/normalizeMovimientos";

// BUSCAR MOVIMIENTOS
export const INVALIDATE_MOVIMIENTOS = 'INVALIDATE_MOVIMIENTOS';
export const REQUEST_MOVIMIENTOS = "REQUEST_MOVIMIENTOS";
export const RECEIVE_MOVIMIENTOS = "RECEIVE_MOVIMIENTOS";
export const ERROR_MOVIMIENTOS = "ERROR_MOVIMIENTOS";
export const RESET_MOVIMIENTOS = "RESET_MOVIMIENTOS";

export function invalidateMovimientos() {
    return {
        type: INVALIDATE_MOVIMIENTOS,
    }
}

export function resetMovimientos() {
    return {
        type: RESET_MOVIMIENTOS
    }
}

function requestMovimientos() {
    return {
        type: REQUEST_MOVIMIENTOS,
    }
}

function receiveMovimientos(json) {
    return {
        type: RECEIVE_MOVIMIENTOS,
        movimientos: normalizeDatos(json.movimientos),
        total: json.total,
        registros: json.registros,
        receivedAt: Date.now()
    }
}

function errorMovimientos(error) {
    return {
        type: ERROR_MOVIMIENTOS,
        error: error,
    }
}

export function fetchMovimientos(idProducto, idIngreso) {
    return (dispatch, getState) => {
        dispatch(requestMovimientos());
        let filtros = getState().movimientos.byId.filtros;
        if (!isNaN(idProducto)) {
            filtros.producto = idProducto
        }
        if (!isNaN(idIngreso)) {
            filtros.ingreso = idIngreso
        }
        return movimientos.getAll(filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveMovimientos(data.datos));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorMovimientos(errorMessages.UNAUTHORIZED_TOKEN));
                        //dispatch(logout());
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorMovimientos(error.message));
                                    else
                                        dispatch(errorMovimientos(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorMovimientos(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorMovimientos(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}

function shouldFetchMovimientos(state) {
    const movimientosById = state.movimientos.byId;
    const movimientosAllIds = state.movimientos.allIds;
    if (movimientosById.isFetching) {
        return false;
    } else if (movimientosAllIds.length === 0) {
        return true;
    } else {
        return movimientosById.didInvalidate;
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