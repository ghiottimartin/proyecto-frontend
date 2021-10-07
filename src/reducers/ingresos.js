import { combineReducers } from 'redux';
import merge from "lodash/merge";

//Actions
import {
    CREATE_INGRESO,
    RESET_CREATE_INGRESO,
    REQUEST_CREATE_INGRESO,
    RECEIVE_CREATE_INGRESO,
    ERROR_CREATE_INGRESO

} from '../actions/IngresoActions';
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions";

const nuevo = {
    lineas: [],
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
    create: create
});

export default ingresos;