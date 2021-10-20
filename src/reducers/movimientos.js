import { combineReducers } from 'redux'
import merge from "lodash/merge"
import moment from 'moment'

//Actions
import {
    INVALIDATE_MOVIMIENTOS,
    REQUEST_MOVIMIENTOS,
    RECEIVE_MOVIMIENTOS,
    ERROR_MOVIMIENTOS,
    RESET_MOVIMIENTOS,
    UPDATE_FILTROS,
    RESET_FILTROS

} from '../actions/MovimientosStockActions';
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions"


let hoy = moment()
let haceUnaSemana = moment().subtract(2, 'weeks')

const filtrosIniciales = {
    fechaDesde: haceUnaSemana.format("YYYY-MM-DD"),
    fechaHasta: hoy.format("YYYY-MM-DD"),
    paginaActual: 1,
    registrosPorPagina: 10
}

function movimientosById(state = {
    isFetching: false,
    isCanceling: false,
    didInvalidate: true,
    movimientos: [],
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
                movimientos: [],
            });
        //MOVIMIENTOS
        case INVALIDATE_MOVIMIENTOS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_MOVIMIENTOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_MOVIMIENTOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                movimientos: action.movimientos.entities.movimientos,
                total: action.total,
                registros: action.registros,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_MOVIMIENTOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_MOVIMIENTOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                movimientos: [],
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

function movimientosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_MOVIMIENTOS:
            return action.movimientos.result ? action.movimientos.result : [];
        case RESET_MOVIMIENTOS:
             return [];
        default:
            return state
    }
}

const movimientos = combineReducers({
    allIds: movimientosAllIds,
    byId:   movimientosById
});

export default movimientos;