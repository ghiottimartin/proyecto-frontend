import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { fetchPedidos, resetPedidos, updatePedido, recibirPedido, cancelarPedido, fetchPedidosVendedor, resetPedidosVendedor } from "../../../actions/PedidoActions";

//Api
import auth from "../../../api/authentication";

//CSS
import "../../../assets/css/Pedidos.css";

//Components
import Loader from "../../elementos/Loader";
import Titulo from "../../elementos/Titulo";

//Constantes
import * as roles from '../../../constants/roles.js';

//Librerias
import history from "../../../history";
import Swal from "sweetalert2";

class Listado extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buscando: true,
            noHayPedidos: false
        }
    }

    componentDidMount() {
        this.buscarPedidos();        
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let allIds = this.props.pedidos.allIds;
        let pedidos = this.props.pedidos.byId;
        let prePedidos = prevProps.pedidos.byId;
        let deleting = this.props.pedidos.delete;
        let preDeleting = prevProps.pedidos.delete;
        let busco = prePedidos.isFetching && !pedidos.isFetching;
        let borro = preDeleting.isDeleting && !deleting.isDeleting;
        let cancelo = prePedidos.isCanceling && !pedidos.isCanceling;
        if ((busco || borro) && allIds.length === 0) {
            this.setState({
                noHayPedidos: true,
            })
        }
        if (busco || cancelo) {
            this.setState({
                buscando: false,
            })
        }

        let rol = this.props.match.params.rol;
        let rolAnterior = prevProps.match.params.rol;
        if (rol !== rolAnterior) {
            this.buscarPedidos();
        }
    }

    buscarPedidos() {
        let rol = this.props.match.params.rol;
        this.props.resetPedidos();
        if (rol === roles.ROL_COMENSAL) {
            let idUsuario = auth.idUsuario();
            this.props.fetchPedidos(idUsuario);
        }

        if (rol === roles.ROL_VENDEDOR) {
            this.props.fetchPedidosVendedor();
        }
    }

    ejecutarOperacion(pedido, accion) {
        switch (accion) {
            case 'visualizar':
                this.visualizarPedido(pedido);
                break;
        
            case 'entregar':
                this.entregarPedido(pedido);
                break;
            
            case 'cancelar':
                this.cancelarPedido(pedido);
                break;
        }
    }

    visualizarPedido(pedido) {
        this.props.updatePedido(pedido);
        history.push("/pedidos/visualizar/" + pedido.id);
    }

    entregarPedido(pedido) {
        let id = pedido.id;
        if (!id) {
            Swal.fire({
                title: `Hubo un error al entregar el pedido intente refrescar la página.`,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: true,
                confirmButtonText: 'Continuar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            });
        } else {
            let idUsuario = auth.idUsuario();
            this.setState({ buscando: true });
            this.props.recibirPedido(pedido.id, idUsuario);
        }
    }

    cancelarPedido(pedido) {
        let id = pedido.id;
        if (!id) {
            Swal.fire({
                title: `Hubo un error al cancelar el pedido intente refrescar la página.`,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: true,
                confirmButtonText: 'Cancelar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            });
        } else {
            let idUsuario = auth.idUsuario();
            this.setState({ buscando: true });
            this.props.cancelarPedido(pedido.id, idUsuario);
        }
    }

    getOperacionesPedido(pedido) {
        let operaciones = [];
        pedido.operaciones.forEach(operacion => {
            let accion = operacion.accion;
            operaciones.push(
                <div key={operacion.key} onClick={() => this.ejecutarOperacion(pedido, accion)} className={operacion.clase + " operacion"} >
                    <i className={operacion.icono} aria-hidden="true"></i> {operacion.texto}
                </div>
            );
        })
        return (
            <div className="fila-operaciones">
                {operaciones}
            </div>
        );
    }

    getHtmlPedidosResponsive(mostrarUsuarios) {
        let Pedidos = [];
        this.props.pedidos.allIds.map(idPedido => {
            let pedido = this.props.pedidos.byId.pedidos[idPedido];
            if (pedido && pedido.id) {
                let operaciones = this.getOperacionesPedido(pedido);
                Pedidos.push(
                    <div key={pedido.id + "-responsive"} className="pedidos-responsive-item">
                        <ul>
                            <li><b>Número:</b> {pedido.id_texto}</li>
                            <li><b>Fecha:</b> {pedido.fecha_texto}</li>
                            <li style={{ display: mostrarUsuarios ? "block" : "none" }}>
                                <b>Usuario:</b> {pedido.usuario_texto}
                            </li>
                            <li><b>Estado:</b>  {pedido.estado_texto}</li>
                            <li><b>Total:</b>  {pedido.total_texto}</li>
                            <li>{operaciones}</li>
                        </ul>
                    </div>
                );
            }
        });
        return Pedidos;
    }

    render() {
        const { noHayPedidos, buscando } = this.state;
        let mostrarUsuarios = this.props.pedidos.byId.mostrarUsuarios;
        let Pedidos = [];
        if (noHayPedidos) {
            Pedidos =
                <tr className="text-center">
                    <td colSpan={mostrarUsuarios ? 6 : 5}>Todavía no ha realizado ningún pedido</td>
                </tr>;
        }
        this.props.pedidos.allIds.map(idPedido => {
            let pedido = this.props.pedidos.byId.pedidos[idPedido];
            if (pedido && pedido.id) {
                let operaciones = this.getOperacionesPedido(pedido);
                Pedidos.push(
                    <tr key={pedido.id} className={pedido.cancelado ? "text-muted" : ""}>
                        <td>{pedido.id_texto}</td>
                        <td>{pedido.fecha_texto}</td>
                        <td style={{display: mostrarUsuarios ? "block" : "none"}}>{pedido.usuario_texto}</td>
                        <td>{pedido.estado_texto}</td>
                        <td>{pedido.total_texto}</td>
                        <td>{operaciones}</td>
                    </tr>
                );
            }
        });
        const Cargando =
            <tr>
                <td colSpan={mostrarUsuarios ? 6 : 5}><Loader display={true} /></td>
            </tr>;
        const pedidosResponsive = this.getHtmlPedidosResponsive(mostrarUsuarios);
        const rol = this.props.match.params.rol;
        const rolComensal = rol === roles.ROL_COMENSAL;
        const titulo = rolComensal ? "Mis pedidos" : "Pedidos";
        return (
            <div className="tabla-listado producto-listado">
                <div className="table-responsive tarjeta-body listado">
                    <div className="d-flex justify-content-between">
                        <Titulo titulo={titulo} clase="tabla-listado-titulo" />
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Fecha</th>
                                <th style={{display: mostrarUsuarios ? "block" : "none"}}>Usuario</th>
                                <th>Estado</th>
                                <th>Total</th>
                                <th>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buscando ? Cargando : Pedidos}
                        </tbody>
                    </table>
                    <div className="pedidos-responsive">
                        {pedidosResponsive}
                    </div>
                </div>
            </div>
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
        fetchPedidos: (idUsuario) => {
            dispatch(fetchPedidos(idUsuario))
        },
        resetPedidos: () => {
            dispatch(resetPedidos())
        },
        updatePedido: (pedido) => {
            dispatch(updatePedido(pedido))
        },
        recibirPedido: (id, idUsuario) => {
            dispatch(recibirPedido(id, idUsuario))
        },
        cancelarPedido: (id, idUsuario) => {
            dispatch(cancelarPedido(id, idUsuario))
        },
        fetchPedidosVendedor: () => {
            dispatch(fetchPedidosVendedor())
        },
        resetPedidosVendedor: () => {
            dispatch(resetPedidosVendedor())
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));