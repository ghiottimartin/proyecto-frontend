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
            .then((respuesta) => {
                const turno = respuesta.datos.turno
                dispatch(receiveUpdateTurno());
                dispatch(updateTurno(turno));
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