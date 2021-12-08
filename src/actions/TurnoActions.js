import history from '../history';

//Actions
import { logout } from "./AuthenticationActions";
import { downloadBlob } from "./FileActions";

//Api
import turnos from "../api/turnos";

//Constants
import * as rutas from '../constants/rutas.js';
import * as errorMessages from '../constants/MessageConstants';

//Normalizer
import { normalizeDatos } from "../normalizers/normalizeTurnos";
import { fetchMesaById, updateMesa } from './MesaActions';
import { fetchProductos, resetProductos } from './ProductoActions';

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

export function saveUpdateTurno(volverA, mensaje) {
    return (dispatch, getState) => {
        if (mensaje !== false) {
            dispatch(requestUpdateTurno());
        }

        const turno = getState().turnos.update.activo
        return turnos.saveUpdate(getState().turnos.update.activo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(() => {
                dispatch(resetProductos())
                dispatch(fetchProductos(false))
                if (rutas.validarRuta(volverA)) {
                    history.push(volverA)
                } else {
                    history.push(rutas.MESAS_LISTAR)
                }
                if (mensaje !== false) {
                    dispatch(resetUpdateTurno());
                    dispatch(fetchMesaById(turno.mesa.id));
                } else {
                    dispatch(receiveUpdateTurno());
                }
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

// ANULAR TURNO
export const REQUEST_ANULAR_TURNO = "REQUEST_ANULAR_TURNO";
export const RECEIVE_ANULAR_TURNO = "RECEIVE_ANULAR_TURNO";
export const ERROR_ANULAR_TURNO = "ERROR_ANULAR_TURNO";


function requestAnularTurno() {
    return {
        type: REQUEST_ANULAR_TURNO,
    }
}

function receiveAnularTurno(id, message) {
    return {
        type: RECEIVE_ANULAR_TURNO,
        idAnulado: id,
        success: message,
        receivedAt: Date.now()
    }
}

function errorAnularTurno(error) {
    return {
        type: ERROR_ANULAR_TURNO,
        error: error,
    }
}

export function anularTurno(id) {
    return dispatch => {
        dispatch(requestAnularTurno());
        return turnos.anular(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveAnularTurno(id, data.message));
                dispatch(resetUpdateTurno())
                history.push(rutas.MESAS_LISTAR)
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorAnularTurno(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    case 404:
                        dispatch(errorAnularTurno(errorMessages.GENERAL_ERROR));
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorAnularTurno(error.message));
                                    else
                                        dispatch(errorAnularTurno(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorAnularTurno(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorAnularTurno(errorMessages.GENERAL_ERROR));
                        }

                        return;
                }
            });
    }
}

// CERRAR TURNO
export const REQUEST_CERRAR_TURNO = "REQUEST_CERRAR_TURNO";
export const RECEIVE_CERRAR_TURNO = "RECEIVE_CERRAR_TURNO";
export const ERROR_CERRAR_TURNO = "ERROR_CERRAR_TURNO";


function requestCerrarTurno() {
    return {
        type: REQUEST_CERRAR_TURNO,
    }
}

function receiveCerrarTurno(message) {
    return {
        type: RECEIVE_CERRAR_TURNO,
        success: message,
        receivedAt: Date.now()
    }
}

function errorCerrarTurno(error) {
    return {
        type: ERROR_CERRAR_TURNO,
        error: error,
    }
}

export function cerrarTurno(turno) {
    return dispatch => {
        dispatch(requestCerrarTurno());
        return turnos.cerrar(turno)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveCerrarTurno(data.message));
                dispatch(resetUpdateTurno())
                history.push(rutas.MESAS_LISTAR)
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCerrarTurno(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    case 404:
                        dispatch(errorCerrarTurno(errorMessages.GENERAL_ERROR));
                        return;
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorCerrarTurno(error.message));
                                    else
                                        dispatch(errorCerrarTurno(errorMessages.GENERAL_ERROR));
                                })
                                .catch(error => {
                                    dispatch(errorCerrarTurno(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                            dispatch(errorCerrarTurno(errorMessages.GENERAL_ERROR));
                        }

                        return;
                }
            });
    }
}

// FILTROS TURNOS
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

// BUSQUEDA DE TURNOS
export const INVALIDATE_TURNOS = 'INVALIDATE_TURNOS'
export const REQUEST_TURNOS = "REQUEST_TURNOS"
export const RECEIVE_TURNOS = "RECEIVE_TURNOS"
export const ERROR_TURNOS = "ERROR_TURNOS"
export const RESET_TURNOS = "RESET_TURNOS"

export function resetTurnos() {
    return {
        type: RESET_TURNOS
    }
}

function requestTurnos() {
    return {
        type: REQUEST_TURNOS,
    }
}

function receiveTurnos(json) {
    return {
        type: RECEIVE_TURNOS,
        turnos: normalizeDatos(json.turnos),
        total: json.total,
        registros: json.registros,
        receivedAt: Date.now()
    }
}

function errorTurnos(error) {
    return {
        type: ERROR_TURNOS,
        error: error,
    }
}

export function fetchTurnos(idMesa) {
    return (dispatch, getState) => {
        dispatch(requestTurnos())
        return turnos.getAll(idMesa, getState().turnos.byId.filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response)
                } else {
                    var data = response.json()
                    return data
                }
            })
            .then(function (data) {
                const datos = data.datos
                const mesa = datos.mesa
                dispatch(updateMesa(mesa))
                dispatch(receiveTurnos(data.datos))
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorTurnos(errorMessages.UNAUTHORIZED_TOKEN))
                        dispatch(logout())
                        return
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorTurnos(error.message))
                                    else
                                        dispatch(errorTurnos(errorMessages.GENERAL_ERROR))
                                })
                                .catch(error => {
                                    dispatch(errorTurnos(errorMessages.GENERAL_ERROR))
                                })
                        } catch (e) {
                            dispatch(errorTurnos(errorMessages.GENERAL_ERROR))
                        }
                        return
                }
            })
    }
}

// PDF COMANDA VENTA
export const REQUEST_COMANDA_TURNO = "REQUEST_COMANDA_TURNO";
export const RECEIVE_COMANDA_TURNO = "RECEIVE_COMANDA_TURNO";
export const ERROR_COMANDA_TURNO = "ERROR_COMANDA_TURNO";


function requestComanda() {
    return {
        type: REQUEST_COMANDA_TURNO,
    }
}

function receiveComanda(blob, nombre) {
    downloadBlob(blob, nombre);
    return {
        type: RECEIVE_COMANDA_TURNO,
        message: 'La comanda del turno se ha exportado a pdf con éxito',
        receivedAt: Date.now()
    }
}

function errorComanda(error) {
    return {
        type: ERROR_COMANDA_TURNO,
        error: error,
    }
}

export function comanda(id) {
    return dispatch => {
        dispatch(requestComanda());
        return turnos.comanda(id)
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
                var nombre = `Comanda Turno ${id_texto}.pdf`;
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