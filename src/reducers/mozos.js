import { combineReducers } from 'redux'

import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions"
import { ERROR_MOZOS, INVALIDATE_MOZOS, RECEIVE_MOZOS, REQUEST_MOZOS, RESET_MOZOS } from "../actions/UsuarioActions"

function mozosById(state = {
    isFetching: false,
    isFetchingMozo: false,
    didInvalidate: true,
    didInvalidateMozo: true,
    mozos: [],
    mozo: {},
    error: null,
    success: "",
}, action) {
    switch (action.type) {
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                mozos: [],
            });
        //MOZOS
        case INVALIDATE_MOZOS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_MOZOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_MOZOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                mozos: action.mozos.entities.usuarios,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_MOZOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_MOZOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                mozos: [],
            });
        default:
            return state
    }
}

function mozosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_MOZOS:
            return action.mozos.result ? action.mozos.result : [];
        
        case RESET_MOZOS:
            return [];
        default:
            return state
    }
}


const mozos = combineReducers({
    allIds: mozosAllIds,
    byId: mozosById
});

export default mozos;