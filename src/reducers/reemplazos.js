import { combineReducers } from 'redux'
import merge from "lodash/merge"
import moment from 'moment'

//Actions
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions"
import {
    CREATE_REEMPLAZO, ERROR_CREATE_REEMPLAZO, ERROR_REEMPLAZOS, INVALIDATE_REEMPLAZOS, RECEIVE_CREATE_REEMPLAZO,
    RECEIVE_REEMPLAZOS, REQUEST_CREATE_REEMPLAZO, REQUEST_REEMPLAZOS, RESET_CREATE_REEMPLAZO, RESET_FILTROS,
    RESET_REEMPLAZOS, UPDATE_FILTROS
} from '../actions/ReemplazoMercaderiaActions'

function create(state = {
    isCreating: false,
    nuevo: {
        lineas: [],
    },
    success: "",
    error: null,
    errores: []
}, action) {
    switch (action.type) {
        //CREATE
        case CREATE_REEMPLAZO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.reemplazo),
                error: null,
            });
        case RESET_CREATE_REEMPLAZO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo: {
                    lineas: [],
                },
            });
        case REQUEST_CREATE_REEMPLAZO:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CREATE_REEMPLAZO:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.message,
                error: null,
                ruta: action.ruta,
            });
        case ERROR_CREATE_REEMPLAZO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: action.error,
                errores: action.errores
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: "",
                nuevo: {}
            });
        default:
            return state
    }
}

let hoy = moment()
let haceUnaSemana = moment().subtract(2, 'weeks')

const filtrosIniciales = {
    numero: "",
    fechaDesde: haceUnaSemana.format("YYYY-MM-DD"),
    fechaHasta: hoy.format("YYYY-MM-DD"),
    paginaActual: 1,
    registrosPorPagina: 10,
    estado: "",
    nombreUsuario: ""
}

function reemplazosById(state = {
    isFetching: false,
    didInvalidate: true,
    reemplazos: [],
    filtros: filtrosIniciales,
    resetFiltros: false,
    total: 0,
    registros: 0,
    error: null,
    success: "",
}, action) {
    switch (action.type) {
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                reemplazos: [],
            });
        //REEMPLAZOS
        case INVALIDATE_REEMPLAZOS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_REEMPLAZOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_REEMPLAZOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                reemplazos: action.reemplazos.entities.reemplazos,
                total: action.total,
                registros: action.registros,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_REEMPLAZOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_REEMPLAZOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                reemplazos: [],
            });
        // FILTROS
        case UPDATE_FILTROS:
            return Object.assign({}, state, {
                filtros: merge({}, state.filtros, action.filtros)
            });
        case RESET_FILTROS:
            return Object.assign({}, state, {
                filtros: filtrosIniciales
            });
        default:
            return state
    }
}

function reemplazosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_REEMPLAZOS:
            return action.reemplazos.result ? action.reemplazos.result : [];
        case RESET_REEMPLAZOS:
            return [];
        default:
            return state
    }
}

const reemplazos = combineReducers({
    create: create,
    allIds: reemplazosAllIds,
    byId: reemplazosById,
});

export default reemplazos;