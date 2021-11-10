import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchMesas, updateFiltros, updateMesa, resetMesas } from "../../../../actions/MesaActions"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Mesa from "./Mesa"
import Titulo from "../../../elementos/Titulo"
import Loader from "../../../elementos/Loader"
import AddBoxIcon from "@material-ui/icons/AddBox"

//CSS
import "../../../../assets/css/Gestion/Mesas.css"

//Librerías
import history from "../../../../history"

function Listado(props) {
    const titulo = "Listado de mesas"
    const mesas = props.mesas
    const buscando = mesas.byId.isFetching

    useEffect(() => {
        props.fetchMesas()
        return function limpiar() {
            props.resetMesas()
        }
    }, [])

    const Mesas = props.mesas.allIds.map(idMesa => {
        const mesa = props.mesas.byId.mesas[idMesa]
        if (mesa && mesa.id) {
            return (
                <Mesa key={mesa.id} mesa={mesa}/>
            )
        }
    })
    
    return (
        <section className="mesas-listado tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.GESTION} titulo={titulo} />
                <a href="#"
                    onClick={() => history.push(rutas.MESA_ALTA + "?volverA=" + rutas.MESAS_LISTAR)}
                    data-toggle="tooltip" data-original-title="" title="">
                    <AddBoxIcon style={{ color:  '#5cb860'}}/>
                </a>
            </div>
            <div className="mesas-listado-contenedor">
                {Mesas}
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
        updateMesa: (mesa) => {
            dispatch(updateMesa(mesa))
        },
        resetMesas: () => {
            dispatch(resetMesas())
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado))