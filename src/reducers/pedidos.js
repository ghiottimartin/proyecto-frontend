import { combineReducers } from 'redux';
import merge from "lodash/merge";
import moment from 'moment';

//Actions
import {
    CREATE_PEDIDO,
    RESET_CREATE_PEDIDO,
    REQUEST_CREATE_PEDIDO,
    RECEIVE_CREATE_PEDIDO,
    ERROR_CREATE_PEDIDO,
    RESET_CERRAR_PEDIDO,
    REQUEST_CERRAR_PEDIDO,
    RECEIVE_CERRAR_PEDIDO,
    ERROR_CERRAR_PEDIDO,
    INVALIDATE_PEDIDOS,
    REQUEST_PEDIDOS,
    ERROR_PEDIDOS,
    RECEIVE_PEDIDOS,
    RESET_PEDIDOS,
    INVALIDATE_PEDIDO_ID,
    REQUEST_PEDIDO_ID,
    RECEIVE_PEDIDO_ID,
    ERROR_PEDIDO_ID,
    RESET_PEDIDO_ID,
    RESET_DELETE_PEDIDO,
    REQUEST_DELETE_PEDIDO,
    RECEIVE_DELETE_PEDIDO,
    ERROR_DELETE_PEDIDO,
    INVALIDATE_PEDIDO_ABIERTO,
    REQUEST_PEDIDO_ABIERTO,
    RECEIVE_PEDIDO_ABIERTO,
    ERROR_PEDIDO_ABIERTO,
    RESET_PEDIDO_ABIERTO,
    UPDATE_PEDIDO,
    RECEIVE_ENTREGAR_PEDIDO,
    REQUEST_ENTREGAR_PEDIDO,
    ERROR_ENTREGAR_PEDIDO,
    RECEIVE_ANULAR_PEDIDO,
    REQUEST_ANULAR_PEDIDO,
    ERROR_ANULAR_PEDIDO,
    INVALIDATE_PEDIDOS_VENDEDOR,
    REQUEST_PEDIDOS_VENDEDOR,
    RECEIVE_PEDIDOS_VENDEDOR,
    ERROR_PEDIDOS_VENDEDOR,
    RESET_PEDIDOS_VENDEDOR,
    UPDATE_FILTROS,
    RESET_FILTROS,
    RECEIVE_PEDIDO_DISPONIBLE,
    REQUEST_PEDIDO_DISPONIBLE,
    ERROR_PEDIDO_DISPONIBLE

} from '../actions/PedidoActions';
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions";
import pickBy from "lodash/pickBy";

let hoy = moment();
let haceUnaSemana = moment().subtract(2, 'weeks');

const filtrosIniciales = {
    numero: "",
    fechaDesde: haceUnaSemana.format("YYYY-MM-DD"),
    fechaHasta: hoy.format("YYYY-MM-DD"),
    paginaActual: 1,
    registrosPorPagina: 10,
    estado: "",
    nombreUsuario: ""
};

