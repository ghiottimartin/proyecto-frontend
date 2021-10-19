import React, { useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import {fetchIngresoById} from "../../../../actions/IngresoActions"

//Components
import Titulo from "../../../elementos/Titulo"

//Constantes
import * as rutas from "../../../../constants/rutas"

//CSS
import "../../../../assets/css/Gestion/Ingreso.css"

function Visualizar(props) {
    const ingreso = props.ingresos.update.activo

    useEffect(() => {
        const ingreso = props.ingresos.update.activo
        if (ingreso && !ingreso.id) {
            props.fetchIngresoById(props.match.params.id)
        }
    }, [props.match.params.id])

    const getVisualizarHtml = () => {
        if (!ingreso || !ingreso.lineas) {
            return "";
        }
        let filas = [];
        ingreso.lineas.forEach(linea => {
            filas.push(
                <tr key={linea.id}>
                    <td>{linea.producto.nombre}</td>
                    <td className="text-right">{linea.cantidad}</td>
                    <td className="text-right">{linea.costo_texto}</td>
                    <td className="text-right">{linea.total_texto}</td>
                </tr>
            );
        });
        return (
            <div className="ingreso-visualizar mt-4">
                <ul>
                    <li>
                        <label>Fecha:</label>
                        <span>{ingreso.fecha_texto}</span>
                    </li>
                    <li>
                        <label>Usuario:</label>{ingreso.usuario_nombre} <span className="texto-chico">({ingreso.usuario_email})</span>
                    </li>
                    <li className="d-flex align-items-center">
                        <label className="mb-0">Estado:</label>
                        <span className={ingreso.estado_clase}>{ingreso.estado_texto}</span>
                        <span style={{ display: ingreso.anulado ? "block" : "none" }} className="ingreso-anulado pl-2">{ingreso.fecha_anulado}</span>
                    </li>
                    <li className="mt-1">
                        <label>Total:</label>
                        <span>{ingreso.total_texto}</span>
                    </li>
                </ul>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th className="text-right">Cantidad</th>
                            <th className="text-right">Costo</th>
                            <th className="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas}
                    </tbody>
                    <tfoot>
                        <tr className="font-weight-bold">
                            <td colSpan="3" className="text-left">Total</td>
                            <td className="text-right">{ingreso.total_texto}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }

    let titulo = "Visualizar Ingreso";
    if (ingreso && ingreso.id) {
        titulo += " I" + ingreso.id.toString().padStart(5, 0);;
    }
    let html = getVisualizarHtml();
    return (
        <div className="tarjeta-body ingreso-visualizar">
            <Titulo ruta={rutas.INGRESO_MERCADERIA} titulo={titulo} clase="tabla-listado-titulo" />
            {html}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        ingresos: state.ingresos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchIngresoById: (id) => {
            dispatch(fetchIngresoById(id))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Visualizar));