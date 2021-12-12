import React, { useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import { fetchPedidoById, resetUpdatePedido } from "../../../actions/PedidoActions"

//Components
import Titulo from "../../elementos/Titulo"
import Loader from "../../elementos/Loader"

//Constantes
import * as roles from '../../../constants/roles.js'
import * as rutas from "../../../constants/rutas"

//CSS
import "../../../assets/css/Pedidos.css"

function Visualizar(props) {

    let rol = props.match.params.rol
    const rolVendedor = rol === roles.ROL_VENDEDOR

    useEffect(() => {
        const pedido = props.pedidos.update.activo
        if (pedido && !pedido.id) {
            props.fetchPedidoById(props.match.params.id)
        }
        return function limpiarAlta() {
            props.resetUpdatePedido()
        }
    }, [props.match.params.id])

    const getVisualizarHtml = (pedido) => {
        if (!pedido || !pedido.lineas) {
            return ""
        }
        let filas = []
        pedido.lineas.forEach(linea => {
            filas.push(
                <tr key={linea.id}>
                    <td>{linea.producto.nombre}</td>
                    <td className="text-right">{linea.cantidad}</td>
                    <td className="text-right">{linea.subtotal_texto}</td>
                    <td className="text-right">{linea.total_texto}</td>
                </tr>
            )
        })

        let listaResponsive = []
        pedido.lineas.forEach(linea => {
            listaResponsive.push(
                <li key={linea.id + "-responsive"} className="list-group-item">
                    <span>{linea.cantidad} x </span>
                    <span>{linea.subtotal_texto}</span>
                </li>
            )
            listaResponsive.push(
                <li key={linea.id + "-responsive-producto"} className="d-flex justify-content-between list-group-item border-black">
                    <span>{linea.producto.nombre}</span>
                    <span className="text-right">{linea.total_texto}</span>
                </li>
            )
        })
        listaResponsive.push(
            <li key="total-responsive" className="list-group-item">
                <label>Total:</label>
                <span>{pedido.total_texto}</span>
            </li>
        )
        return (
            <div className="pedido-visualizar mt-4">
                <ul>
                    <li key="fecha">
                        <label>Fecha:</label>
                        <span>{pedido.fecha_texto}</span>
                    </li>
                    <li key="tipo">
                        <label>Tipo:</label>
                        <span>{pedido.tipo_texto}</span>
                    </li>
                    <li key="usuario" style={{ display: rolVendedor ? "block" : "none" }}>
                        <label>Usuario:</label>{pedido.usuario_nombre} <span className="texto-chico">({pedido.usuario_email})</span>
                    </li>
                    <li key="estado">
                        <label>Estado:</label>
                        <span className={pedido.estado_clase}>{pedido.estado_texto}</span>
                    </li>
                    <li key="total" className="item-total">
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
                <div className="pedido-responsive">
                    <ul className="list-group">
                        {listaResponsive}
                    </ul>
                </div>
                <p style={{ display: rolVendedor ? "block" : "none" }}>
                    <b>Observaciones:</b> {pedido.observaciones}
                </p>
            </div>
        )
    }

    const buscando = props.pedidos.byId.isFetchingPedido
    let pedido = props.pedidos.update.activo
    let titulo = "Visualizar Pedido"
    if (pedido && pedido.id) {
        titulo += " P" + pedido.id.toString().padStart(5, 0)
    }
    let html = getVisualizarHtml(pedido)
    let rutaVolver = rolVendedor ? rutas.PEDIDOS_VENDEDOR : rutas.PEDIDOS_COMENSAL
    return (
        <div className="tarjeta-body pedido-visualizar">
            <Titulo ruta={rutaVolver} titulo={titulo} clase="tabla-listado-titulo" />
            {buscando ? <Loader display={true} /> : html}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPedidoById: (id) => {
            dispatch(fetchPedidoById(id))
        },
        resetUpdatePedido: () => {
            dispatch(resetUpdatePedido())
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Visualizar))