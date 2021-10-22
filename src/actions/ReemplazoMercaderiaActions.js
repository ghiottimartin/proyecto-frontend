import history from "../history";

//Actions
import { logout } from "./AuthenticationActions";

//Api
import reemplazos from "../api/reemplazoMercaderia";

//Constants
import * as rutas from '../constants/rutas.js';
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import { normalizeDato, normalizeDatos } from "../normalizers/normalizeReemplazosMercaderia";

//REEMPLAZO CREATE
export const CREATE_REEMPLAZO = 'CREATE_REEMPLAZO';
export const RESET_CREATE_REEMPLAZO = "RESET_CREATE_REEMPLAZO";
export const REQUEST_CREATE_REEMPLAZO = "REQUEST_CREATE_REEMPLAZO";
export const RECEIVE_CREATE_REEMPLAZO = "RECEIVE_CREATE_REEMPLAZO";
export const ERROR_CREATE_REEMPLAZO = "ERROR_CREATE_REEMPLAZO";

// REEMPLAZO CREATE
function requestCreateReemplazo() {
    return {
        type: REQUEST_CREATE_REEMPLAZO,
    }
}

function reveiceCreateReemplazo(message, ruta) {
    return {
        type: RECEIVE_CREATE_REEMPLAZO,
        message: message,
        receivedAt: Date.now(),
        nuevo: {},
        ruta: ruta
    }
}

export function errorCreateReemplazo(error) {
    return {
        type: ERROR_CREATE_REEMPLAZO,
        error: error
    }
}

export function resetCreateReemplazo() {
    return {
        type: RESET_CREATE_REEMPLAZO
    }
}

export function createReemplazo(reemplazo) {
    return {
        type: CREATE_REEMPLAZO,
        reemplazo
    }
}

export function saveCreateReemplazo() {
    return (dispatch, getState) => {
        dispatch(requestCreateReemplazo());
        return reemplazos.saveCreate(getState().reemplazos.create.nuevo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                let mensaje = "El reemplazo ha sido creado con éxito"
                if (data.message) {
                    mensaje = data.message;
                }
                dispatch(reveiceCreateReemplazo(mensaje));
                dispatch(resetCreateReemplazo());
                history.push(rutas.REEMPLAZO_MERCADERIA_LISTAR);
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateReemplazo(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorCreateReemplazo(error.message));
                                else
                                    dispatch(errorCreateReemplazo(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorCreateReemplazo(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

// FILTROS REEMPLAZOS
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

//REEMPLAZOS LOGUEADO
export const INVALIDATE_REEMPLAZOS = 'INVALIDATE_REEMPLAZOS';
export const REQUEST_REEMPLAZOS = "REQUEST_REEMPLAZOS";
export const RECEIVE_REEMPLAZOS = "RECEIVE_REEMPLAZOS";
export const ERROR_REEMPLAZOS = "ERROR_REEMPLAZOS";
export const RESET_REEMPLAZOS = "RESET_REEMPLAZOS";

export function invalidateReemplazos() {
    return {
        type: INVALIDATE_REEMPLAZOS,
    }
}

export function resetReemplazos() {
    return {
        type: RESET_REEMPLAZOS
    }
}

function requestReemplazos() {
    return {
        type: REQUEST_REEMPLAZOS,
    }
}

function receiveReemplazos(json) {
    return {
        type: RECEIVE_REEMPLAZOS,
        reemplazos: normalizeDatos(json.reemplazos),
        total: json.total,
        registros: json.registros,
        receivedAt: Date.now()
    }
}

function errorReemplazos(error) {
    return {
        type: ERROR_REEMPLAZOS,
        error: error,
    }
}

export function fetchReemplazos() {
    return (dispatch, getState) => {
        dispatch(requestReemplazos());
        return reemplazos.getAll(getState().reemplazos.byId.filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveReemplazos(data.datos));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorReemplazos(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout())
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorReemplazos(error.message));
                                else
                                    dispatch(errorReemplazos(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorReemplazos(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}