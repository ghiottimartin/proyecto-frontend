import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchMesas, updateFiltros, resetMesas } from "../../../../actions/MesaActions"
import { fetchMozos, resetMozos } from "../../../../actions/UsuarioActions"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Mesa from "./Mesa"
import Filtros from "./Filtros"
import Titulo from "../../../elementos/Titulo"
import Loader from "../../../elementos/Loader"
import AddBoxIcon from "@material-ui/icons/AddBox"

//CSS
import "../../../../assets/css/Gestion/Mesas.css"

//Librerías
import history from "../../../../history"

function Listado(props) {
    const mesas = props.mesas
    const titulo = "Listado de mesas"
    const total = mesas.byId.total
    const buscando = mesas.byId.isFetching || mesas.delete.isDeleting || mesas.update.isUpdating
    const cantidadMesas = mesas.allIds.length

    useEffect(() => {
        props.fetchMesas()
        props.fetchMozos()
        return function limpiar() {
            props.resetMesas()
            props.resetMozos()
        }
    }, [])

    const filtrarMesas = (e) => {
        e.preventDefault();
        props.fetchMesas()
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

    let Mesas = props.mesas.allIds.map(idMesa => {
        const mesa = props.mesas.byId.mesas[idMesa]
        if (mesa && mesa.id) {
            return (
                <Mesa key={mesa.id + "-mesa"} mesa={mesa} />
            )
        }
    })

    if (cantidadMesas == 0 && !buscando) {
        Mesas =
            <div className="alert alert-warning" role="alert">
                {total > 0 ? "No hay mesas para los filtros aplicados." : "No hay mesas cargadas."}
            </div>
    }

    return (
        <section className="mesas-listado tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.GESTION} titulo={titulo} />
                <a href="#"
                    onClick={() => history.push(rutas.MESA_ALTA + "?volverA=" + rutas.MESAS_LISTAR)}
                    data-toggle="tooltip" data-original-title="" title="">
                    <AddBoxIcon style={{ color: '#5cb860' }} />
                </a>
            </div>
            <div className="mesas-listado-contenedor">
                {buscando ? '' :
                    <Filtros
                        {...props}
                        filtrar={(e) => filtrarMesas(e)}
                        onChangeBusqueda={(e) => onChangeBusqueda(e)}
                    />
                }
                {buscando ? '' : Mesas}
                <Loader display={buscando} />
            </div>
        </section>
    )
}

function mapStateToProps(state) {
    return {
        mesas: state.mesas
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMesas: () => {
            dispatch(fetchMesas())
        },
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        },
        resetMesas: () => {
            dispatch(resetMesas())
        },
        fetchMozos: () => {
            dispatch(fetchMozos())
        },
        resetMozos: () => {
            dispatch(resetMozos())
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado))