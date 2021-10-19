import { useEffect } from 'react'
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import { resetMovimientos, fetchMovimientos } from "../../../../actions/MovimientosStockActions"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Titulo from "../../../elementos/Titulo"
import Loader from "../../../elementos/Loader"

//CSS
import "../../../../assets/css/Productos/Movimientos.css"

//Librerias
import history from '../../../../history'

function MovimientosStock(props) {
    const titulo = "Stock de productos"
    const buscando = props.movimientos.byId.isFetching

    useEffect(() => {
        props.resetMovimientos()
        props.fetchMovimientos()
    }, [])

    let Movimientos = []
    props.movimientos.allIds.map(idMovimiento => {
        const movimiento = props.movimientos.byId.movimientos[idMovimiento];
        if (movimiento && movimiento.id) {
            Movimientos.push(
                <tr key={movimiento.id}>
                    <td>{movimiento.id_texto}</td>
                    <td>{movimiento.fecha_texto}</td>
                    <td>{movimiento.producto.nombre}</td>
                    <td className="text-right pr-5">{movimiento.cantidad}</td>
                </tr>
            );
        }
    });

    return (
        <section className="movimiento-listado tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.PRODUCTOS_LISTAR_ADMIN} titulo={titulo} />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th className="text-right pr-5">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {buscando ? <tr><td colSpan={6}><Loader display={true} /></td></tr> : Movimientos}
                </tbody>
            </table>
        </section>
    )

}

function mapStateToProps(state) {
    return {
        movimientos: state.movimientos
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetMovimientos: () => {
            dispatch(resetMovimientos())
        },
        fetchMovimientos: () => {
            dispatch(fetchMovimientos())
        },
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MovimientosStock));