import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import {fetchPedidoById} from "../../../actions/PedidoActions";

//Components
import Titulo from "../../elementos/Titulo";

//Constantes
import * as roles from '../../../constants/roles.js';
import * as rutas from "../../../constants/rutas";

//CSS
import "../../../assets/css/Pedidos.css";

class Visualizar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    
    componentDidMount() {
        if (this.props.pedidos.update.activo && !this.props.pedidos.update.activo.id) {
            this.props.fetchPedidoById(this.props.match.params.id);
        }
    }

    getVisualizarHtml(pedido, mostrarUsuarios) {
        if (!pedido || !pedido.lineas) {
            return "";
        }
        let filas = [];
        pedido.lineas.forEach(linea => {
            filas.push(
                <tr key={linea.id}>
                    <td>{linea.producto.nombre}</td>
                    <td className="text-right">{linea.cantidad}</td>
                    <td className="text-right">{linea.producto.precio_texto}</td>
                    <td className="text-right">{linea.total_texto}</td>
                </tr>
            );
        });
        return (
            <div className="pedido-visualizar mt-4">
                <ul>
                    <li>
                        <label>Fecha:</label>
                        <span>{pedido.fecha_texto}</span>
                    </li>
                    <li style={{display: mostrarUsuarios ? "block" : "none"}}>
                        <label>Usuario:</label>{pedido.usuario_nombre} <span className="texto-chico">({pedido.usuario_email})</span>
                    </li>
                    <li>
                        <label>Estado:</label>
                        <span className={pedido.estado_clase}>{pedido.estado_texto}</span>
                    </li>
                    <li>
                        <label>Total:</label>
                        <span>{pedido.total_texto}</span>
                    </li>
                </ul>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th className="text-right">Cantidad</th>
                            <th className="text-right">Precio</th>
                            <th className="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas}
                    </tbody>
                    <tfoot>
                        <tr className="font-weight-bold">
                            <td colSpan="3" className="text-left">Total</td>
                            <td className="text-right">{pedido.total_texto}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }

    /**
     * Devuelve true si la operación de visualización proviene de un listado
     * de pedidos para vendedores.
     * 
     * @returns {Boolean}
     */
    comprobarMostrarUsuario() {
        let rol = this.props.match.params.rol;
        let rolVendedor = rol === roles.ROL_VENDEDOR;
        return rolVendedor;
    }

    render() {
        let pedido = this.props.pedidos.update.activo;
        let titulo = "Visualizar pedido";
        if (pedido && pedido.id) {
            titulo += " P" + pedido.id.toString().padStart(5, 0);;
        }
        let mostrarUsuario = this.comprobarMostrarUsuario();
        let html = this.getVisualizarHtml(pedido, mostrarUsuario);
        let rutaVolver = mostrarUsuario ? rutas.PEDIDOS_VENDEDOR : rutas.PEDIDOS_COMENSAL;
        return (
            <div className="tarjeta-body pedido-visualizar">
                <Titulo ruta={rutaVolver} titulo={titulo} clase="tabla-listado-titulo" />
                {html}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPedidoById: (id) => {
            dispatch(fetchPedidoById(id))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Visualizar));