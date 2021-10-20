import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Actions
import { resetProductos,  fetchProductos} from "../../actions/ProductoActions";

//Components
import Producto from "../elementos/Producto";
import Loader from "../elementos/Loader";

//CSS
import "../../assets/css/Almacen.css";

class Almacen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.resetProductos();
        this.props.fetchProductos();
    }

    render() {
        const buscando = this.props.productos.byId.isFetching;
        let productos = this.props.productos.allIds.map(id => {
            let producto = this.props.productos.byId.productos[id];
            if (producto !== undefined && producto.venta_directa && producto.stock > 0) {
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
        let clase = hayProductos && !buscando ? "almacen-productos" : "d-flex justify-content-center align-items-center h-100";
        if (!hayProductos) {
            productos = <h2 className="placeholder-producto">No hay productos cargados</h2>;
        }
        if (buscando) {
            productos = <Loader display={true} />;
        }
        return (
            <div className="almacen">
                <div className="tarjeta-body d-flex flex-column">
                    <h1>Almacén</h1>
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
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Almacen));