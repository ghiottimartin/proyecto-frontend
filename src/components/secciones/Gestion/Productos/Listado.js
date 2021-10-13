import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Actions
import {resetProductos, fetchProductosIfNeeded, saveDeleteProducto, updateProducto} from "../../../../actions/ProductoActions";

//CSS
import "../../../../assets/css/Productos/Listado.css";
import "../../../../assets/css/Listado.css";

//Constants
import * as rutas from "../../../../constants/rutas";

//Componentes
import AddBoxIcon from "@material-ui/icons/AddBox";
import Loader from "../../../elementos/Loader";
import Titulo from "../../../elementos/Titulo";

//Images
import productoVacio from "../../../../assets/img/emptyImg.jpg";
import tacho from "../../../../assets/icon/delete.png";
import lapiz from "../../../../assets/icon/pencil.png";
import Swal from "sweetalert2";

//Librerias
import history from "../../../../history";

class Listado extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buscando:       true,
            noHayProductos: false
        }
    }

    componentDidMount() {
        this.props.resetProductos();
        this.props.fetchProductosIfNeeded();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let allIds       = this.props.productos.allIds;
        let borrados     = this.props.productos.delete;
        let productos    = this.props.productos.byId;
        let preProductos = prevProps.productos.byId;
        let sinIds       = allIds.length === 0;
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
    }

    clickEditar(producto) {
        let id         = producto.id;
        let rutaEditar = rutas.getUrl(rutas.PRODUCTOS, id, rutas.ACCION_EDITAR, rutas.TIPO_ADMIN, rutas.PRODUCTOS_LISTAR_ADMIN);
        this.props.updateProducto(producto);
        history.push(rutaEditar);
    }

    getOperacionesProducto(producto) {
        return (
            <div>
                <p onClick={() => this.clickEditar(producto)} title="Editar "
                   className="operacion">
                    <img src={lapiz} className="icono-operacion" alt="Editar producto"/>
                    Editar
                </p>
                <p onClick={() => this.modalBorrar(producto)} title="Borrar"  style={{display: producto.puede_borrarse ? "inline" : "none"}} 
                   className="operacion">
                    <img src={tacho} className="icono-operacion" alt="Borrar producto"/>
                    Borrar
                </p>
            </div>
        );
    }

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
                        path = producto.imagen;
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

    render() {
        const { noHayProductos, buscando } = this.state;
        let Productos = [];
        if (noHayProductos) {
            Productos =
                <tr className="text-center">
                    <td colSpan="7">No hay productos cargados</td>
                </tr>;
        }
        this.props.productos.allIds.map(idProducto => {
            let producto = this.props.productos.byId.productos[idProducto];
            if (producto && producto.id) {
                let operaciones = this.getOperacionesProducto(producto);
                let path = productoVacio;
                if (producto.imagen) {
                    try {
                        path = producto.imagen;
                    } catch (e) {
                    }
                }
                Productos.push(
                    <tr key={producto.id}>
                        <td className="td-imagen">
                            <img src={path} onError={(e) => e.target.src = productoVacio} alt="Imagen de producto" />
                        </td>
                        <td>{producto.nombre}</td>
                        <td>{producto.categoria_texto}</td>
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
                <td colSpan={7}><Loader display={true} /></td>
            </tr>;
        let operacion = {
            'ruta': rutas.CATEGORIAS_LISTAR_ADMIN + '?volverA=' + rutas.PRODUCTOS_LISTAR_ADMIN,
            'texto': 'Categorías',
            'clase': 'btn-success',
        };
        const tableResponsive = this.getHtmlListadoResponsive();
        return (
            <div className="tabla-listado">
                <div className="table-responsive tarjeta-body productos-listado">
                    <div className="d-flex justify-content-between">
                        <Titulo ruta={rutas.GESTION} titulo={"Productos"} clase="tabla-listado-titulo" operaciones={[operacion]} />
                        <a href="#"
                            onClick={() => history.push(rutas.PRODUCTO_ALTA + "?volverA=" + rutas.PRODUCTOS_LISTAR_ADMIN)}
                           data-toggle="tooltip" data-original-title="" title="">
                            <AddBoxIcon style={{ color:  '#5cb860'}}/>
                        </a>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoria</th>
                            <th className="text-right px-5">Costo</th>
                            <th className="text-right px-5">Precio</th>
                            <th className="text-right px-5">Margen</th>
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
        fetchProductosIfNeeded: () => {
            dispatch(fetchProductosIfNeeded())
        },
        saveDeleteProducto: (id) => {
            dispatch(saveDeleteProducto(id))
        },
        updateProducto: (producto) => {
            dispatch(updateProducto(producto))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));