import { combineReducers } from 'redux'
import merge from "lodash/merge"

//Actions
import {
    CREATE_MESA,
    RESET_CREATE_MESA,
    REQUEST_CREATE_MESA,
    RECEIVE_CREATE_MESA,
    ERROR_CREATE_MESA,
    INVALIDATE_MESAS,
    REQUEST_MESAS,
    RECEIVE_MESAS,
    ERROR_MESAS,
    RESET_MESAS,
    UPDATE_FILTROS,
    RESET_FILTROS,
    UPDATE_MESA,
    RECEIVE_MESA_ID,
    REQUEST_MESA_ID,
    ERROR_MESA_ID,
    RESET_UPDATE_MESA,
    REQUEST_UPDATE_MESA,
    RECEIVE_UPDATE_MESA,
    ERROR_UPDATE_MESA

} from '../actions/MesaActions';
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions"

const filtrosIniciales = {
    numero: "",
    paginaActual: 1,
    registrosPorPagina: 10,
    estado: ""
}

function mesasById(state = {
    isFetching: false,
    isCanceling: false,
    didInvalidate: true,
    mesas: [],
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
                mesas: [],
            });
        //MESAS
        case INVALIDATE_MESAS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_MESAS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_MESAS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                mesas: action.mesas.entities.mesas,
                total: action.total,
                registros: action.registros,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_MESAS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_MESAS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                mesas: [],
            });
        // MESA ID
        case REQUEST_MESA_ID:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_MESA_ID:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                mesas: action.mesa.entities.mesa,
                total: 1,
                registros: 1,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_MESA_ID:
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

function mesasAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_MESAS:
            return action.mesas.result ? action.mesas.result : [];
        case RECEIVE_MESA_ID:
                return action.mesa.result ? [action.mesa.result] : [];
        case RESET_MESAS:
             return [];
        default:
            return state
    }
}

let mesaDefecto = {
    mozos: [],
    numero: '',
    descripcion: '',
};

function create(state = {
    isCreating: false,
    nuevo: mesaDefecto,
    success: "",
    error: null,
    errores: []
}, action) {
    switch (action.type) {
        //CREATE
        case CREATE_MESA:
            if (action.mesa && Array.isArray(action.mesa.mozos) && action.mesa.mozos.length !== state.nuevo.mozos.lenght) {
                state.nuevo.mozos = action.mesa.mozos
            }
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.mesa),
                error: null,
            });
        case RESET_CREATE_MESA:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo:  {
                    mozos: [],
                },
            });
        case REQUEST_CREATE_MESA:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CREATE_MESA:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.message,
                error: null,
                ruta: action.ruta,
            });
        case ERROR_CREATE_MESA:
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
    activo: mesaDefecto,
    success: "",
    error: null
}, action) {
    switch (action.type) {
        //UPDATE MESA
        case UPDATE_MESA:
            if (action.mesa && Array.isArray(action.mesa.mozos) && action.mesa.mozos.length !== state.activo.mozos.lenght) {
                state.activo.mozos = action.mesa.mozos
            }
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.mesa),
                success: "",
                error: null,
            });
        case RESET_UPDATE_MESA:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: mesaDefecto,
                success: "",
                error: null,
            });
        case REQUEST_UPDATE_MESA:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case RECEIVE_UPDATE_MESA:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case ERROR_UPDATE_MESA:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        default:
            return state
    }
}

const mesas = combineReducers({
    allIds: mesasAllIds,
    byId:   mesasById,
    create: create,
    update: update
});

export default mesas;