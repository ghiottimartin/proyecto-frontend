import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";


//Api
import auth from "../../api/authentication";

//Actions
import { resetPedidoAbierto, fetchPedidoAbierto, updatePedidoAbierto } from "../../actions/PedidoActions";
import { resetProductos, fetchProductos } from "../../actions/ProductoActions";

//Components
import Producto from "../elementos/Producto";
import Loader from "../elementos/Loader";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

//CSS
import "../../assets/css/AltaPedido.css";

class AltaPedido extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.resetPedidoAbierto();
        this.props.fetchPedidoAbierto();
        this.props.resetProductos();

        let logueado = auth.idUsuario() ? true :  false;
        this.props.fetchProductos(false, logueado, true);

        this.props.updatePedidoAbierto({
            tipo: 'retiro'
        })
    }

    componentWillUnmount() {
        this.props.resetPedidoAbierto();
        this.props.resetProductos();
    }

    getProductosOrdenados() {
        let productos = this.props.productos.allIds.map(id => {
            const producto = this.props.productos.byId.productos[id]
            if (producto !== undefined && producto.venta_directa) {
                return producto
            }
        })

        productos.sort(function (a, b) {
            let productoA = a.nombre;
            let productoB = b.nombre;
            if (productoA < productoB) { return -1; }
            if (productoA > productoB) { return 1; }
            return 0;
        })
        return productos
    }

    getProductosHtml(ordenados) {
        let productosHtml = ordenados.map(producto => {
            if (producto !== undefined) {
                return (
                    <Producto
                        key={"pedido-" + producto.id}
                        producto={producto}
                        guardando={this.props.guardando}
                        productoGuardando={this.props.producto}
                        getCantidad={(producto) => this.props.getCantidad(producto)}
                        agregarProducto={(producto, cantidad) => this.props.agregarProducto(producto, cantidad)}
                    />
                );
            }
        });
        return productosHtml;
    }

    render() {
        const isClosing = this.props.pedidos.update.isClosing
        const isCreating = this.props.pedidos.create.isCreating
        const buscando = this.props.productos.byId.isFetching;
        const loader = buscando || isClosing || isCreating;
        let ordenados = this.getProductosOrdenados();
        let productos = this.getProductosHtml(ordenados);
        let hayProductos = ordenados.length > 0;
        let clase = hayProductos && !loader ? "alta-pedido-productos" : "d-flex justify-content-center align-items-center h-100";
        if (!hayProductos) {
            productos = <h2 className="placeholder-producto">No hay productos cargados</h2>;
        }
        if (loader) {
            productos = <Loader display={true} />;
        }
        return (
            <div className="alta-pedido">
                <div className="tarjeta-body d-flex flex-column">
                    <h1>Pedido</h1>
                    <div className="carrito-botones justify-content-end no-cerrar-carrito align-self-end">
                        <button className="entregar" onClick={() => this.props.changeMostrar()}>
                            <ShoppingCartIcon className="icono-material hvr-grow" />
                        </button>
                    </div>
                    <div className={clase}>
                        {productos}
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        productos: state.productos,
        pedidos: state.pedidos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetPedidoAbierto: () => {
            dispatch(resetPedidoAbierto())
        },
        fetchPedidoAbierto: () => {
            dispatch(fetchPedidoAbierto())
        },
        fetchProductos: (paginar, admin, abierto) => {
            dispatch(fetchProductos(paginar, admin, abierto))
        },
        resetProductos: () => {
            dispatch(resetProductos())
        },
        updatePedidoAbierto: (pedido) => {
            dispatch(updatePedidoAbierto(pedido))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AltaPedido));