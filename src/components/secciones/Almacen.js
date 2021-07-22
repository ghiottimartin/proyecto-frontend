import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Actions
import { fetchProductosIfNeeded } from "../../actions/ProductoActions";

//Components
import Button from '@material-ui/core/Button';
import Producto from "../elementos/Producto";

//CSS
import "../../assets/css/Almacen.css";

class Almacen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchProductosIfNeeded();
    }

    render() {
        let productos = this.props.productos.allIds.map(id => {
            let producto = this.props.productos.byId.productos[id];
            if (producto !== undefined) {
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
        let clase = hayProductos ? "almacen-productos" : "d-flex justify-content-center align-items-center h-100";
        if (!hayProductos) {
            productos = <h2 className="placeholder-producto">No hay productos cargados</h2>;
        }
        return (
            <div className="almacen">
                <div className="tarjeta-body d-flex flex-column">
                    <h1>Almacén</h1>
                    <div className={clase}>
                        {productos}
                    </div>
                    <div className="carrito-botones justify-content-end no-cerrar-carrito align-self-end">
                        <Button variant="outlined" color="secondary" className="recibir" onClick={() => this.props.changeMostrar()}>
                            Carrito
                        </Button>
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
        fetchProductosIfNeeded: () => {
            dispatch(fetchProductosIfNeeded())
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Almacen));