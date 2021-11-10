import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Constants
import * as colores from "../../../../constants/colores"

//Imagenes
import imgMesa from "../../../../assets/img/menu/table.png"
import imgMozo from "../../../../assets/icon/waiter.png"

function Mesa(props) {
    const mesa = props.mesa
    const mozos = mesa.mozos

    const Mozos = mozos.map(mozo => {
        return (
            <li key={mozo.id}>
                <img key={mozo.id} src={imgMozo} alt={"Mozo " + mozo.first_name}/>
                {mozo.first_name}
            </li>
        )
    })

    const gestionarTurno = () => {

    }

    const historicoTurnos = () => {

    }

    let Operaciones = []
    Operaciones.push(
        <button onClick={() => gestionarTurno()} style={{backgroundColor: colores.COLOR_PRIMAY}}>
            Turno
        </button>
    )

    Operaciones.push(
        <button onClick={() => historicoTurnos()} style={{backgroundColor: colores.COLOR_SECONDARY}}>
            Histórico
        </button>
    )

    return (
        <article className="mesa-tarjeta">
            <header>
                <span>Mesa {mesa.numero_texto}</span>
                <img className="icono-mesa" src={imgMesa} alt={"Mesa " + mesa.numero_texto} />
            </header>
            <h5>Mozos:</h5>
            <ol>
                {Mozos}
            </ol>
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