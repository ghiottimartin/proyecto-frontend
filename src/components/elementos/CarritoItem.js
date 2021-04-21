import React from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

//Constants
import c from "../../constants/constants";

//Components
import Loader from "./Loader";

//CSS
import '../../assets/css/Carrito.css';

//Images
import productoVacio from "../../assets/img/emptyImg.jpg";

//Material
import DeleteIcon from '@material-ui/icons/Delete';

class ItemCarrito extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {linea, guardando, productoGuardando, borrando} = this.props;
        if (!linea) {
            return "";
        }
        let path      = productoVacio;
        let cantidad  = linea.cantidad ? linea.cantidad : 0;
        let subtotal  = linea.subtotal ? linea.subtotal : 0;
        let productoLinea  = linea.producto ? linea.producto : {};
        let loader         = guardando && productoGuardando === productoLinea.id;
        let loaderBorrando = borrando && productoGuardando === productoLinea.id;
        if (productoLinea.imagen) {
            try {
                path = c.BASE_PUBLIC + "img/productos/" + productoLinea.imagen;
            } catch (e) {
            }
        }
        let gestionBotones = cantidad > 0 ?
            <div className="producto-derecha-carrito-cantidad-gestion">
                <button
                    className="mr-2"
                    onClick={() => this.props.agregarProducto(productoLinea, -1)}>
                    -
                </button>
                <span>{cantidad}</span>
                <button
                    className="ml-2"
                    onClick={() => this.props.agregarProducto(productoLinea, 1)}>
                    +
                </button>
            </div> : "";
        return (
            <div key={c.RANDOM} className="carrito-item">
                <div className="carrito-item-top">
                    <img
                        src={path}
                        onError={(e) => e.target.src = productoVacio}
                        alt="Imagen de producto" />
                        <h2>{productoLinea.nombre}</h2>
                </div>
                <div style={{display: loaderBorrando ? "none" : "flex"}} className="carrito-item-bottom">
                    {loader ? <Loader display={true}/> : gestionBotones}
                    <div className="carrito-item-bottom-subtotal font-weight-bold">
                        <span>$ {subtotal * cantidad}</span>
                    </div>
                    <div className="carrito-item-bottom-tacho">
                        <DeleteIcon className="cursor-pointer" onClick={() => this.props.borrarLinea(productoLinea.id)}/>
                    </div>
                </div>
                <div className="loader-borrando" style={{display: loaderBorrando ? "flex" : "none"}}>
                    <Loader display={true}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos,
        productos: state.productos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItemCarrito));
