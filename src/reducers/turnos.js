import { combineReducers } from 'redux'
import merge from "lodash/merge"
import moment from 'moment'

//Actions
import {
    CREATE_TURNO, ERROR_ANULAR_TURNO, ERROR_CERRAR_TURNO, ERROR_COMANDA_TURNO, ERROR_CREATE_TURNO, ERROR_TURNOS,
    ERROR_UPDATE_TURNO, RECEIVE_ANULAR_TURNO, RECEIVE_CERRAR_TURNO, RECEIVE_COMANDA_TURNO, RECEIVE_CREATE_TURNO,
    RECEIVE_TURNOS, RECEIVE_UPDATE_TURNO, REQUEST_ANULAR_TURNO, REQUEST_CERRAR_TURNO, REQUEST_COMANDA_TURNO,
    REQUEST_CREATE_TURNO, REQUEST_TURNOS, REQUEST_UPDATE_TURNO, RESET_CREATE_TURNO, RESET_FILTROS, RESET_TURNOS,
    RESET_UPDATE_TURNO, UPDATE_FILTROS, UPDATE_TURNO
} from '../actions/TurnoActions'
import { LOGOUT_SUCCESS } from '../actions/AuthenticationActions';

let hoy = moment()
let haceUnaSemana = moment().subtract(2, 'weeks')

const filtrosIniciales = {
    fechaDesde: haceUnaSemana.format("YYYY-MM-DD"),
    fechaHasta: hoy.format("YYYY-MM-DD"),
    estado: ""
}

function turnosById(state = {
    isFetching: false,
    didInvalidate: true,
    turnos: [],
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
                turnos: [],
            });
        // BUSQUEDA DE TURNOS
        case REQUEST_TURNOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_TURNOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                turnos: action.turnos.entities.turnos,
                total: action.total,
                registros: action.registros,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_TURNOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_TURNOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                turnos: [],
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

function turnosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_TURNOS:
            return action.turnos.result ? action.turnos.result : [];
        case RESET_TURNOS:
            return [];
        default:
            return state
    }
}

function create(state = {
    isCreating: false,
    nuevo: {},
    success: "",
    error: null,
}, action) {
    switch (action.type) {
        //CREATE
        case CREATE_TURNO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.mesa),
                error: null,
            });
        case RESET_CREATE_TURNO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo: {},
            });
        case REQUEST_CREATE_TURNO:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CREATE_TURNO:
            return Object.assign({}, state, {
                isCreating: false,
                turno: action.turno,
                error: null,
                success: action.message,
            });
        case ERROR_CREATE_TURNO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: action.error,
                errores: action.errores
            });
        default:
            return state
    }
}

function update(state = {
    isUpdating: false,
    isDownloading: false,
    activo: {
        mozo: '',
        ordenes: [],
    },
    success: "",
    error: null
}, action) {
    switch (action.type) {
        case UPDATE_TURNO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.turno),
                success: "",
                error: null,
            })
        case RESET_UPDATE_TURNO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: {
                    mozo: '',
                    ordenes: [],
                },
                success: "",
                error: null,
            })
        case REQUEST_UPDATE_TURNO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            })
        case RECEIVE_UPDATE_TURNO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            })
        case ERROR_UPDATE_TURNO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            })
        // ANULAR TURNO
        case RECEIVE_ANULAR_TURNO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case REQUEST_ANULAR_TURNO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case ERROR_ANULAR_TURNO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        // CERRAR TURNO
        case RECEIVE_CERRAR_TURNO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case REQUEST_CERRAR_TURNO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case ERROR_CERRAR_TURNO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        // COMANDA TURNO
        case REQUEST_COMANDA_TURNO:
            return Object.assign({}, state, {
                isDownloading: true,
                success: "",
                error: null,
            });
        case RECEIVE_COMANDA_TURNO:
            return Object.assign({}, state, {
                isDownloading: false,
                success: "",
                error: null,
            });
        case ERROR_COMANDA_TURNO:
            return Object.assign({}, state, {
                isDownloading: false,
                success: "",
                error: action.error
            });
        default:
            return state
    }
}

const turnos = combineReducers({
    allIds: turnosAllIds,
    byId: turnosById,
    update: update,
    create: create,
})

export default turnos