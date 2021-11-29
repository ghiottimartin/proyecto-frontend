import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { saveDeleteMesa } from "../../../../actions/MesaActions"
import { updateTurno, saveCreateTurno } from "../../../../actions/TurnoActions"

//Constants
import * as rutas from "../../../../constants/rutas"
import * as colores from "../../../../constants/colores"

//Imagenes
import imgMesa from "../../../../assets/img/menu/table.png"

//Librerías
import history from "../../../../history"
import Swal from "sweetalert2"
import AddBoxIcon from "@material-ui/icons/AddBox"

function Mesa(props) {
    const mesa = props.mesa

    /**
     * Devuelve un array con los nombres de los mozos.
     * 
     * @returns {Array}
     */
    const getOpcionesMozos = () => {
        let mozos = {}
        props.mozos.allIds.map(idMozo => {
            const mozo = props.mozos.byId.mozos[idMozo]
            mozos[idMozo] = mozo.first_name
        })
        return mozos
    }

    /**
     * Crea un turno y redirige a la gestión del turno de la mesa.
     * 
     * @param {Object} mesa 
     */
    const gestionarTurno = (mesa) => {
        const estado = mesa.estado
        if (estado === 'disponible') {
            const mozos = getOpcionesMozos()
            const turno = mesa.ultimo_turno
            let mozo = ""
            let texto = ""
            if (turno !== null && turno.id && turno.mozo && !isNaN(turno.mozo.id)) {
                mozo = turno.mozo.id
                texto = `Último mozo: "${turno.mozo.first_name}".`
            }
            Swal.fire({
                title: `La mesa está disponible`,
                text: texto,
                icon: 'info',
                input: 'select',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: true,
                confirmButtonText: 'Abrir',
                confirmButtonColor: colores.COLOR_SUCCESS,
                cancelButtonColor: '#bfbfbf',
                inputOptions: mozos,
                inputValue: mozo,
                inputPlaceholder: 'Seleccione un mozo',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debe seleccionar un mozo.'
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const nombre = mozos[result.value]
                    props.saveCreateTurno(mesa.id, nombre)
                }
            })
        }
        if (estado === 'ocupada') {
            props.updateTurno(mesa.ultimo_turno, mesa)
            const ruta = rutas.MESA_TURNO + mesa.id
            history.push(ruta)
        }
    }

    /**
     * Redirige al listado histórico de turnos.
     * 
     * @param {Object} mesa 
     */
    const historicoTurnos = (mesa) => {
        history.push(rutas.MESA_TURNOS + mesa.id)
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
    const titleTurno = mesa.disponible ? 'Crear turno' : 'Gestionar productos del turno'
    Operaciones.push(
        <button
            key={mesa.id + "-turnos"}
            title={titleTurno}
            onClick={() => gestionarTurno(mesa)}
            style={{ backgroundColor: mesa.disponible ? colores.COLOR_PRIMAY : colores.COLOR_ROJO }}
        >
            {mesa.disponible ? 'Turno' : 'Gestionar'}
        </button>
    )

    Operaciones.push(
        <button
            key={mesa.id + "-historico"}
            title="Ver listado histórico de turnos"
            onClick={() => historicoTurnos(mesa)}
            style={{ backgroundColor: colores.COLOR_SECONDARY }}
        >
            Histórico
        </button>
    )

    if (mesa.puede_editarse) {
        Operaciones.push(
            <button
                key={mesa.id + "-editar"}
                title={"Editar Mesa " + mesa.numero_texto}
                onClick={() => editarMesa(mesa)}
                style={{ backgroundColor: colores.COLOR_SUCCESS }}
            >
                Editar
            </button>
        )
    }

    return (
        <article key={mesa.id} className="mesa-tarjeta" style={{ backgroundColor: mesa.color_fondo }}>
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
        mesas: state.mesas,
        mozos: state.mozos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveDeleteMesa: (id) => {
            dispatch(saveDeleteMesa(id))
        },
        saveCreateTurno: (idMesa, nombreMozo) => {
            dispatch(saveCreateTurno(idMesa, nombreMozo))
        },
        updateTurno: (turno, mesa) => {
            dispatch(updateTurno(turno, mesa))
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mesa))