function pedidosById(state = {
    isFetching: false,
    isFetchingPedido: false,
    didInvalidate: true,
    didInvalidatePedido: true,
    pedidos: [],
    abierto: {
        id: 0,
        forzar: false,
        lineas: [],
        lineasIds: [],
    },
    filtros: filtrosIniciales,
    error: null,
    success: "",
    isCanceling: false,
    total: 0,
    registros: 0,
}, action) {
    switch (action.type) {
        case RECEIVE_ANULAR_PEDIDO:
            let pedidoAbierto = state.abierto;
            if (action.idAnulado === state.abierto.id) {
                pedidoAbierto = {
                    id: 0,
                    forzar: false,
                    lineas: [],
                    lineasIds: [],
                };
            }
            return Object.assign({}, state, {
                abierto: pedidoAbierto
            });
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
                total: action.total,
                registros: action.registros,
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
        //PEDIDO
        case INVALIDATE_PEDIDO_ABIERTO:
            return Object.assign({}, state, {
                didInvalidatePedido: true
            });
        case REQUEST_PEDIDO_ABIERTO:
            return Object.assign({}, state, {
                isFetchingPedido: true,
                didInvalidatePedido: false
            });
        case RECEIVE_PEDIDO_ABIERTO:
            let abierto = {};
            if (action.pedido && action.pedido.entities && action.pedido.entities.pedido) {
                abierto = Object.values(action.pedido.entities.pedido)[0];
            }
            if (action.en_curso) {
                abierto.en_curso = true;
            }
            if (action.disponible) {
                abierto.disponible = true;
            }
            if (action.pedido && action.pedido.entities && action.pedido.entities.lineas) {
                abierto.lineas = Object.values(action.pedido.entities.lineas);
            } else {
                abierto.lineas = [];
            }
            var ids = [];
            abierto.lineas.map(linea => ids.push(linea.id));
            abierto.lineasIds = ids;
            return Object.assign({}, state, {
                isFetchingPedido: false,
                didInvalidatePedido: false,
                abierto: merge(state.abierto, abierto),
                lastUpdated: action.receivedAt,
                error: null
            });
        case RESET_CREATE_PEDIDO:
            return Object.assign({}, state, {
                abierto: {
                    id: 0,
                    forzar: false,
                    lineas: [],
                    lineasIds: [],
                },
                error: null
            });
        case ERROR_PEDIDO_ABIERTO:
            return Object.assign({}, state, {
                isFetchingPedido: false,
                didInvalidatePedido: true,
                error: action.error
            });
        case RESET_PEDIDO_ABIERTO:
            return Object.assign({}, state, {
                isFetchingPedido: false,
                didInvalidatePedido: true,
                error: null,
                lastUpdated: null,
                abierto: {
                    id: 0,
                    forzar: false,
                    lineas: [],
                    lineasIds: [],
                },
            });
        case RECEIVE_DELETE_PEDIDO:
            return Object.assign({}, state, {
                pedidos: pickBy(state.pedidos, function (value, key) {
                    return parseInt(key) !== parseInt(action.idPedido);
                })
            });
        
            // ANULAR PEDIDO
        case RECEIVE_ANULAR_PEDIDO:
            return Object.assign({}, state, {
                isCanceling: false,
                success: action.message,
                error: null,
            });
        case REQUEST_ANULAR_PEDIDO:
            return Object.assign({}, state, {
                isCanceling: true,
                success: "",
                error: null,
            });
        case ERROR_ANULAR_PEDIDO:
            return Object.assign({}, state, {
                isCanceling: false,
                success: "",
                error: action.error
            });
        //PEDIDOS
        case INVALIDATE_PEDIDOS_VENDEDOR:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_PEDIDOS_VENDEDOR:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_PEDIDOS_VENDEDOR:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                pedidos: action.pedidos.entities.pedidos,
                total: action.total,
                registros: action.registros,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_PEDIDOS_VENDEDOR:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_PEDIDOS_VENDEDOR:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                pedidos: [],
            });
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


function create(state = {
    isCreating: false,
    nuevo: {},
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
                nuevo: {},
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

function update(state = {
    isUpdating: false,
    cerrando: false,
    activo: {},
    success: "",
    error: null
}, action) {
    switch (action.type) {
        case RESET_CERRAR_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: null,
            });
        case REQUEST_CERRAR_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CERRAR_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.message,
                error: null,
            });
        case ERROR_CERRAR_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        case UPDATE_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.pedido),
                success: "",
                error: null,
            });
        case RECEIVE_ENTREGAR_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.message,
                error: null,
            });
        case REQUEST_ENTREGAR_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case ERROR_ENTREGAR_PEDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
         // PEDIDO DISPONIBLE
         case RECEIVE_PEDIDO_DISPONIBLE:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case REQUEST_PEDIDO_DISPONIBLE:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case ERROR_PEDIDO_DISPONIBLE:
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
        case RECEIVE_PEDIDOS_VENDEDOR:
            return action.pedidos.result ? action.pedidos.result : [];
        case RECEIVE_DELETE_PEDIDO:
            return state.filter(id => id != action.idPedido);
        case RESET_PEDIDOS:
            return [];
        case RESET_PEDIDOS_VENDEDOR:
            return [];
        default:
            return state
    }
}


const pedidos = combineReducers({
    allIds: pedidosAllIds,
    byId: pedidosById,
    create: create,
    update: update,
    delete: borrar
});

export default pedidos;