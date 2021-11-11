import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { saveDeleteMesa } from "../../../../actions/MesaActions"

//Constants
import * as rutas from "../../../../constants/rutas"
import * as colores from "../../../../constants/colores"

//Imagenes
import imgMesa from "../../../../assets/img/menu/table.png"

//Librerías
import history from "../../../../history"
import Swal from "sweetalert2"

function Mesa(props) {
    const mesa = props.mesa

    /**
     * Redirige a la gestión del turno de la mesa.
     * 
     * @param {Object} mesa 
     */
    const gestionarTurno = (mesa) => {

    }

    /**
     * Redirige al listado histórico de turnos.
     * 
     * @param {Object} mesa 
     */
    const historicoTurnos = (mesa) => {

    }

    /**
     * Redirige a la edición de la mesa.
     * 
     * @param {Object} mesa 
     */
    const editarMesa = (mesa) => {
        const rutaEdicion = rutas.MESA_EDITAR + mesa.id
        history.push(rutaEdicion)
    }

    /**
     * Abre el modal para confirmar el borrado de la mesa.
     * 
     * @param {Object} mesa 
     */
    const modalBorrarMesa = (mesa) => {
        Swal.fire({
            title: `¿Está seguro de borrar la Mesa '${mesa.numero_texto}?'`,
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: colores.COLOR_ROJO,
            cancelButtonColor: '#bfbfbf',
        }).then((result) => {
            if (result.isConfirmed) {
                props.saveDeleteMesa(mesa.id);
            }
        })
    }

    let Operaciones = []
    Operaciones.push(
        <button key={mesa.id + "-turnos"} onClick={() => gestionarTurno(mesa)} style={{ backgroundColor: colores.COLOR_PRIMAY }}>
            Turno
        </button>
    )

    Operaciones.push(
        <button key={mesa.id + "-historico"} onClick={() => historicoTurnos(mesa)} style={{ backgroundColor: colores.COLOR_SECONDARY }}>
            Histórico
        </button>
    )

    if (mesa.puede_editarse) {
        Operaciones.push(
            <button key={mesa.id + "-editar"} onClick={() => editarMesa(mesa)} style={{ backgroundColor: colores.COLOR_SUCCESS }}>
                Editar
            </button>
        )
    }

    return (
        <article key={mesa.id} className="mesa-tarjeta">
            <header>
                <span className={mesa.estado_clase}>{mesa.estado_texto}</span>
                <span>Mesa {mesa.numero_texto}</span>
                <img className="icono-mesa" src={imgMesa} alt={"Mesa " + mesa.numero_texto} />
                <button
                    key={mesa.id + "-quitar"}
                    style={{ display: mesa.puede_borrarse ? "block" : "none" }}
                    className="boton-icono-quitar"
                    onClick={() => modalBorrarMesa(mesa)}
                    title={"Borrar mesa " + mesa.numero_texto}
                >
                    <i className="fa fa-times"></i>
                </button>
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
        saveDeleteMesa: (id) => {
            dispatch(saveDeleteMesa(id))
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mesa))