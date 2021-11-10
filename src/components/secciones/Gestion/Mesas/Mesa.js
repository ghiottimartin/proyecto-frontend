import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Constants
import * as rutas from "../../../../constants/rutas"
import * as colores from "../../../../constants/colores"

//Imagenes
import imgMesa from "../../../../assets/img/menu/table.png"

//Librerías
import history from "../../../../history"

function Mesa(props) {
    const mesa = props.mesa

    const gestionarTurno = (mesa) => {

    }

    const historicoTurnos = (mesa) => {

    }

    const editarMesa = (mesa) => {
        const ruta = rutas.MESA_EDITAR + mesa.id
        history.push(ruta)
    }

    let Operaciones = []
    Operaciones.push(
        <button onClick={() => gestionarTurno(mesa)} style={{backgroundColor: colores.COLOR_PRIMAY}}>
            Turno
        </button>
    )

    Operaciones.push(
        <button onClick={() => historicoTurnos(mesa)} style={{backgroundColor: colores.COLOR_SECONDARY}}>
            Histórico
        </button>
    )

    Operaciones.push(
        <button onClick={() => editarMesa(mesa)} style={{backgroundColor: colores.COLOR_SUCCESS}}>
            Editar
        </button>
    )

    return (
        <article className="mesa-tarjeta">
            <header>
                <span>Mesa {mesa.numero_texto}</span>
                <img className="icono-mesa" src={imgMesa} alt={"Mesa " + mesa.numero_texto} />
            </header>
            <span className="text-center">{mesa.descripcion_texto}</span>
            <footer>
                {Operaciones}
            </footer>
        </article>
    )
}

function mapStateToProps(state) {
    return {
        mesas: state.mesas
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mesa))