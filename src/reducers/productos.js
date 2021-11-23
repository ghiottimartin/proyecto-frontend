import { combineReducers } from 'redux';
import merge from "lodash/merge";

//Actions
import {
    CREATE_PRODUCTO,
    RESET_CREATE_PRODUCTO,
    REQUEST_CREATE_PRODUCTO,
    RECEIVE_CREATE_PRODUCTO,
    ERROR_CREATE_PRODUCTO,
    UPDATE_PRODUCTO,
    RESET_UPDATE_PRODUCTO,
    REQUEST_UPDATE_PRODUCTO,
    RECEIVE_UPDATE_PRODUCTO,
    ERROR_UPDATE_PRODUCTO,
    INVALIDATE_PRODUCTOS,
    REQUEST_PRODUCTOS,
    ERROR_PRODUCTOS,
    RECEIVE_PRODUCTOS,
    RESET_PRODUCTOS,
    INVALIDATE_PRODUCTO_ID,
    REQUEST_PRODUCTO_ID,
    RECEIVE_PRODUCTO_ID,
    ERROR_PRODUCTO_ID,
    RESET_PRODUCTO_ID, RESET_DELETE_PRODUCTO, REQUEST_DELETE_PRODUCTO, RECEIVE_DELETE_PRODUCTO, ERROR_DELETE_PRODUCTO, UPDATE_FILTROS, RESET_FILTROS

} from '../actions/ProductoActions';
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions";
import pickBy from "lodash/pickBy";

const filtrosIniciales = {
    tipo: "",
    nombre: "",
    categoria: "",
    alerta_stock: "",
    paginaActual: 1,
    registrosPorPagina: 10,
    orden: 'nombre',
    direccion: 'ASC',
}

function productosById(state = {
    isFetching: false,
    isFetchingProducto: false,
    didInvalidate: true,
    didInvalidateProducto: true,
    filtros: filtrosIniciales,
    productos: [],
    producto: {},
    error: null,
    success: "",
    total: 0,
    registros: 0
}, action) {
    switch (action.type) {
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                productos: [],
            });
        //PRODUCTOS
        case INVALIDATE_PRODUCTOS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_PRODUCTOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_PRODUCTOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                productos: action.productos.entities.productos,
                total: action.total,
                registros: action.registros,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_PRODUCTOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_PRODUCTOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                productos: [],
            });
        //PRODUCTO
        case INVALIDATE_PRODUCTO_ID:
            return Object.assign({}, state, {
                didInvalidateProducto: true
            });
        case REQUEST_PRODUCTO_ID:
            return Object.assign({}, state, {
                isFetchingProducto: true,
                didInvalidateProducto: false
            });
        case RECEIVE_PRODUCTO_ID:
            return Object.assign({}, state, {
                isFetchingProducto: false,
                didInvalidateProducto: false,
                producto: action.producto.entities.producto,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_PRODUCTO_ID:
            return Object.assign({}, state, {
                isFetchingProducto: false,
                didInvalidateProducto: true,
                error: action.error
            });
        case RESET_PRODUCTO_ID:
            return Object.assign({}, state, {
                isFetchingProducto: false,
                didInvalidateProducto: true,
                error: null,
                lastUpdated: null,
                productos: [],
            });
        case RECEIVE_DELETE_PRODUCTO:
            return Object.assign({}, state, {
                productos: pickBy(state.productos, function (value, key) {
                    return parseInt(key) !== parseInt(action.idProducto);
                })
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


function create(state = {
    isCreating: false,
    nuevo: {
        nombre: '',
        imagen: '',
        descripcion: '',
        imagen_nombre: '',
        costo_vigente: '',
        precio_vigente: '',
        compra_directa: false,
        venta_directa: true,
        stock: 0,
        stock_seguridad: 20,
        habilitado: 1
    },
    success: "",
    error: null,
    errores: [],
    ruta: '',
}, action) {
    switch (action.type) {
        //REGISTRO
        case CREATE_PRODUCTO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.producto),
                error: null,
            });
        case RESET_CREATE_PRODUCTO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo: {
                    nombre: '',
                    imagen: '',
                    descripcion: '',
                    imagen_nombre: '',
                    costo_vigente: '',
                    precio_vigente: '',
                    compra_directa: false,
                    venta_directa: true,
                    stock: 0,
                    stock_seguridad: 20,
                    habilitado: 1
                },
            });
        case REQUEST_CREATE_PRODUCTO:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CREATE_PRODUCTO:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.message,
                error: null,
                ruta: action.ruta,
            });
        case ERROR_CREATE_PRODUCTO:
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
    activo: {
        nombre: '',
        imagen: '',
        descripcion: '',
        imagen_nombre: '',
        costo_vigente: '',
        precio_vigente: '',
        compra_directa: false,
        venta_directa: true,
        stock: 0,
        stock_seguridad: 20,
        habilitado: 1
    },
    success: "",
    error: null
}, action) {
    switch (action.type) {
        //UPDATE PRODUCTO
        case UPDATE_PRODUCTO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.producto),
                success: "",
                error: null,
            });
        case RESET_UPDATE_PRODUCTO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: {
                    nombre: '',
                    imagen: '',
                    descripcion: '',
                    imagen_nombre: '',
                    costo_vigente: '',
                    precio_vigente: '',
                    compra_directa: false,
                    venta_directa: true,
                    stock: 0,
                    stock_seguridad: 20,
                    habilitado: 1
                },
                success: "",
                error: null,
            });
        case REQUEST_UPDATE_PRODUCTO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case RECEIVE_UPDATE_PRODUCTO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case ERROR_UPDATE_PRODUCTO:
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
        case RESET_DELETE_PRODUCTO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: "",
                error: null,
            });
        case REQUEST_DELETE_PRODUCTO:
            return Object.assign({}, state, {
                isDeleting: true,
                success: "",
                error: null,
            });
        case RECEIVE_DELETE_PRODUCTO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: action.success,
                error: null,
            });
        case ERROR_DELETE_PRODUCTO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: "",
                error: action.error
            });
        default:
            return state
    }
}

function productosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_PRODUCTOS:
            return action.productos.result ? action.productos.result : [];
        case RECEIVE_DELETE_PRODUCTO:
            return state.filter(id => id != action.idProducto);
        case RESET_PRODUCTOS:
            return [];
        default:
            return state
    }
}


const productos = combineReducers({
    allIds: productosAllIds,
    byId: productosById,
    create: create,
    update: update,
    delete: borrar
});

export default productos;