import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Actions
import { resetProductos, fetchProductos, saveDeleteProducto, updateProducto, updateFiltros } from "../../../../actions/ProductoActions";

//CSS
import "../../../../assets/css/Productos/Listado.css";
import "../../../../assets/css/Listado.css";

//Constants
import c from "../../../../constants/constants";
import * as rutas from "../../../../constants/rutas";

//Componentes
import AddBoxIcon from "@material-ui/icons/AddBox";
import Loader from "../../../elementos/Loader";
import Titulo from "../../../elementos/Titulo";
import Filtros from "./Filtros";
import Paginacion from "../../../elementos/Paginacion";
import Ordenador from "../../../elementos/Tabla/Ordenador";

//Images
import productoVacio from "../../../../assets/img/emptyImg.jpg";
import tacho from "../../../../assets/icon/delete.png";
import lapiz from "../../../../assets/icon/pencil.png";
import check from "../../../../assets/icon/checked.png";
import cruz from "../../../../assets/icon/close.png";
import movimiento from "../../../../assets/icon/movimiento.png";
import alerta from "../../../../assets/icon/alert.png";

//Librerias
import Swal from "sweetalert2";
import history from "../../../../history";

class Listado extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buscando: true,
            paginaUno: true,
            noHayProductos: false
        }
    }

    componentDidMount() {
        this.buscarProductos();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let allIds = this.props.productos.allIds;
        let borrados = this.props.productos.delete;
        let productos = this.props.productos.byId;
        let preProductos = prevProps.productos.byId;
        let sinIds = allIds.length === 0;
        if (sinIds && ((preProductos.isFetching && !productos.isFetching) || (!borrados.isDeleting && prevProps.productos.delete.isDeleting))) {
            this.setState({
                noHayProductos: true,
            })
        }
        if (preProductos.isFetching && !productos.isFetching) {
            this.setState({
                buscando: false,
            })
        }

        const cambioOrden = prevProps.productos.byId.filtros.orden !== this.props.productos.byId.filtros.orden
        const cambioDePagina = prevProps.productos.byId.filtros.paginaActual !== this.props.productos.byId.filtros.paginaActual
        const cambioDireccion = prevProps.productos.byId.filtros.direccion !== this.props.productos.byId.filtros.direccion
        if (cambioOrden || cambioDePagina || cambioDireccion) {
            this.buscarProductos();
        }
    }

    /**
     * Busca los productos de la base de datos.
     */
    buscarProductos() {
        this.props.resetProductos();
        this.props.fetchProductos();
    }

    /**
     * Rediriga a la ruta de edición de producto.
     * 
     * @param {Object} producto 
     */
    clickEditar(producto) {
        let id = producto.id;
        let rutaEditar = rutas.getUrl(rutas.PRODUCTOS, id, rutas.ACCION_EDITAR, rutas.TIPO_ADMIN, rutas.PRODUCTOS_LISTAR_ADMIN);
        this.props.updateProducto(producto);
        history.push(rutaEditar);
    }

    /**
     * Rediriga a la ruta de movimientos de stock.
     * 
     * @param {Object} producto 
     */
    redirigirMovimientos(producto) {
        let ruta = rutas.MOVIMIENTOS_STOCK
        ruta += producto.id
        history.push(ruta)
    }

    /**
     * Devuelve las posibles operaciones del producto.
     * 
     * @param {Object} producto 
     * @returns 
     */
    getOperacionesProducto(producto) {
        return (
            <div>
                <p onClick={() => this.redirigirMovimientos(producto)} title="Movimientos producto"
                    className="operacion" style={{ display: producto.tiene_movimientos ? "inline" : "none" }}>
                    <img src={movimiento} className="icono-operacion" alt="Movimientos producto" />
                    Movimientos
                </p>
                <p onClick={() => this.clickEditar(producto)} title="Editar "
                    className="operacion">
                    <img src={lapiz} className="icono-operacion" alt="Editar producto" />
                    Editar
                </p>
                <p onClick={() => this.modalBorrar(producto)} title="Borrar" style={{ display: producto.puede_borrarse ? "inline" : "none" }}
                    className="operacion">
                    <img src={tacho} className="icono-operacion" alt="Borrar producto" />
                    Borrar
                </p>
            </div>
        );
    }

    /**
     * Abre el modal para confirmar el borrado del producto.
     * 
     * @param {Object} producto 
     */
    modalBorrar(producto) {
        Swal.fire({
            title: `Está seguro de borrar el producto '${producto.nombre}'`,
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'rgb(88, 219, 131)',
            cancelButtonColor: '#bfbfbf',
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.saveDeleteProducto(producto.id);
            }
        })
    }

    getHtmlListadoResponsive() {
        let Productos = [];
        this.props.productos.allIds.map(idProducto => {
            let producto = this.props.productos.byId.productos[idProducto];
            if (producto && producto.id) {
                let operaciones = this.getOperacionesProducto(producto);
                let path = productoVacio;
                if (producto.imagen) {
                    try {
                        path = c.BASE_PUBLIC + producto.imagen;
                    } catch (e) {
                    }
                }
                Productos.push(
                    <div key={producto.id + "-responsive"} className="productos-responsive-item">
                        <ul>
                            <li className="td-imagen">
                                <img src={path} onError={(e) => e.target.src = productoVacio} alt="Imagen de producto" />
                            </li>
                            <li><b>Nombre:</b> {producto.nombre}</li>
                            <li><b>Categoría:</b>  {producto.categoria_texto}</li>
                            <li><b>Compra directa:</b>  {this.getCompraDirecta(producto)}</li>
                            <li><b>Venta directa:</b>  {this.getVentaDirecta(producto)}</li>
                            <li><b>Stock:</b>  {producto.stock}</li>
                            <li><b>Costo:</b>  {producto.costo_texto}</li>
                            <li><b>Precio:</b>  {producto.precio_texto}</li>
                            <li><b>Margen:</b>  {producto.margen_texto}</li>
                            <li>{operaciones}</li>
                        </ul>
                    </div>
                );
            }
        });
        return Productos;
    }

    /**
     * Devuelve el ícono de compra directa.
     * 
     * @param {Object} producto 
     * @returns 
     */
    getCompraDirecta(producto) {
        const directa = producto.compra_directa;
        return this.getIconoBooleano(directa)
    }

    /**
     * Devuelve el ícono de venta directa.
     * 
     * @param {Object} producto 
     * @returns 
     */
    getVentaDirecta(producto) {
        const directa = producto.venta_directa;
        return this.getIconoBooleano(directa)
    }

    /**
     * Devuelve el ícono booleano para compra directa y venta directa.
     * 
     * @param {Boolean} verdadero 
     * @param {String} title 
     * @returns 
     */
    getIconoBooleano(verdadero, title) {
        if (verdadero) {
            return <img src={check} className="icono-operacion" alt={title} />
        }
        return <img src={cruz} className="icono-operacion" alt={title} />
    }

    /**
     * Filtra los productos.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    filtrarProductos(e) {
        e.preventDefault();
        if (this.state.paginaUno) {
            var cambio = {
                target: {
                    id: 'paginaActual',
                    value: 1
                }
            };
            this.onChangeBusqueda(cambio);
        }
        this.props.fetchProductos();
    }

    /**
    * Cambia los filtros a aplicar, si cambia un filtro que no sea la paginación
    * vuelve a la página inicial.
    * 
    * @param {SyntheticBaseEvent} e 
    */
    onChangeBusqueda(e) {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        if (e.target.id !== "paginaActual") {
            this.setState({ paginaUno: true })
        } else {
            this.setState({ paginaUno: false })
        }
        this.props.updateFiltros(cambio);
    }

    /**
    * Cambia la página del filtro de paginación.
    * 
    * @param {Number} pagina 
    * @returns 
    */
    cambiarDePagina(pagina) {
        if (isNaN(pagina)) {
            return;
        }

        let cambio = {};
        cambio['paginaActual'] = pagina;
        this.props.updateFiltros(cambio);
    }

    /**
     * Cambia el ordenamiento de una columna de la tabla.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    changeDirection(e) {
        const filtros = this.props.productos.byId.filtros
        
        let nuevos = {};
        nuevos.target = {};
        nuevos.target.id = "orden";
        nuevos.target.value = e.target.id;
        this.onChangeBusqueda(nuevos);

        const cambioOrden = filtros.orden !== e.target.id
        const nuevoOrden = cambioOrden ? "ASC" : filtros.direccion === "ASC" ? "DESC" : "ASC";
        if (nuevoOrden) {
            nuevos.target.id = "paginaActual";
            nuevos.target.value = 1;
            this.onChangeBusqueda(nuevos);
        }

        nuevos.target.id = "direccion";
        nuevos.target.value = nuevoOrden;
        this.onChangeBusqueda(nuevos);
    }

    render() {
        const { noHayProductos, buscando } = this.state;
        const productosById = this.props.productos.byId;
        let Productos = [];
        if (noHayProductos) {
            Productos =
                <tr className="text-center">
                    <td colSpan={10}>No hay productos cargados</td>
                </tr>;
        }
        this.props.productos.allIds.map(idProducto => {
            let producto = productosById.productos[idProducto];
            if (producto && producto.id) {
                let operaciones = this.getOperacionesProducto(producto);
                let path = productoVacio;
                if (producto.imagen) {
                    try {
                        path = c.BASE_PUBLIC + producto.imagen;
                    } catch (e) {
                    }
                }
                const alertar = producto.alertar;
                const alertaHTML = <img src={alerta} className="img-alerta-stock" title="El stock actual es menor al stock de alerta" alt="Alerta de stock"/>
                Productos.push(
                    <tr key={producto.id}>
                        <td className="td-imagen">
                            <img src={path} onError={(e) => e.target.src = productoVacio} alt="Imagen de producto" />
                        </td>
                        <td>{producto.nombre}</td>
                        <td>{producto.categoria_texto}</td>
                        <td className="text-center">{this.getCompraDirecta(producto)}</td>
                        <td className="text-center">{this.getVentaDirecta(producto)}</td>
                        <td className="text-right px-5">
                            <div className="d-flex justify-content-center align-items-center">
                                <span>{producto.stock}</span>
                                <span>{alertar ? alertaHTML : ""}</span>
                            </div>
                        </td>
                        <td className="text-right px-5">
                            <div className="d-flex justify-content-center align-items-center">
                                <span>{producto.stock_seguridad}</span>
                                <span>{alertar ? alertaHTML : ""}</span>
                            </div>
                        </td>
                        <td className="font-weight-bold text-right px-5">
                            {producto.costo_texto}
                        </td>
                        <td className="font-weight-bold text-right px-5">
                            {producto.precio_texto}
                        </td>
                        <td className="text-right px-5">
                            {producto.margen_texto}
                        </td>
                        <td>{operaciones}</td>
                    </tr>
                );
            }
        });
        const Cargando =
            <tr>
                <td colSpan={10}><Loader display={true} /></td>
            </tr>;
        let operacion = {
            'ruta': rutas.CATEGORIAS_LISTAR_ADMIN + '?volverA=' + rutas.PRODUCTOS_LISTAR_ADMIN,
            'texto': 'Categorías',
            'clase': 'btn-success',
        };
        const tableResponsive = this.getHtmlListadoResponsive();
        const total = productosById.total;
        const totalCero = parseInt(total) === 0;
        const filtros = productosById.filtros
        const registros = productosById.registros
        const orden = productosById.filtros.orden
        const direccion = productosById.filtros.direccion
        return (
            <div className="tabla-listado">
                <div className="table-responsive tarjeta-body productos-listado">
                    <div className="d-flex justify-content-between">
                        <Titulo ruta={rutas.GESTION} titulo={"Productos"} clase="tabla-listado-titulo" operaciones={[operacion]} />
                        <a href="#"
                            onClick={() => history.push(rutas.PRODUCTO_ALTA + "?volverA=" + rutas.PRODUCTOS_LISTAR_ADMIN)}
                            data-toggle="tooltip" data-original-title="" title="">
                            <AddBoxIcon style={{ color: '#5cb860' }} />
                        </a>
                    </div>
                    <Filtros
                        {...this.props}
                        filtrar={(e) => this.filtrarProductos(e)}
                        onChangeBusqueda={(e) => this.onChangeBusqueda(e)}
                    />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    Imagen
                                </th>
                                <Ordenador
                                    id="nombre"
                                    texto="Nombre"
                                    orden={orden}
                                    direccion={direccion}
                                    changeDireccion={(e) => this.changeDirection(e)}
                                />
                                <Ordenador
                                    id="categoria"
                                    texto="Categoría"
                                    orden={orden}
                                    direccion={direccion}
                                    changeDireccion={(e) => this.changeDirection(e)}
                                />
                                <Ordenador
                                    id="compra_directa"
                                    clase="justify-content-end"
                                    texto="Compra directa"
                                    orden={orden}
                                    direccion={direccion}
                                    changeDireccion={(e) => this.changeDirection(e)}
                                />
                                <Ordenador
                                    id="venta_directa"
                                    clase="justify-content-end"
                                    texto="Venta directa"
                                    orden={orden}
                                    direccion={direccion}
                                    changeDireccion={(e) => this.changeDirection(e)}
                                />
                                <Ordenador
                                    id="stock"
                                    clase="justify-content-end"
                                    texto="Stock"
                                    orden={orden}
                                    direccion={direccion}
                                    changeDireccion={(e) => this.changeDirection(e)}
                                />
                                <Ordenador
                                    id="stock_seguridad"
                                    clase="justify-content-end"
                                    texto="Stock de alerta"
                                    orden={orden}
                                    direccion={direccion}
                                    changeDireccion={(e) => this.changeDirection(e)}
                                />
                                <Ordenador
                                    id="costo_vigente"
                                    clase="justify-content-end"
                                    texto="Costo"
                                    orden={orden}
                                    direccion={direccion}
                                    changeDireccion={(e) => this.changeDirection(e)}
                                />
                                <Ordenador
                                    id="precio_vigente"
                                    clase="justify-content-end"
                                    texto="Precio"
                                    orden={orden}
                                    direccion={direccion}
                                    changeDireccion={(e) => this.changeDirection(e)}
                                />
                                <th className="text-right pr-5">
                                    Margen
                                </th>
                                <th>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buscando ? Cargando : Productos}
                        </tbody>
                    </table>
                    <div className="productos-responsive">
                        {tableResponsive}
                    </div>
                    {
                        buscando || totalCero ?
                            ''
                            :
                            <Paginacion
                                activePage={filtros.paginaActual}
                                itemsCountPerPage={filtros.registrosPorPagina}
                                totalItemsCount={registros}
                                pageRangeDisplayed={5}
                                onChange={(e) => this.cambiarDePagina(e)}
                            />
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        productos: state.productos
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetProductos: () => {
            dispatch(resetProductos())
        },
        fetchProductos: () => {
            dispatch(fetchProductos())
        },
        saveDeleteProducto: (id) => {
            dispatch(saveDeleteProducto(id))
        },
        updateProducto: (producto) => {
            dispatch(updateProducto(producto))
        },
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));