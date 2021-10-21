import { combineReducers } from 'redux'
import merge from "lodash/merge"
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions"
import { CREATE_REEMPLAZO, ERROR_CREATE_REEMPLAZO, RECEIVE_CREATE_REEMPLAZO, REQUEST_CREATE_REEMPLAZO, RESET_CREATE_REEMPLAZO } from '../actions/ReemplazoMercaderiaActions'

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
                nuevo:  {
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

const reemplazos = combineReducers({
    create: create
});

export default reemplazos;