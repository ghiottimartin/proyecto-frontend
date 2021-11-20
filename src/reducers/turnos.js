import {combineReducers} from 'redux'
import merge from "lodash/merge"

//Actions
import { CREATE_TURNO, ERROR_CANCELAR_TURNO, ERROR_CERRAR_TURNO, ERROR_CREATE_TURNO, ERROR_UPDATE_TURNO, RECEIVE_CANCELAR_TURNO, RECEIVE_CERRAR_TURNO, RECEIVE_CREATE_TURNO, RECEIVE_UPDATE_TURNO, REQUEST_CANCELAR_TURNO, REQUEST_CERRAR_TURNO, REQUEST_CREATE_TURNO, REQUEST_UPDATE_TURNO, RESET_CREATE_TURNO, RESET_UPDATE_TURNO, UPDATE_TURNO } from '../actions/TurnoActions'

const defecto = {
    mozo: '',
    ordenes: [],
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
                nuevo:  {},
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
    activo: defecto,
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
                activo: defecto,
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
        // CANCELAR TURNO
        case RECEIVE_CANCELAR_TURNO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case REQUEST_CANCELAR_TURNO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case ERROR_CANCELAR_TURNO:
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
        default:
            return state
    }
}

const turnos = combineReducers({
    update: update,
    create: create,
})

export default turnos