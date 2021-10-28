import React, { useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import { fetchVentaById } from "../../../../actions/VentaActions"

//Components
import Titulo from "../../../elementos/Titulo"

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

    const getVisualizarHtml = () => {
        if (!venta || !venta.lineas) {
            return "";
        }
        let filas = [];
        venta.lineas.forEach(linea => {
            filas.push(
                <tr key={linea.id}>
                    <td>{linea.producto.nombre}</td>
                    <td className="text-right">{linea.cantidad}</td>
                    <td className="text-right">{linea.precio_texto}</td>
                    <td className="text-right">{linea.total_texto}</td>
                </tr>
            );
        });
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
        );
    }

    let titulo = "Visualizar Venta";
    if (venta && venta.id) {
        titulo += " I" + venta.id.toString().padStart(5, 0);;
    }
    let html = getVisualizarHtml();
    return (
        <div className="tarjeta-body ingreso-visualizar">
            <Titulo ruta={rutas.VENTA_ALMACEN_LISTADO} titulo={titulo} clase="tabla-listado-titulo" />
            {html}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        ventas: state.ventas,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchVentaById: (id) => {
            dispatch(fetchVentaById(id))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Visualizar));