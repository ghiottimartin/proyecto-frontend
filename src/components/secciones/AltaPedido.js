import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Actions
import { resetProductos, fetchProductos } from "../../actions/ProductoActions";
import { fetchPedidoAbierto, resetPedidoAbierto } from "../../actions/PedidoActions";

//Components
import Producto from "../elementos/Producto";
import Loader from "../elementos/Loader";

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
        this.props.fetchProductos();
    }

    componentWillUnmount() {
        this.props.resetPedidoAbierto();
    }

    render() {
        const buscando = this.props.productos.byId.isFetching;
        let productos = this.props.productos.allIds.map(id => {
            let producto = this.props.productos.byId.productos[id];
            if (producto !== undefined && producto.venta_directa && producto.stock > producto.stock_seguridad) {
                return (
                    <Producto
                        key={Math.random()}
                        producto={producto}
                        guardando={this.props.guardando}
                        productoGuardando={this.props.producto}
                        getCantidad={(producto) => this.props.getCantidad(producto)}
                        agregarProducto={(producto, cantidad) => this.props.agregarProducto(producto, cantidad)}
                    />
                );
            }
        });
        let hayProductos = productos.length > 0;
        let clase = hayProductos && !buscando ? "alta-pedido-productos" : "d-flex justify-content-center align-items-center h-100";
        if (!hayProductos) {
            productos = <h2 className="placeholder-producto">No hay productos cargados</h2>;
        }
        if (buscando) {
            productos = <Loader display={true} />;
        }
        return (
            <div className="alta-pedido">
                <div className="tarjeta-body d-flex flex-column">
                    <h1>Pedido</h1>
                    <div className="carrito-botones justify-content-end no-cerrar-carrito align-self-end">
                        <button className="entregar bg-success" onClick={() => this.props.changeMostrar()}>
                            Carrito
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
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProductos: () => {
            dispatch(fetchProductos())
        },
        resetProductos: () => {
            dispatch(resetProductos())
        },
        resetPedidoAbierto: () => {
            dispatch(resetPedidoAbierto())
        },
        fetchPedidoAbierto: () => {
            dispatch(fetchPedidoAbierto())
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AltaPedido));