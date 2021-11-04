import { combineReducers } from 'redux'
import merge from "lodash/merge"
import moment from 'moment'

//Actions
import {
    CREATE_INGRESO,
    RESET_CREATE_INGRESO,
    REQUEST_CREATE_INGRESO,
    RECEIVE_CREATE_INGRESO,
    ERROR_CREATE_INGRESO,
    INVALIDATE_INGRESOS,
    REQUEST_INGRESOS,
    RECEIVE_INGRESOS,
    ERROR_INGRESOS,
    RESET_INGRESOS,
    UPDATE_FILTROS,
    RESET_FILTROS,
    UPDATE_INGRESO,
    RECEIVE_ANULAR_INGRESO,
    REQUEST_ANULAR_INGRESO,
    ERROR_ANULAR_INGRESO,
    REQUEST_INGRESO_ID,
    RECEIVE_INGRESO_ID,
    ERROR_INGRESO_ID

} from '../actions/IngresoActions';
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions"


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

function ingresosById(state = {
    isFetching: false,
    isCanceling: false,
    didInvalidate: true,
    ingresos: [],
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
                ingresos: [],
            });
        //INGRESOS
        case INVALIDATE_INGRESOS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_INGRESOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_INGRESOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                ingresos: action.ingresos.entities.ingresos,
                total: action.total,
                registros: action.registros,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_INGRESOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_INGRESOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                ingresos: [],
            });
        // INGRESO ID
        case REQUEST_INGRESO_ID:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_INGRESO_ID:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                ingresos: action.ingreso.entities.ingreso,
                total: 1,
                registros: 1,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_INGRESO_ID:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
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

function ingresosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_INGRESOS:
            return action.ingresos.result ? action.ingresos.result : [];
        case RECEIVE_INGRESO_ID:
                return action.ingreso.result ? [action.ingreso.result] : [];
        case RESET_INGRESOS:
             return [];
        default:
            return state
    }
}

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
        case CREATE_INGRESO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.ingreso),
                error: null,
            });
        case RESET_CREATE_INGRESO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo:  {
                    lineas: [],
                },
            });
        case REQUEST_CREATE_INGRESO:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CREATE_INGRESO:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.message,
                error: null,
                ruta: action.ruta,
            });
        case ERROR_CREATE_INGRESO:
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

function update(state = {
    isUpdating: false,
    activo: {},
    success: "",
    error: null
}, action) {
    switch (action.type) {
        case UPDATE_INGRESO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.ingreso),
                success: "",
                error: null,
            });
         // ANULACIÓN
         case RECEIVE_ANULAR_INGRESO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.message,
                error: null,
            });
        case REQUEST_ANULAR_INGRESO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case ERROR_ANULAR_INGRESO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        default:
            return state
    }
}

const ingresos = combineReducers({
    allIds: ingresosAllIds,
    byId:   ingresosById,
    create: create,
    update: update
});

export default ingresos;