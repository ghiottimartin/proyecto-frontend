import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchTurnos, updateFiltros, resetTurnos } from "../../../../../actions/TurnoActions"

//Constants
import * as rutas from "../../../../../constants/rutas"

//Components
import Turno from "./Turno"
import Filtros from "./Filtros"
import Titulo from "../../../../elementos/Titulo"
import Loader from "../../../../elementos/Loader"

//CSS
import "../../../../../assets/css/Gestion/Historico.css"

function Historico(props) {
    const turnos = props.turnos
    const total = turnos.byId.total
    const cantidadTurnos = turnos.allIds.length

    const mesa = props.mesas.update.activo
    const idMesa = props.match.params["id"]
    const numeroMesa = mesa && mesa.id ? mesa.numero_texto : "..."
    
    const titulo = "Turnos de la Mesa " + numeroMesa
    const buscando = turnos.byId.isFetching

    useEffect(() => {
        props.fetchTurnos(idMesa)
        return function limpiar() {
            props.resetTurnos()
        }
    }, [])

    const filtrarTurnos = (e) => {
        e.preventDefault();
        props.fetchTurnos(idMesa)
    }

    /**
     * Cambia los filtros a aplicar, si cambia un filtro que no sea la paginación
     * vuelve a la página inicial.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const onChangeBusqueda = (e) => {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        props.updateFiltros(cambio);
    }

    let Turnos = props.turnos.allIds.map(idTurno => {
        const turno = props.turnos.byId.turnos[idTurno]
        if (turno && turno.id) {
            return (
                <Turno key={turno.id + "-turno"} turno={turno} />
            )
        }
    })

    if (cantidadTurnos == 0 && !buscando) {
        Turnos =
            <div className="alert alert-warning" role="alert">
                {total > 0 ? "No hay turnos para los filtros aplicados." : "La mesa no tiene turnos."}
            </div>
    }

    return (
        <section className="turnos-listado tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.MESAS_LISTAR} titulo={titulo} />
            </div>
            <div className="turnos-listado-contenedor">
                {buscando ? '' :
                    <Filtros
                        {...props}
                        filtrar={(e) => filtrarTurnos(e)}
                        onChangeBusqueda={(e) => onChangeBusqueda(e)}
                    />
                }
                {buscando ? '' : Turnos}
                <Loader display={buscando} />
            </div>
        </section>
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
        fetchTurnos: (filtros) => {
            dispatch(fetchTurnos(filtros))
        },
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        },
        resetTurnos: () => {
            dispatch(resetTurnos())
        },
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Historico))