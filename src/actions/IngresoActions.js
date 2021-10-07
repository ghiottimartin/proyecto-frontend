import history from "../history";

//Actions
import { logout } from "./AuthenticationActions";

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

//INGRESOLOGUEADO CREATE
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

export function saveCreateIngreso(volverA) {
    return (dispatch, getState) => {
        dispatch(requestCreateIngreso());
        return ingresos.saveCreate(getState().ingresos.create.nuevo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    return true;
                }
            })
            .then(function (data) {
                let mensaje = "El ingreso ha sido creado con éxito"
                if (data.message) {
                    mensaje = data.message;
                }
                dispatch(reveiceCreateIngreso(mensaje));
                dispatch(resetCreateIngreso());
                if (rutas.validarRuta(volverA)) {
                    history.push(volverA);
                }
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