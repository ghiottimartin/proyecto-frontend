import { combineReducers } from 'redux'
import merge from "lodash/merge"
import moment from 'moment'

//Actions
import {
    CREATE_VENTA,
    RESET_CREATE_VENTA,
    REQUEST_CREATE_VENTA,
    RECEIVE_CREATE_VENTA,
    ERROR_CREATE_VENTA,
    INVALIDATE_VENTAS,
    REQUEST_VENTAS,
    RECEIVE_VENTAS,
    ERROR_VENTAS,
    RESET_VENTAS,
    UPDATE_FILTROS_VENTAS,
    RESET_FILTROS_VENTAS,
    UPDATE_VENTA,
    RECEIVE_ANULAR_VENTA,
    REQUEST_ANULAR_VENTA,
    ERROR_ANULAR_VENTA,
    REQUEST_VENTA_ID,
    RECEIVE_VENTA_ID,
    ERROR_VENTA_ID,
    RECEIVE_PDF_VENTA,
    REQUEST_PDF_VENTA,
    ERROR_PDF_VENTA,
    REQUEST_COMANDA_VENTA,
    ERROR_COMANDA_VENTA,
    RECEIVE_COMANDA_VENTA

} from '../actions/VentaActions';
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions"


let hoy = moment()
let haceUnaSemana = moment().subtract(2, 'weeks')

const filtrosIniciales = {
    numero: "",
    tipo: "",
    fechaDesde: haceUnaSemana.format("YYYY-MM-DD"),
    fechaHasta: hoy.format("YYYY-MM-DD"),
    paginaActual: 1,
    registrosPorPagina: 10,
    estado: "",
    nombreUsuario: ""
}

function ventasById(state = {
    isFetching: false,
    isDownloading: false,
    isCanceling: false,
    didInvalidate: true,
    ventas: [],
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
                ventas: [],
            });
        //VENTAS
        case INVALIDATE_VENTAS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_VENTAS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_VENTAS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                ventas: action.ventas.entities.ventas,
                total: action.total,
                registros: action.registros,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_VENTAS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_VENTAS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                ventas: [],
            });
        // VENTA ID
        case REQUEST_VENTA_ID:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_VENTA_ID:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                ventas: action.venta.entities.venta,
                total: 1,
                registros: 1,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_VENTA_ID:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        // FILTROS
        case UPDATE_FILTROS_VENTAS:
            return Object.assign({}, state, {
                filtros: merge({}, state.filtros, action.filtros)
            });
        case RESET_FILTROS_VENTAS:
            return Object.assign({}, state, {
                filtros: filtrosIniciales
            });
        // COMANDA VENTA
        case REQUEST_COMANDA_VENTA:
            return Object.assign({}, state, {
                isDownloading: true,
                success: "",
                error: null,
            });
        case RECEIVE_COMANDA_VENTA:
            return Object.assign({}, state, {
                isDownloading: false,
                success: "",
                error: null,
            });
        case ERROR_COMANDA_VENTA:
            return Object.assign({}, state, {
                isDownloading: false,
                success: "",
                error: action.error
            });
        default:
            return state
    }
}

function ventasAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_VENTAS:
            return action.ventas.result ? action.ventas.result : [];
        case RECEIVE_VENTA_ID:
            return action.venta.result ? [action.venta.result] : [];
        case RESET_VENTAS:
            return [];
        default:
            return state
    }
}

function create(state = {
    isCreating: false,
    nueva: {
        lineas: [],
    },
    success: "",
    error: null,
    errores: []
}, action) {
    switch (action.type) {
        //CREATE
        case CREATE_VENTA:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nueva: merge({}, state.nueva, action.venta),
                error: null,
            });
        case RESET_CREATE_VENTA:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nueva: {
                    lineas: [],
                },
            });
        case REQUEST_CREATE_VENTA:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CREATE_VENTA:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.message,
                error: null,
                ruta: action.ruta,
            });
        case ERROR_CREATE_VENTA:
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
                nueva: {}
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
        case UPDATE_VENTA:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.venta),
                success: "",
                error: null,
            });
        // ANULACIÓN
        case RECEIVE_ANULAR_VENTA:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.message,
                error: null,
            });
        case REQUEST_ANULAR_VENTA:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case ERROR_ANULAR_VENTA:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        // PDF VENTA
        case REQUEST_PDF_VENTA:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case ERROR_PDF_VENTA:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        default:
            return state
    }
}

const ventas = combineReducers({
    allIds: ventasAllIds,
    byId: ventasById,
    create: create,
    update: update
});

export default ventas;