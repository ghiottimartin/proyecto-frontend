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
import * as rutas from '../../../constants/rutas.js';

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
        let idUsuario = auth.idUsuario();
        if (isNaN(idUsuario)) {
            history.push(rutas.LOGIN);
        }

        let logueado = this.props.usuarios.update.logueado;
        if (logueado && logueado.id && !this.comprobarAutorizado(logueado)) {
            history.push(rutas.PEDIDOS_COMENSAL);
        }

        this.buscarPedidos();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let logueado = this.props.usuarios.update.logueado;
        if (logueado && logueado.id && !this.comprobarAutorizado(logueado)) {
            history.push(rutas.PEDIDOS_COMENSAL);
        }

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

    /**
     * Devuelve true si el listado de pedidos pertenece a un vendedor que gestiona los mismos.
     * 
     * @returns bool
     */
    comprobarRutaTipoVendedor() {
        let rolVendedor = this.comprobarRutaRol(roles.ROL_VENDEDOR);
        return rolVendedor;
    }

    /**
     * Devuelve true si el listado de pedidos pertenece al los realizados por el usuario logueado.
     * 
     * @returns bool
     */
    comprobarRutaTipoComensal() {
        let rolComensal = this.comprobarRutaRol(roles.ROL_COMENSAL);
        return rolComensal;
    }

    /**
     * Devuelve true si el rol de la ruta coincide con el parámetro comparar.
     * 
     * @param {String} comparar 
     * @returns {Boolean}
     */
    comprobarRutaRol(comparar) {
        let rol = this.props.match.params.rol;
        let rolVendedor = rol === comparar;
        return rolVendedor;
    }

    /**
     * Devuelve true si el usuario logueado tiene permitido visualizar el listado actual.
     * 
     * El listado actual puede listar todos los pedidos si se ingresó desde las operaciones
     * del Vendedor, o los pedidos del usuario logueado.
     * 
     * @param {Object} logueado 
     * @returns {Boolean}
     */
    comprobarAutorizado(logueado) {
        let rolVendedor = this.comprobarRutaTipoVendedor();
        let esVendedor = logueado.esVendedor;
        return rolVendedor && esVendedor || !rolVendedor;
    }

    /**
     * Busca los pedidos según el tipo de listado.
     */
    buscarPedidos() {
        let rolVendedor = this.comprobarRutaTipoVendedor();
        this.props.resetPedidos();
        if (!rolVendedor) {
            let idUsuario = auth.idUsuario();
            this.props.fetchPedidos(idUsuario);
        }

        if (rolVendedor) {
            this.props.fetchPedidosVendedor();
        }
    }

    /**
     * Ejecuta la operación del listado de pedidos según el caso.
     * 
     * @param {Object} pedido 
     * @param {String} accion 
     */
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

    /**
     * Redirige a la visualización del pedido.
     * 
     * @param {Object} pedido 
     */
    visualizarPedido(pedido) {
        this.props.updatePedido(pedido);
        history.push("/pedidos/visualizar/" + pedido.id);
    }

    /**
     * Indica que el pedido fue recibido por el cliente, para ejecutar esta acción
     * debe tener el rol vendedor.
     * 
     * @param {Object} pedido 
     */
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

    /**
     * Marca el pedido como cancelado.
     * 
     * @param {Object} pedido 
     * @returns {void}
     */
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
            return;
        }
        Swal.fire({
            title: `¿Está seguro de cancelar el pedido? `,
            icon: 'question',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'rgb(88, 219, 131)',
            cancelButtonColor: '#bfbfbf',
        }).then((result) => {
            if (result.isConfirmed) {
                let idUsuario = auth.idUsuario();
                this.setState({ buscando: true });
                this.props.cancelarPedido(pedido.id, idUsuario);
            }
        });
    }
    /**
     * Devuelve las operaciones de un pedido.
     * 
     * @param {Object} pedido 
     * @returns {void}
     */
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

    /**
     * Devuelve el html necesario para mostrar los pedidos en formato de responsive.
     * 
     * @param {bool} rolVendedor 
     * @returns 
     */
    getHtmlPedidosResponsive(rolVendedor) {
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
                            <li style={{ display: rolVendedor ? "block" : "none" }}>
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
        const rolVendedor = this.comprobarRutaTipoVendedor();
        const titulo = rolVendedor ? "Pedidos" : "Mis pedidos";
        const ruta = rolVendedor ? rutas.GESTION : null;
        let Pedidos = [];
        if (noHayPedidos) {
            Pedidos =
                <tr className="text-center">
                    <td colSpan={rolVendedor ? 6 : 5}>Todavía no ha realizado ningún pedido</td>
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
                        <td style={{ display: rolVendedor ? "table-cell" : "none" }}>{pedido.usuario_texto}</td>
                        <td>{pedido.estado_texto}</td>
                        <td>{pedido.total_texto}</td>
                        <td>{operaciones}</td>
                    </tr>
                );
            }
        });
        const Cargando =
            <tr>
                <td colSpan={rolVendedor ? 6 : 5}><Loader display={true} /></td>
            </tr>;
        const pedidosResponsive = this.getHtmlPedidosResponsive(rolVendedor);
        return (
            <div className="tabla-listado producto-listado">
                <div className="table-responsive tarjeta-body listado">
                    <div className="d-flex justify-content-between">
                        <Titulo titulo={titulo} clase="tabla-listado-titulo" ruta={ruta} />
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Fecha</th>
                                <th style={{ display: rolVendedor ? "table-cell" : "none" }}>Usuario</th>
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
        pedidos: state.pedidos,
        usuarios: state.usuarios,
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