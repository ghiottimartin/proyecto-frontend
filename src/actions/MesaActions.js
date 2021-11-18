import history from "../history"

//Actions
import { logout } from "./AuthenticationActions"
import { updateTurno } from "./TurnoActions"

//Api
import mesas from "../api/mesas"

//Constants
import * as rutas from '../constants/rutas.js'
import * as errorMessages from '../constants/MessageConstants'

//Normalizer
import { normalizeDato, normalizeDatos } from "../normalizers/normalizeMesas"


// CREACION DE MESAS
export const CREATE_MESA = 'CREATE_MESA'
export const RESET_CREATE_MESA = "RESET_CREATE_MESA"
export const REQUEST_CREATE_MESA = "REQUEST_CREATE_MESA"
export const RECEIVE_CREATE_MESA = "RECEIVE_CREATE_MESA"
export const ERROR_CREATE_MESA = "ERROR_CREATE_MESA"

function requestCreateMesa() {
    return {
        type: REQUEST_CREATE_MESA,
    }
}

function reveiceCreateMesa(message, ruta) {
    return {
        type: RECEIVE_CREATE_MESA,
        message: message,
        receivedAt: Date.now(),
        nuevo: {},
        ruta: ruta
    }
}

export function errorCreateMesa(error) {
    return {
        type: ERROR_CREATE_MESA,
        error: error
    }
}

export function resetCreateMesa() {
    return {
        type: RESET_CREATE_MESA
    }
}

export function createMesa(mesa) {
    return {
        type: CREATE_MESA,
        mesa
    }
}

export function saveCreateMesa() {
    return (dispatch, getState) => {
        dispatch(requestCreateMesa())
        return mesas.saveCreate(getState().mesas.create.nuevo)
            .then(function (response) {
                var data = response.json()
                return data
            })
            .then(function (data) {
                if (!data.exito) {
                    let mensaje = data.message ? data.message : errorMessages.GENERAL_ERROR
                    dispatch(errorCreateMesa(mensaje))
                    return
                } else {
                    let mensaje = "La mesa ha sido creada con éxito"
                    if (data.message) {
                        mensaje = data.message
                    }
                    dispatch(resetMesas())
                    dispatch(fetchMesas())
                    dispatch(reveiceCreateMesa(mensaje))
                    dispatch(resetCreateMesa())
                    history.push(rutas.MESAS_LISTAR)
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateMesa(errorMessages.UNAUTHORIZED_TOKEN))
                        dispatch(logout())
                        return
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorCreateMesa(error.message))
                                    else
                                        dispatch(errorCreateMesa(errorMessages.GENERAL_ERROR))
                                })
                                .catch(error => {
                                    dispatch(errorCreateMesa(errorMessages.GENERAL_ERROR))
                                })
                        } catch (e) {
                            dispatch(errorCreateMesa(errorMessages.GENERAL_ERROR))
                        }
                        return
                }
            })
    }
}

// BUSQUEDA DE MESAS
export const INVALIDATE_MESAS = 'INVALIDATE_MESAS'
export const REQUEST_MESAS = "REQUEST_MESAS"
export const RECEIVE_MESAS = "RECEIVE_MESAS"
export const ERROR_MESAS = "ERROR_MESAS"
export const RESET_MESAS = "RESET_MESAS"

export function invalidateMesas() {
    return {
        type: INVALIDATE_MESAS,
    }
}

export function resetMesas() {
    return {
        type: RESET_MESAS
    }
}

function requestMesas() {
    return {
        type: REQUEST_MESAS,
    }
}

function receiveMesas(json) {
    return {
        type: RECEIVE_MESAS,
        mesas: normalizeDatos(json.mesas),
        total: json.total,
        registros: json.registros,
        receivedAt: Date.now()
    }
}

function errorMesas(error) {
    return {
        type: ERROR_MESAS,
        error: error,
    }
}

export function fetchMesas() {
    return (dispatch, getState) => {
        dispatch(requestMesas())
        return mesas.getAll(getState().mesas.byId.filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response)
                } else {
                    var data = response.json()
                    return data
                }
            })
            .then(function (data) {
                dispatch(receiveMesas(data.datos))
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorMesas(errorMessages.UNAUTHORIZED_TOKEN))
                        dispatch(logout())
                        return
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorMesas(error.message))
                                    else
                                        dispatch(errorMesas(errorMessages.GENERAL_ERROR))
                                })
                                .catch(error => {
                                    dispatch(errorMesas(errorMessages.GENERAL_ERROR))
                                })
                        } catch (e) {
                            dispatch(errorMesas(errorMessages.GENERAL_ERROR))
                        }
                        return
                }
            })
    }
}

function shouldFetchMesas(state) {
    const mesasById = state.mesas.byId
    const mesasAllIds = state.mesas.allIds
    if (mesasById.isFetching) {
        return false
    } else if (mesasAllIds.length === 0) {
        return true
    } else {
        return mesasById.didInvalidate
    }
}

export function fetchMesasIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchMesas(getState())) {
            return dispatch(fetchMesas())
        }
    }
}


// FILTROS MESA
export const UPDATE_FILTROS = 'UPDATE_FILTROS'
export const RESET_FILTROS = 'RESET_FILTROS'

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

//MESA UPDATE
export const UPDATE_MESA		 = 'UPDATE_MESA'
export const RESET_UPDATE_MESA   = "RESET_UPDATE_MESA"
export const REQUEST_UPDATE_MESA = "REQUEST_UPDATE_MESA"
export const RECEIVE_UPDATE_MESA = "RECEIVE_UPDATE_MESA"
export const ERROR_UPDATE_MESA   = "ERROR_UPDATE_MESA"

