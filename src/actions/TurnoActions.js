import history from '../history';

//Actions
import { logout, changeLogin } from "./AuthenticationActions";

//Api
import turnos from "../api/turnos";

//Constants
import * as rutas from '../constants/rutas.js';
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import { normalizeDato, normalizeDatos } from "../normalizers/normalizeTurnos";

// CREACION TURNO DE MESAS
export const CREATE_TURNO = 'CREATE_TURNO'
export const RESET_CREATE_TURNO = "RESET_CREATE_TURNO"
export const REQUEST_CREATE_TURNO = "REQUEST_CREATE_TURNO"
export const RECEIVE_CREATE_TURNO = "RECEIVE_CREATE_TURNO"
export const ERROR_CREATE_TURNO = "ERROR_CREATE_TURNO"

function requestCreateTurno() {
    return {
        type: REQUEST_CREATE_TURNO,
    }
}

function reveiceCreateTurno(message) {
    return {
        type: RECEIVE_CREATE_TURNO,
        message: message,
        receivedAt: Date.now(),
        turno: {},
    }
}

export function errorCreateTurno(error) {
    return {
        type: ERROR_CREATE_TURNO,
        error: error
    }
}

export function resetCreateTurno() {
    return {
        type: RESET_CREATE_TURNO
    }
}

export function createTurno(turno) {
    return {
        type: CREATE_TURNO,
        turno: turno
    }
}

export function saveCreateTurno(idMesa, nombreMozo) {
    return (dispatch, getState) => {
        dispatch(requestCreateTurno())
        return turnos.saveCreate(idMesa, nombreMozo)
            .then(function (response) {
                var data = response.json()
                return data
            })
            .then(function (data) {
                if (!data.exito) {
                    let mensaje = data.message ? data.message : errorMessages.GENERAL_ERROR
                    dispatch(errorCreateTurno(mensaje))
                    return
                } else {
                    const mesa = data.datos.mesa
                    dispatch(updateTurno(mesa.ultimo_turno, mesa))
                    dispatch(reveiceCreateTurno(data.message))
                    var ruta = rutas.MESA_TURNO + mesa.id
                    history.push(ruta)
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateTurno(errorMessages.UNAUTHORIZED_TOKEN))
                        dispatch(logout())
                        return
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorCreateTurno(error.message))
                                    else
                                        dispatch(errorCreateTurno(errorMessages.GENERAL_ERROR))
                                })
                                .catch(error => {
                                    dispatch(errorCreateTurno(errorMessages.GENERAL_ERROR))
                                })
                        } catch (e) {
                            dispatch(errorCreateTurno(errorMessages.GENERAL_ERROR))
                        }
                        return
                }
            })
    }
}

//TURNO UPDATE
export const UPDATE_TURNO = 'UPDATE_TURNO';
export const RESET_UPDATE_TURNO = "RESET_UPDATE_TURNO";
export const REQUEST_UPDATE_TURNO = "REQUEST_UPDATE_TURNO";
export const RECEIVE_UPDATE_TURNO = "RECEIVE_UPDATE_TURNO";
export const ERROR_UPDATE_TURNO = "ERROR_UPDATE_TURNO";

function requestUpdateTurno() {
    return {
        type: REQUEST_UPDATE_TURNO,
    }
}

function receiveUpdateTurno(message) {
    return {
        type: RECEIVE_UPDATE_TURNO,
        receivedAt: Date.now(),
        message: message,
    }
}

function errorUpdateTurno(error) {
    return {
        type: ERROR_UPDATE_TURNO,
        error: error,
    }
}

export function resetUpdateTurno() {
    return {
        type: RESET_UPDATE_TURNO
    }
}

export function updateTurno(turno, mesa) {
    turno.mesa = mesa
    return {
        type: UPDATE_TURNO,
        turno
    }
}

export function saveUpdateTurno() {
    return (dispatch, getState) => {
        dispatch(requestUpdateTurno());
        return turnos.saveUpdate(getState().turnos.update.activo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(() => {
                history.push(rutas.MESAS_LISTAR)
                dispatch(receiveUpdateTurno());
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateTurno(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorUpdateTurno(error.message));
                                    else
                                        dispatch(errorUpdateTurno(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorUpdateTurno(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorUpdateTurno(errorMessages.GENERAL_ERROR));
                        }
                        return;
                }
            });
    }
}