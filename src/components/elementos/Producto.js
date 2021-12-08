import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Actions
import { createPedido, saveCreatePedido, fetchPedidoById } from "../../actions/PedidoActions"

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
        this.state = {}
    }

    render() {
        const props = this.props;
        let cantidad = this.props.getCantidad(this.props.producto);
        let idProducto = props.productoGuardando;
        let creando = props.pedidos.create.isCreating;
        let loader = creando && parseInt(idProducto) === parseInt(props.producto.id) && idProducto !== 0;
        const producto = props.producto;
        if (isNaN(cantidad)) {
            cantidad = 0;
        }

        let path = productoVacio;
        if (producto.imagen) {
            try {
                path = c.BASE_PUBLIC + producto.imagen;
            } catch (e) {
            }
        }

        let gestionCantidad = cantidad === 0 ?
            <Button variant="outlined" color="primary" className="anular no-cerrar-carrito" onClick={() => this.props.agregarProducto(producto, 1)}>
                <ShoppingCartIcon className="icono-material hvr-grow" />Agregar
            </Button>
            :
            <div className="producto-derecha-carrito-cantidad-gestion no-cerrar-carrito">
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
            <article key={producto.id} className="producto no-cerrar-carrito">
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
