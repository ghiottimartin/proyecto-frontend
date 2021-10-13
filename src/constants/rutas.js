//Login routes
export const LOGIN          = '/login';
export const LOGOUT         = '/logout';
export const INICIO         = '/';
export const VALIDAR_EMAIL  = '/validar-email/:token';
export const RESET_PASSWORD = '/reset-password/:token';

//Registro
export const MENU            = '/menu';
export const ALMACEN         = '/almacen';
export const GESTION         = '/gestion';

export const ACCION_ALTA   = 'alta';
export const ACCION_LISTAR = 'listar';
export const ACCION_EDITAR = 'editar';

export const TIPO_COMUN = 'comun';
export const TIPO_ADMIN = 'admin';

//Gestión de usuarios
export const USUARIOS              = '/usuarios';
export const USUARIOS_ALTA         = '/usuarios/alta/:tipo';
export const USUARIOS_ALTA_ADMIN   = '/usuarios/alta/admin';
export const USUARIOS_ALTA_COMUN   = '/usuarios/alta/comun';
export const USUARIOS_LISTAR       = '/usuarios/listar';
export const USUARIOS_EDITAR       = '/usuarios/editar/:tipo?/:id?';
export const USUARIOS_EDITAR_ADMIN = '/usuarios/editar/admin';
export const USUARIOS_EDITAR_COMUN = '/usuarios/editar/comun';

//Gestión de productos
export const PRODUCTOS              = '/productos';
export const PRODUCTOS_ACCIONES     = '/productos/:accion/:tipo?/:id?';
export const PRODUCTO_ALTA          = '/productos/alta';
export const PRODUCTOS_LISTAR       = '/productos/listar';
export const PRODUCTOS_LISTAR_ADMIN = '/productos/listar/admin';
export const PRODUCTOS_EDITAR_ADMIN = '/productos/editar/admin/:id';

//Gestión de categorias
export const CATEGORIAS              = '/categorias';
export const CATEGORIAS_ACCIONES     = '/categorias/:accion/:id?';
export const CATEGORIA_ALTA          = '/categorias/alta';
export const CATEGORIAS_LISTAR       = '/categorias/listar';
export const CATEGORIAS_LISTAR_ADMIN = '/categorias/listar/admin';
export const CATEGORIAS_EDITAR_ADMIN = '/categorias/editar/admin/:id';

//Gestión de pedidos
export const PEDIDOS = '/pedidos/:rol';
export const PEDIDOS_COMENSAL = '/pedidos/comensal';
export const PEDIDOS_VENDEDOR = '/pedidos/vendedor';
export const PEDIDO_VISUALIZAR = '/pedidos/visualizar/:rol/:id';
export const PEDIDO_VISUALIZAR_COMENSAL = '/pedidos/visualizar/comensal/';
export const PEDIDO_VISUALIZAR_VENDEDOR = '/pedidos/visualizar/vendedor/';

//Ingreso de mercadería
export const INGRESO_MERCADERIA               = '/ingreso-mercaderia/';
export const INGRESO_MERCADERIA_ALTA          = '/ingreso-mercaderia/alta';
export const INGRESO_MERCADERIA_VISUALIZAR    = '/ingreso-mercaderia/visualizar/';
export const INGRESO_MERCADERIA_VISUALIZAR_ID = '/ingreso-mercaderia/visualizar/:id';

/**
 * Devuelve la url de usuarios
 *
 * @param tipoObjeto
 * @param id
 * @param accion ver constantes ACCION_*
 * @param tipo ver constantes TIPO_*
 * @param volverA query para volver a la ruta anterior
 * @returns {string}
 */
export function getUrl(tipoObjeto, id, accion, tipo, volverA) {
    let ruta = '';
    if(tipo !== ''){    
        ruta = `${tipoObjeto}/${accion}/${tipo}/${id}`;
    }else{
        ruta = `${tipoObjeto}/${accion}/${id}`;
    }

    if (volverA) {
        ruta += `?volverA=${volverA}`
    }
    return ruta;
}

/**
 * Permite obtener la query de la url
 *
 * @param query
 * @returns {string}
 */
export function getQuery(query) {
    const search = new URLSearchParams(window.location.search);
    return search.get(query);
}

const RUTAS = [
    LOGIN,
    LOGOUT,
    VALIDAR_EMAIL,
    RESET_PASSWORD,
    MENU,
    ALMACEN,
    GESTION,
    INGRESO_MERCADERIA,
    INGRESO_MERCADERIA_ALTA,
    USUARIOS_LISTAR,
    USUARIOS_ALTA_ADMIN,
    USUARIOS_ALTA_COMUN,
    PRODUCTOS_LISTAR,
    PRODUCTOS_LISTAR_ADMIN,
    PRODUCTO_ALTA,
    PEDIDOS_COMENSAL,
    PEDIDOS_VENDEDOR,
    CATEGORIAS_LISTAR,
    CATEGORIAS_LISTAR_ADMIN
];

/**
 * Valida que la ruta exista
 *
 * @param ruta
 * @returns {boolean}
 */
export function validarRuta(ruta) {
    return RUTAS.includes(ruta);
}