function requestUpdateMesa() {
    return {
        type: REQUEST_UPDATE_MESA,
    }
}

function receiveUpdateMesa() {
    return {
        type: RECEIVE_UPDATE_MESA,
        receivedAt: Date.now()
    }
}

function errorUpdateMesa(error) {
    return {
        type: ERROR_UPDATE_MESA,
        error: error,
    }
}

export function resetUpdateMesa() {
    return {
        type: RESET_UPDATE_MESA
    }
}

export function updateMesa(mesa) {
    return {
        type: UPDATE_MESA,
        mesa
    }
}

export function saveUpdateMesa() {
    return (dispatch, getState) => {
        dispatch(requestUpdateMesa())
        return mesas.saveUpdate(getState().mesas.update.activo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response)
                } else {
                    dispatch(receiveUpdateMesa())
                    return response.json()
                }
            })
            .then((respuesta) => {
                dispatch(resetUpdateMesa())
                history.push(rutas.MESAS_LISTAR)
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateMesa(errorMessages.UNAUTHORIZED_TOKEN))
                        dispatch(logout())
                        return Promise.reject(error)
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorUpdateMesa(error.message))
                                    else
                                        dispatch(errorUpdateMesa(errorMessages.GENERAL_ERROR))
                                })
                                .catch(error => {
                                    dispatch(errorUpdateMesa(errorMessages.GENERAL_ERROR))
                                })
                        } catch (e) {
                            dispatch(errorUpdateMesa(errorMessages.GENERAL_ERROR))
                        }
                        return
                }
            })
    }
}

// BUSQUEDA DE MESA POR ID
export const INVALIDATE_MESA_ID = 'INVALIDATE_MESA_ID'
export const REQUEST_MESA_ID    = "REQUEST_MESA_ID"
export const RECEIVE_MESA_ID    = "RECEIVE_MESA_ID"
export const ERROR_MESA_ID      = "ERROR_MESA_ID"
export const RESET_MESA_ID      = "RESET_MESA_ID"

export function invalidateMesaById() {
    return {
        type: INVALIDATE_MESA_ID,
    }
}

export function resetMesaById() {
    return {
        type: RESET_MESA_ID
    }
}

function requestMesaById() {
    return {
        type: REQUEST_MESA_ID,
    }
}

function receiveMesaById(json) {
    return {
        type: RECEIVE_MESA_ID,
        mesa: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorMesaById(error) {
    return {
        type: ERROR_MESA_ID,
        error: error,
    }
}

export function fetchMesaById(id) {
    return dispatch => {
        dispatch(requestMesaById())
        return mesas.getMesa(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response)
                } else {
                    var data = response.json()
                    return data
                }
            })
            .then(function (data) {
                if (data.ultimo_turno) {
                    var turno = data.ultimo_turno
                    dispatch(updateTurno(turno, data))
                }
                dispatch(receiveMesaById(data))
                dispatch(updateMesa(data))
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(logout())
                        dispatch(errorMesas(errorMessages.UNAUTHORIZED_TOKEN))
                        return
                    default:
                        dispatch(errorMesas(errorMessages.GENERAL_ERROR))
                        return
                }
            })
    }
}

function shouldFetchMesaById(id, state) {
    const mesasById   = state.mesas.byId
    const mesasAllIds = state.mesas.allIds
    if (mesasById.isFetchingMesa) {
        return false
    } else if (mesasAllIds.length === 0) {
        return true
    } else {
        return mesasById.didInvalidateMesa
    }
}

export function fetchMesaByIdIfNeeded(id) {
    return (dispatch, getState) => {
        if (shouldFetchMesas(id, getState())) {
            return dispatch(fetchMesas())
        }
    }
}

//MESA DELETE
export const RESET_DELETE_MESA   = "RESET_DELETE_MESA"
export const REQUEST_DELETE_MESA = "REQUEST_DELETE_MESA"
export const RECEIVE_DELETE_MESA = "RECEIVE_DELETE_MESA"
export const ERROR_DELETE_MESA   = "ERROR_DELETE_MESA"

function requestDeleteMesa() {
    return {
        type: REQUEST_DELETE_MESA,
    }
}

function receiveDeleteMesa(id, mensaje) {
    return {
        type: RECEIVE_DELETE_MESA,
        receivedAt: Date.now(),
        idMesa: id,
        success: mensaje
    }
}

function errorDeleteMesa(error) {
    return {
        type: ERROR_DELETE_MESA,
        error: error,
    }
}

export function resetDeleteMesa() {
    return {
        type: RESET_DELETE_MESA,
    }
}

export function saveDeleteMesa(id) {
    return (dispatch, getState) => {
        dispatch(requestDeleteMesa())
        return mesas.borrarMesa(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response)
                } else {
                    return response.json()
                }
            })
            .then((respuesta) => {
                let mensaje = respuesta.message
                dispatch(receiveDeleteMesa(id, mensaje))
                dispatch(resetDeleteMesa())
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorDeleteMesa(errorMessages.UNAUTHORIZED_TOKEN))
                        dispatch(logout())
                        return Promise.reject(error)
                    default:
                        try {
                            error.json()
                                .then(error => {
                                    if (error.message !== "")
                                        dispatch(errorDeleteMesa(error.message))
                                    else
                                        dispatch(errorDeleteMesa(errorMessages.GENERAL_ERROR))
                                })
                                .catch(error => {
                                    dispatch(errorDeleteMesa(errorMessages.GENERAL_ERROR))
                                })
                        } catch (e) {
                            dispatch(errorDeleteMesa(errorMessages.GENERAL_ERROR))
                        }
                        return
                }
            })
    }
}