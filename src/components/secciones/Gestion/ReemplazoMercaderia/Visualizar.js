import React, { useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import { fetchReemplazoById } from "../../../../actions/ReemplazoMercaderiaActions"

//Components
import Titulo from "../../../elementos/Titulo"
import Loader from "../../../elementos/Loader"

//Constantes
import * as rutas from "../../../../constants/rutas"

function Visualizar(props) {
    const reemplazo = props.reemplazos.update.activo

    useEffect(() => {
        const reemplazo = props.reemplazos.update.activo
        if (reemplazo && !reemplazo.id) {
            props.fetchReemplazoById(props.match.params.id)
        }
    }, [props.match.params.id])

    const getVisualizarHtml = () => {
        if (!reemplazo || !reemplazo.lineas) {
            return "";
        }

        let filas = [];
        reemplazo.lineas.forEach(linea => {
            filas.push(
                <tr key={linea.id}>
                    <td>{linea.producto.nombre}</td>
                    <td className="text-right">{linea.stock_anterior}</td>
                    <td className="text-right">{linea.cantidad_ingreso}</td>
                    <td className="text-right">{linea.cantidad_egreso}</td>
                    <td className="text-right">{linea.stock_nuevo}</td>
                </tr>
            );
        });
        return (
            <div className="reemplazo-visualizar mt-4">
                <ul>
                    <li>
                        <label>Fecha:</label>
                        <span>{reemplazo.fecha_texto}</span>
                    </li>
                    <li>
                        <label>Usuario:</label>{reemplazo.usuario_nombre} <span className="texto-chico">({reemplazo.usuario_email})</span>
                    </li>
                    <li className="d-flex align-items-center">
                        <label className="mb-0">Estado:</label>
                        <span className={reemplazo.estado_clase}>{reemplazo.estado_texto}</span>
                        <span style={{ display: reemplazo.anulado ? "block" : "none" }} className="reemplazo-anulado pl-2">{reemplazo.fecha_anulado}</span>
                    </li>
                </ul>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th className="text-right">Stock anterior</th>
                            <th className="text-right">Cantidad ingreso</th>
                            <th className="text-right">Cantidad egreso</th>
                            <th className="text-right">Stock nuevo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas}
                    </tbody>
                </table>
            </div>
        );
    }

    let titulo = "Visualizar Reemplazo";
    if (reemplazo && reemplazo.id) {
        titulo += " I" + reemplazo.id.toString().padStart(5, 0);;
    }
    let html = getVisualizarHtml();
    const buscando = props.reemplazos.byId.isFetching;
    return (
        <div className="tarjeta-body reemplazo-visualizar">
            <Titulo ruta={rutas.REEMPLAZO_MERCADERIA_LISTAR} titulo={titulo} clase="tabla-listado-titulo" />
            {buscando ? <Loader display={true} /> : html}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        reemplazos: state.reemplazos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchReemplazoById: (id) => {
            dispatch(fetchReemplazoById(id))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Visualizar));