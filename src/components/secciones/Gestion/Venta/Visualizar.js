import React, { useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import { fetchVentaById, pdfVenta } from "../../../../actions/VentaActions"

//Components
import Titulo from "../../../elementos/Titulo"
import Loader from "../../../elementos/Loader"

//Constantes
import * as rutas from "../../../../constants/rutas"

//CSS
import "../../../../assets/css/Gestion/VentaAlmacen.css"

function Visualizar(props) {
    const venta = props.ventas.update.activo

    useEffect(() => {
        const venta = props.ventas.update.activo
        if (venta && !venta.id) {
            props.fetchVentaById(props.match.params.id)
        }
    }, [props.match.params.id])

    const pdfVenta = (venta) => {
        props.pdfVenta(venta.id)
    }

    /**
     * Devuelve una array de elementos html con las operaciones de la venta.
     * 
     * @returns {Array}
     */
    const getOperacionPdf = (venta) => {
        if (!venta || !venta.id) {
            return "";
        }

        let pdf = ""
        venta.operaciones.forEach(operacion => {
            let accion = operacion.accion
            if (accion === "pdf") {
                pdf =
                    <div id={operacion.key} key={operacion.key} title={operacion.title} onClick={() => pdfVenta(venta)} className={operacion.clase + " operacion"} >
                        <i className={operacion.icono} aria-hidden="true"></i> {operacion.texto}
                    </div>
            }
        })
        return pdf
    }

    const getVisualizarHtml = () => {
        if (!venta || !venta.lineas) {
            return ""
        }
        let filas = []
        venta.lineas.forEach(linea => {
            filas.push(
                <tr key={linea.id}>
                    <td>{linea.producto.nombre}</td>
                    <td className="text-right">{linea.cantidad}</td>
                    <td className="text-right">{linea.precio_texto}</td>
                    <td className="text-right">{linea.total_texto}</td>
                </tr>
            )
        })

        let tipo_venta = venta.tipo_venta_online
        if (tipo_venta !== "") {
            tipo_venta = `(${tipo_venta})`
        }
        return (
            <div className="venta-visualizar mt-4">
                <ul>
                    <li>
                        <label>Fecha:</label>
                        <span>{venta.fecha_texto}</span>
                    </li>
                    <li>
                        <label>Usuario:</label>{venta.usuario_nombre} <span className="texto-chico">({venta.usuario_email})</span>
                    </li>
                    <li>
                        <label>Tipo:</label><span>{venta.tipo_venta}</span> <span className="text-muted">{tipo_venta}</span>
                    </li>
                    <li className="d-flex align-items-center">
                        <label className="mb-0">Estado:</label>
                        <span className={venta.estado_clase}>{venta.estado_texto}</span>
                        <span style={{ display: venta.anulado ? "block" : "none" }} className="venta-anulada pl-2">{venta.fecha_anulada}</span>
                    </li>
                    <li className="mt-1">
                        <label>Total:</label>
                        <span>{venta.total_texto}</span>
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
                            <td className="text-right">{venta.total_texto}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }

    let titulo = "Visualizar Venta"
    if (venta && venta.id) {
        titulo += " I" + venta.id.toString().padStart(5, 0)
    }
    let html = getVisualizarHtml()
    const pdf = getOperacionPdf(venta)

    let volverA = rutas.VENTA_LISTADO
    const query = rutas.getQuery('volverA')
    if (query !== null) {
        volverA = query
    }

    const buscando = props.ventas.byId.isFetching;
    return (
        <div className="tarjeta-body ingreso-visualizar position-relative">
            <Titulo ruta={volverA} titulo={titulo} clase="tabla-listado-titulo" />
            <div className="venta-operacion-pdf">
                {pdf}
            </div>
            {buscando ? <Loader display={true} /> : html}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        ventas: state.ventas,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchVentaById: (id) => {
            dispatch(fetchVentaById(id))
        },
        pdfVenta: (id) => {
            dispatch(pdfVenta(id))
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Visualizar))