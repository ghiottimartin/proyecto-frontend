import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Elementos
import Modal from "./Modal"


function SeleccionMozos(props) {
    const titulo = "Selección de mozos";

    const getMozosHtml = () => {
        const elegir = props.mozos.allIds.map(id => {
            const mozo = props.mozos.byId.mozos[id]
            const elegidos = props.elegidos
            const elegido = elegidos.find(e => parseInt(e.id) === parseInt(mozo.id))
            if (elegido === undefined) {
                return mozo
            }
        })

        let Opciones = []
        if (Array.isArray(elegir)) {
            elegir.map(mozo => {
                if (mozo && !isNaN(mozo.id)) {
                    const title = "Agregar " + mozo.first_name
                    Opciones.push(<li key={mozo.id} data-id={mozo.id} title={title} onClick={(e) => props.addMozo(e)}>{mozo.first_name}</li>)
                }
            })
        }

        return (
            <div className="lista-seleccionable">
                <ul>{Opciones.length > 0 ? Opciones : "No hay más mozos para seleccionar."}</ul>
            </div>
        )
    }

    const cuerpo = getMozosHtml();
    return (
        <div className="seleccion-mozos" >
            <Modal
                show={props.show}
                titulo={titulo}
                cuerpo={cuerpo}
                onHide={() => props.onHide()}
            />
        </div>
    )
}

function mapStateToProps(state) {
    return {
        mozos: state.mozos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SeleccionMozos))