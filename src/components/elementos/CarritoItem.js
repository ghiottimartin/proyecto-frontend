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

//Utils
import { formatearMoneda } from "../../utils/formateador"

class ItemCarrito extends React.Component {
    constructor(props) {
        super(props);
    }

    buscarProducto(idBuscar) {
        let producto = {}
        this.props.productos.allIds.map(idProducto => {
            let actual = this.props.productos.byId.productos[idProducto]
            if (actual && actual.id && parseInt(actual.id) === parseInt(idBuscar)) {
                producto = actual
            }
        })
        return producto
    }

    render() {
        const { linea } = this.props;
        const guardando = this.props.pedidos.create.isCreating;
        if (!linea) {
            return "";
        }
        let path = productoVacio;
        
        let cantidad = linea.cantidad ? linea.cantidad : 0;
        let subtotal = linea.total ? linea.total : 0;
        let subtotal_formateado = formatearMoneda(subtotal)
        
        let productoLinea = linea.producto;
        let precio = productoLinea && productoLinea.precio_vigente ? productoLinea.precio_vigente : "";
        let precio_formateado = precio !== "" ? formatearMoneda(precio) : "";
        if (productoLinea.imagen) {
            try {
                path = c.BASE_PUBLIC + productoLinea.imagen;
            } catch (e) {
            }
        }
        return (
            <div key={productoLinea.id} className="carrito-item">
                <div className="carrito-item-top">
                    <img
                        src={path}
                        onError={(e) => e.target.src = productoVacio}
                        alt="Imagen de producto" />
                        <h2>{productoLinea.nombre}</h2>
                </div>
                <div style={{display: guardando ? "none" : "flex"}} className="carrito-item-bottom">
                    <div className="d-flex flex-column font-weight-bold">
                        <span>Cantidad:<span className="ml-2">{cantidad}</span></span>
                        <span>Precio:<span className="ml-2">{precio_formateado}</span></span>
                        <span>ST:<span className="ml-2">{subtotal_formateado}</span></span>
                    </div>
                </div>
                <div className="loader-borrando" style={{display: guardando ? "flex" : "none"}}>
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
