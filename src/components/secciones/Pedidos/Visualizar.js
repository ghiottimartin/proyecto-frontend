import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import {fetchPedidoById} from "../../../actions/PedidoActions";

//Components
import Titulo from "../../elementos/Titulo";

//Constants
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
                    <td>{linea.cantidad}</td>
                    <td>{linea.producto.precio_texto}</td>
                    <td>{linea.total_texto}</td>
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
                        <label>Usuario:</label>
                        <span>{pedido.usuario_texto}</span>
                    </li>
                    <li>
                        <label>Estado:</label>
                        <span>{pedido.estado_texto}</span>
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
                            <th>Cantidad</th>
                            <th> Precio</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="text-right font-weight-bold">Total</td>
                            <td>{pedido.total_texto}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }

    render() {
        let pedido = this.props.pedidos.update.activo;
        let titulo = "Visualizar pedido";
        if (pedido && pedido.id) {
            titulo += " P" + pedido.id.toString().padStart(5, 0);;
        }
        let mostrarUsuarios = this.props.pedidos.byId.mostrarUsuarios;
        let html = this.getVisualizarHtml(pedido, mostrarUsuarios);
        return (
            <div className="tarjeta-body pedido-visualizar">
                <Titulo ruta={rutas.PEDIDOS_COMENSAL} titulo={titulo} clase="tabla-listado-titulo" />
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