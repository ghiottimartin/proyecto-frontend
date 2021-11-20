import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//CSS
import "../../../../../assets/css/Gestion/Turnos/Turno.css"

//Constants
import * as colores from "../../../../../constants/colores"

function Turno(props) {
    const turno = props.turno

    const verProductos = () => {
        //Falta implementar
    }

    const verVenta = () => {
        //Falta implementar
    }

    let Operaciones = []
    Operaciones.push(
        <button key={turno.id + "-productos"} onClick={() => verProductos(turno)} style={{ backgroundColor: colores.COLOR_PRIMAY }}>
            Productos
        </button>
    )

    Operaciones.push(
        <button key={turno.id + "-venta"} onClick={() => verVenta(turno)} style={{ backgroundColor: colores.COLOR_SUCCESS }}>
            Venta
        </button>
    )

    return (
        <article key={turno.id} className="turno-tarjeta" style={{ backgroundColor: turno.color_fondo }}>
            <header className="mb-3">
                <span className={turno.estado_clase}>{turno.estado_texto}</span>
                <span>Turno {turno.numero_texto}</span>
            </header>
            <div className="d-flex flex-column">
                <span>
                    <i class="fas fa-calendar mr-2"></i>
                    {turno.fecha}
                </span>
                <span>
                    <i class="fas fa-hourglass-start mr-2"></i>
                    {turno.hora_inicio_texto}
                </span>
                <span>
                    <i class="fas fa-hourglass-end mr-2"></i>
                    {turno.hora_fin_texto}
                </span>
                <span>
                    <i class="fas fa-concierge-bell mr-1"></i>
                    {turno.mozo.first_name}
                </span>
            </div>
            <footer>
                {Operaciones}
            </footer>
        </article>
    )
}

function mapStateToProps(state) {
    return {
        turnos: state.turnos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Turno))