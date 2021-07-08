import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Actions
import {createPedido, saveCreatePedido, fetchPedidoById} from "../../actions/PedidoActions"

//Constants
import c from "../../constants/constants";

//Components
import Loader from "./Loader";

//CSS
import "../../assets/css/Producto.css";

//Images
import productoVacio from "../../assets/img/emptyImg.jpg";

//MateriaUI
import Button from '@material-ui/core/Button';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

class Producto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cantidad: null,
        }
    }

    componentDidMount() {
        if (this.props.pedidos.byId.abierto.id && this.state.cantidad === null) {
            let cantidad = this.props.getCantidad(this.props.producto);
            this.setState({
                cantidad: cantidad
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let cambioActivo = prevProps.pedidos.byId.abierto.id !== this.props.pedidos.byId.abierto.id;
        if (cambioActivo && this.state.cantidad === null) {
            let cantidad = this.props.getCantidad(this.props.producto);
            this.setState({
                cantidad: cantidad
            })
        }
    }

    createPedido(pedido, idProducto) {
        let linea = {};
        linea.cantidad = 1;
        linea.producto = idProducto;
        pedido.lineas.push(linea);
        return pedido;
    }

    render() {
        const props = this.props;
        let {cantidad} = this.state;
        let guardando  = props.guardando;
        let idProducto = props.productoGuardando;
        let loader = guardando && idProducto === props.producto.id;
        const producto = props.producto;
        if (cantidad === null) {
            cantidad = 0;
        }

        let path = productoVacio;
        if (producto.imagen) {
            try {
                path = producto.imagen;
            } catch (e) {
            }
        }
        let gestionCantidad = cantidad === 0 ?
            <Button variant="outlined" color="primary" className="cancelar" onClick={() => this.props.agregarProducto(producto, 1)}>
                <ShoppingCartIcon className="icono-material hvr-grow"/>Agregar
            </Button>
            :
            <div className="producto-derecha-carrito-cantidad-gestion">
                <button
                    className="mr-2"
                    onClick={() => this.props.agregarProducto(producto, -1)}>
                    -
                </button>
                <span>{cantidad}</span>
                <button
                    className="ml-2"
                    onClick={() => this.props.agregarProducto(producto, 1)}>
                    +
                </button>
            </div>;
        return (
            <article key={producto.id} className="producto">
                <div className="producto-izquierda">
                    <img src={path} onError={(e) => e.target.src = productoVacio} alt="Imagen de producto" />
                </div>
                <div className="producto-derecha">
                    <div className="producto-derecha-titulos">
                        <h2>{producto.nombre}</h2>
                        <h3>{producto.descripcion}</h3>
                    </div>
                    <div className="producto-derecha-carrito">
                        <div className="producto-derecha-carrito-cantidad">
                            {
                                loader ? <Loader display={true} /> : gestionCantidad
                            }
                        </div>
                        <p className="producto-derecha-precio font-weight-bold text-right pr-2 m-0 text-nowrap">
                            {producto.precio_texto}
                        </p>
                    </div>
                </div>
            </article>
        )
    }
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        createPedido: (pedido) => {
          dispatch(createPedido(pedido))
        },
        saveCreatePedido: (volverA) => {
            dispatch(saveCreatePedido(volverA))
        },
        fetchPedidoById: (pedido) => {
            dispatch(fetchPedidoById(pedido))
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Producto));
