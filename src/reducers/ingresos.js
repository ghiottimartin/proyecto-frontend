import { combineReducers } from 'redux';
import merge from "lodash/merge";

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
    RESET_INGRESOS

} from '../actions/IngresoActions';
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions"

function ingresosById(state = {
    isFetching: false,
    didInvalidate: true,
    ingresos: [],
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
        default:
            return state
    }
}

function ingresosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_INGRESOS:
            return action.ingresos.result ? action.ingresos.result : [];
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

const ingresos = combineReducers({
    allIds: ingresosAllIds,
    byId:   ingresosById,
    create: create
});

export default ingresos;