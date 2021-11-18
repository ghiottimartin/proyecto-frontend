import {combineReducers} from 'redux'
import merge from "lodash/merge"

//Actions
import { ERROR_UPDATE_TURNO, RECEIVE_UPDATE_TURNO, REQUEST_UPDATE_TURNO, RESET_UPDATE_TURNO, UPDATE_TURNO } from '../actions/TurnoActions'

const defecto = {
    mozo: '',
    ordenes: [],
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
        default:
            return state
    }
}

const turnos = combineReducers({
    update: update,
})

export default turnos