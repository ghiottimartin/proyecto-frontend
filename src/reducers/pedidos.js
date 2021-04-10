import {combineReducers} from 'redux';
import merge from "lodash/merge";

//Actions
import {
    CREATE_PEDIDO,
    RESET_CREATE_PEDIDO,
    REQUEST_CREATE_PEDIDO,
    RECEIVE_CREATE_PEDIDO,
    ERROR_CREATE_PEDIDO,
    UPDATE_PEDIDO,
    RESET_UPDATE_PEDIDO,
    REQUEST_UPDATE_PEDIDO,
    RECEIVE_UPDATE_PEDIDO,
    ERROR_UPDATE_PEDIDO,
    INVALIDATE_PEDIDOS,
    REQUEST_PEDIDOS,
    ERROR_PEDIDOS,
    RECEIVE_PEDIDOS,
    RESET_PEDIDOS,
    INVALIDATE_PEDIDO_ID,
    REQUEST_PEDIDO_ID,
    RECEIVE_PEDIDO_ID,
    ERROR_PEDIDO_ID,
    RESET_PEDIDO_ID, RESET_DELETE_PEDIDO, REQUEST_DELETE_PEDIDO, RECEIVE_DELETE_PEDIDO, ERROR_DELETE_PEDIDO

} from '../actions/PedidoActions';
import {LOGOUT_SUCCESS} from "../actions/AuthenticationActions";
import pickBy from "lodash/pickBy";

function pedidosById(state = {
    isFetching: false,
    isFetchingPedido: false,
    didInvalidate: true,
    didInvalidatePedido: true,
    pedidos: [],
    pedido: {},
    error: null,
    success: "",
}, action) {
    switch (action.type) {
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                pedidos: [],
            });
        //PEDIDOS
        case INVALIDATE_PEDIDOS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_PEDIDOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_PEDIDOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                pedidos: action.pedidos.entities.pedidos,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_PEDIDOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_PEDIDOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                pedidos: [],
            });
        //PEDIDO
        case INVALIDATE_PEDIDO_ID:
            return Object.assign({}, state, {
                didInvalidatePedido: true
            });
        case REQUEST_PEDIDO_ID:
            return Object.assign({}, state, {
                isFetchingPedido: true,
                didInvalidatePedido: false
            });
        case RECEIVE_PEDIDO_ID:
            return Object.assign({}, state, {
                isFetchingPedido: false,
                didInvalidatePedido: false,
                pedido: action.pedido.entities.pedido,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_PEDIDO_ID:
            return Object.assign({}, state, {
                isFetchingPedido: false,
                didInvalidatePedido: true,
                error: action.error
            });
        case RESET_PEDIDO_ID:
            return Object.assign({}, state, {
                isFetchingPedido: false,
                didInvalidatePedido: true,
                error: null,
                lastUpdated: null,
                pedidos: [],
            });
        case RECEIVE_DELETE_PEDIDO:
            return Object.assign({}, state, {
                pedidos: pickBy(state.pedidos, function (value, key) {
                    return parseInt(key) !== parseInt(action.idPedido);
                })
            });
        default:
            return state
    }
}


function create(state = {
    isCreating: false,
    nuevo: {
        tipo: "",
        menus: [],
        productos: [],
    },
    success: "",
    error: null,
    errores: [],
    ruta: '',
}, action) {
    switch (action.type) {
        //REGISTRO
        case CREATE_PEDIDO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.pedido),
                error: null,
            });
        case RESET_CREATE_PEDIDO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo:{},
            });
        case REQUEST_CREATE_PEDIDO:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CREATE_PEDIDO:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.message,
                error: null,
                ruta: action.ruta,
            });
        case ERROR_CREATE_PEDIDO:
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

let activoDefecto = {
    nombre: '',
    codigo: '',
    imagen: '',
    fileName: '',
    descripcion: '',
    categoria_id: '',
    precioVigente: ''
};

function update(state = {
    isUpdating: false,
    activo: activoDefecto,
    success: "",
    error: null
}, action) {
    switch (action.type) {
        //UPDATE PEDIDO
        case UPDATE_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.pedido),
                success: "",
                error: null,
            });
        case RESET_UPDATE_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: activoDefecto,
                success: "",
                error: null,
            });
        case REQUEST_UPDATE_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case RECEIVE_UPDATE_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case ERROR_UPDATE_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        default:
            return state
    }
}

function borrar(state = {
    isDeleting: false,
    success: "",
    error: null
}, action) {
    switch (action.type) {
        //DELETE
        case RESET_DELETE_PEDIDO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: "",
                error: null,
            });
        case REQUEST_DELETE_PEDIDO:
            return Object.assign({}, state, {
                isDeleting: true,
                success: "",
                error: null,
            });
        case RECEIVE_DELETE_PEDIDO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: action.success,
                error: null,
            });
        case ERROR_DELETE_PEDIDO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: "",
                error: action.error
            });
        default:
            return state
    }
}

function pedidosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_PEDIDOS:
            return action.pedidos.result ? action.pedidos.result : [];
        case RECEIVE_DELETE_PEDIDO:
            return state.filter(id => id != action.idPedido);
        case RESET_PEDIDOS:
             return [];
        default:
            return state
    }
}


const pedidos = combineReducers({
    allIds: pedidosAllIds,
    byId:   pedidosById,
    create: create,
    update: update,
    delete: borrar
});

export default pedidos;