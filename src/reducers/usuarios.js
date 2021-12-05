import { combineReducers } from 'redux';
import merge from "lodash/merge";
import pickBy from "lodash/pickBy";

//Actions
import {
    CREATE_USUARIO,
    RESET_CREATE_USUARIO,
    REQUEST_CREATE_USUARIO,
    RECEIVE_CREATE_USUARIO,
    ERROR_CREATE_USUARIO,
    UPDATE_USUARIO,
    RESET_UPDATE_USUARIO,
    REQUEST_UPDATE_USUARIO,
    RECEIVE_UPDATE_USUARIO,
    ERROR_UPDATE_USUARIO,
    INVALIDATE_USUARIO_LOGUEADO,
    REQUEST_USUARIO_LOGUEADO,
    ERROR_USUARIO_LOGUEADO,
    RECEIVE_USUARIO_LOGUEADO,
    RESET_USUARIO_LOGUEADO,
    INVALIDATE_USUARIOS,
    REQUEST_USUARIOS,
    ERROR_USUARIOS,
    RECEIVE_USUARIOS,
    RESET_USUARIOS,
    INVALIDATE_USUARIO_ID,
    REQUEST_USUARIO_ID,
    RECEIVE_USUARIO_ID,
    ERROR_USUARIO_ID,
    RESET_USUARIO_ID,
    RESET_DELETE_USUARIO,
    REQUEST_DELETE_USUARIO,
    RECEIVE_DELETE_USUARIO,
    ERROR_DELETE_USUARIO,
    RECEIVE_INHABILITAR_USUARIO,
    UPDATE_FILTROS,
    RESET_FILTROS,
    ERROR_MANUAL_PDF,
    RECEIVE_MANUAL_PDF,
    REQUEST_MANUAL_PDF

} from '../actions/UsuarioActions';
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions";

const filtrosIniciales = {
    estado: "",
    nombre: "",
    rol: "",
    dni: "",
    paginaActual: 1,
    registrosPorPagina: 10,
}


function usuariosById(state = {
    isFetching: false,
    isFetchingUsuario: false,
    didInvalidate: true,
    didInvalidateUsuario: true,
    filtros: filtrosIniciales,
    resetFiltros: false,
    total: 0,
    registros: 0,
    usuarios: [],
    usuario: {},
    error: null,
    success: "",
}, action) {
    switch (action.type) {
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                usuarios: [],
            });
        //USUARIOS
        case INVALIDATE_USUARIOS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_USUARIOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_USUARIOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                usuarios: action.usuarios.entities.usuarios,
                total: action.total,
                registros: action.registros,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_USUARIOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_USUARIOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                usuarios: [],
            });
        //USUARIO
        case INVALIDATE_USUARIO_ID:
            return Object.assign({}, state, {
                didInvalidateUsuario: true
            });
        case REQUEST_USUARIO_ID:
            return Object.assign({}, state, {
                isFetchingUsuario: true,
                didInvalidateUsuario: false
            });
        case RECEIVE_USUARIO_ID:
            return Object.assign({}, state, {
                isFetchingUsuario: false,
                didInvalidateUsuario: false,
                usuario: action.usuario.entities.usuario,
                lastUpdated: action.receivedAt,
                error: null
            });
        case ERROR_USUARIO_ID:
            return Object.assign({}, state, {
                isFetchingUsuario: false,
                didInvalidateUsuario: true,
                error: action.error
            });
        case RESET_USUARIO_ID:
            return Object.assign({}, state, {
                isFetchingUsuario: false,
                didInvalidateUsuario: true,
                error: null,
                lastUpdated: null,
                usuarios: [],
            });
        case RECEIVE_DELETE_USUARIO:
            return Object.assign({}, state, {
                usuarios: pickBy(state.usuarios, function (value, key) {
                    return parseInt(key) !== parseInt(action.idUsuario);
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
    nuevo: {},
    success: "",
    error: null,
    ruta: '',
}, action) {
    switch (action.type) {
        //REGISTRO
        case CREATE_USUARIO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.usuario),
                error: null,
            });
        case RESET_CREATE_USUARIO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo: {},
            });
        case REQUEST_CREATE_USUARIO:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CREATE_USUARIO:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.message,
                error: null,
                ruta: action.ruta,
            });
        case ERROR_CREATE_USUARIO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: action.error
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
    email: '',
    password: '',
    confirmaPass: '',
    dni: ''
};

function update(state = {
    isFetchingUsuarioLogueado: false,
    isUpdating: false,
    activo: activoDefecto,
    logueado: {},
    success: "",
    error: null
}, action) {
    switch (action.type) {
        //UPDATE USUARIO
        case UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.usuario),
                success: "",
                error: null,
            });
        case RESET_UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: activoDefecto,
                success: "",
                error: null,
            });
        case REQUEST_UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case RECEIVE_UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case ERROR_UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        //USUARIO LOGUEADO
        case INVALIDATE_USUARIO_LOGUEADO:
            return Object.assign({}, state, {
                error: null,
                success: "",
            });
        case REQUEST_USUARIO_LOGUEADO:
            return Object.assign({}, state, {
                isFetchingUsuarioLogueado: true,
                success: "",
                error: null,
            });
        case ERROR_USUARIO_LOGUEADO:
            return Object.assign({}, state, {
                isFetchingUsuarioLogueado: false,
                success: "",
                error: action.error,
            });
        case RECEIVE_USUARIO_LOGUEADO:
            let usuario = action.usuario ? action.usuario.entities.usuario[action.usuario.result] : {};
            let roles = usuario.roles;
            if (!Array.isArray(roles)) {
                roles = [];
            }
            let arrayRoles = [];
            roles.forEach(rol => {
                arrayRoles.push(rol.nombre);
            })
            usuario.rolesArray = arrayRoles;
            return Object.assign({}, state, {
                isFetchingUsuarioLogueado: false,
                logueado: merge({}, state.logueado, usuario),
                lastUpdated: action.receivedAt,
                success: action.message,
                error: null
            });
        case RESET_USUARIO_LOGUEADO:
            return Object.assign({}, state, {
                isFetchingUsuarioLogueado: false,
                didInvalidate: true,
                logueado: {}
            });
        case REQUEST_MANUAL_PDF:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case RECEIVE_MANUAL_PDF:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: null,
            });
        case ERROR_MANUAL_PDF:
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
        case RESET_DELETE_USUARIO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: "",
                error: null,
            });
        case REQUEST_DELETE_USUARIO:
            return Object.assign({}, state, {
                isDeleting: true,
                success: "",
                error: null,
            });
        case RECEIVE_DELETE_USUARIO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: action.success,
                error: null,
            });
        case ERROR_DELETE_USUARIO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: "",
                error: action.error
            });
        case RECEIVE_INHABILITAR_USUARIO:
            return Object.assign({}, state, {
                isDeleting: false,
                success: action.success,
                error: null,
            });
        default:
            return state
    }
}

function usuariosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_USUARIOS:
            return action.usuarios.result ? action.usuarios.result : [];
        case RECEIVE_DELETE_USUARIO:
            return state.filter(id => id != action.idUsuario)
        case RESET_USUARIOS:
            return [];
        default:
            return state
    }
}


const usuarios = combineReducers({
    allIds: usuariosAllIds,
    byId: usuariosById,
    create: create,
    update: update,
    delete: borrar,
});

export default usuarios;