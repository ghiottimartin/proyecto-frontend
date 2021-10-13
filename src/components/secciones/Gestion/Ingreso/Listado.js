import React, { useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchIngresosIfNeeded } from "../../../../actions/IngresoActions"

//CSS
import "../../../../assets/css/Gestion/Ingreso.css"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Loader from "../../../elementos/Loader"
import Titulo from "../../../elementos/Titulo"

function IngresoListado(props) {
    const titulo = "Listado de ingresos"
    const buscando = props.ingresos.byId.isFetching

    useEffect(() => {
        props.fetchIngresosIfNeeded()
    }, [props.ingresos.allIds])

    /**
     * Devuelve una array de elementos html con las operaciones del ingreso.
     * 
     * @returns {Array}
     */
    const getOperacionesIngreso = () => {
        return <div></div>
    }

    let Ingresos = []
    props.ingresos.allIds.map(idIngreso => {
        let ingreso = props.ingresos.byId.ingresos[idIngreso];
        if (ingreso && ingreso.id) {
            let operaciones = getOperacionesIngreso(ingreso);
            Ingresos.push(
                <tr key={ingreso.id}>
                    <td>{ingreso.id_texto}</td>
                    <td>{ingreso.fecha_texto}</td>
                    <td>
                            <span>{ingreso.usuario_nombre}</span>
                            <br/>
                            <span className="texto-chico">{ingreso.usuario_email}</span>
                        </td>
                    <td className="font-weight-bold text-right px-5">
                        {ingreso.total_texto}
                    </td>
                    <td>{operaciones}</td>
                </tr>
            );
        }
    });
    return (
        <div className="ingreso-listado tarjeta-body">
            <Titulo ruta={rutas.GESTION} titulo={titulo} />
            <table className="table">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th className="text-right px-5">Total</th>
                        <th>Operaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {buscando ? <tr><td colSpan={5}><Loader display={true} /></td></tr> : Ingresos}
                </tbody>
            </table>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        ingresos: state.ingresos
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchIngresosIfNeeded: () => {
            dispatch(fetchIngresosIfNeeded())
        },
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IngresoListado))