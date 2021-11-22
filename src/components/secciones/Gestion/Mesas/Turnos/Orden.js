import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { updateTurno } from "../../../../../actions/TurnoActions";

//Constants
import c from "../../../../../constants/constants";

//CSS
import "../../../../../assets/css/Gestion/Turnos/Ordenes.css";

//Images
import productoVacio from "../../../../../assets/img/emptyImg.jpg";

function Orden(props) {
    const cantidad = parseInt(props.cantidad)
    const entregado = parseInt(props.entregado)
    const entregar = entregado
    const producto = props.producto
    let path = productoVacio;
    if (producto.imagen) {
        try {
            path = c.BASE_PUBLIC + producto.imagen;
        } catch (e) {
        }
    }

    /**
     * Actualiza la cantidad entregada de cada producto/orden.
     * 
     * @param {SyntheticBaseEvent} e 
     * @returns 
     */
    const onChangeOrden = (e) => {
        const turno = props.turnos.update.activo
        const idProducto = producto.id
        let actualizado = turno.ordenes.find(orden => {
            const producto = orden.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) === parseInt(idProducto)
        })

        if (actualizado === undefined) {
            return
        }
        
        let cambiado = turno
        const indice = cambiado.ordenes.indexOf(actualizado)
        const nuevaCantidad = parseInt(e.target.value)
        actualizado['entregado'] = parseFloat(nuevaCantidad)
        cambiado.ordenes[indice] = actualizado
        props.updateTurno(turno, turno.mesa)
    }

    return (
        <article key={producto.id} className="ordenes-orden">
            <header className="mb-3">
                <span>{producto.nombre}</span>
            </header>
            <div>
                <i class="fas fa-concierge-bell"></i>
                <span className="ml-2">{entregado}/{cantidad}</span>
            </div>
            <div className="input-group">
                <input
                    id="cantidad"
                    type="number"
                    className="text-right"
                    value={entregar ? entregar : ""}
                    step="1"
                    onChange={(e) => onChangeOrden(e)} />
                <div className="input-group-append">
                    <span className="input-group-text">u</span>
                </div>
            </div>
        </article>
    )
}

function mapStateToProps(state) {
    return {
        turnos: state.turnos,
        mesas: state.mesas,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTurno: (turno, mesa) => {
            dispatch(updateTurno(turno, mesa))
        },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Orden))