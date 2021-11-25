import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchMesaById } from "../../../../../actions/MesaActions"
import { updateTurno, resetUpdateTurno, saveUpdateTurno } from "../../../../../actions/TurnoActions"
import { fetchProductos } from "../../../../../actions/ProductoActions"

//CSS
import "../../../../../assets/css/Gestion/Turnos/Ordenes.css"

//Constants
import * as rutas from "../../../../../constants/rutas"

//Components
import Titulo from "../../../../elementos/Titulo"
import Loader from "../../../../elementos/Loader"
import Orden from "./Orden"

//Librerías
import Swal from 'sweetalert2'
import history from "../../../../../history"

function Ordenes(props) {
    const idMesa = props.match.params['id']
    const buscando = props.mesas.byId.isFetching
    const isUpdating = props.turnos.update.isUpdating
    const loader = buscando || isUpdating

    const turno = props.turnos.update.activo
    const mesa = turno.mesa
    const mesaNombre = mesa && mesa.id ? mesa.numero_texto : '...'
    let titulo = `Órdenes del Turno de la Mesa ${mesaNombre}`

    useEffect(() => {
        if (!isNaN(idMesa)) {
            props.fetchMesaById(idMesa)
        }
        props.fetchProductos(false)
        return function limpiar() {
            props.resetUpdateTurno()
        }
    }, [])

    /**
     * Comprueba que el turno actual tenga los datos suficientes para ser guardado.
     */
    const comprobarOrdenesValidas = () => {
        let errores = []

        turno.ordenes.forEach(orden => {
            let producto = orden.producto
            let entregado = orden.entregado
            if (isNaN(entregado)) {
                errores.push(`Debe indicar la cantidad a entregar del producto '${producto.nombre}'`)
            }

            if (!isNaN(entregado) && entregado < 0)  {
                errores.push(`La cantidad a entregar del producto '${producto.nombre}' no puede ser menor a cero.`)
            }
            
            let cantidad = orden.cantidad
            if (!isNaN(cantidad) && cantidad < 0)  {
                errores.push(`La cantidad solicitada del producto '${producto.nombre}' no puede ser menor a cero.`)
            }

            if (!isNaN(cantidad) && !isNaN(entregado) && entregado > cantidad ) {
                errores.push(`La cantidad a entregar del producto '${producto.nombre}' no puede ser mayor a la cantidad solicitada.`)
            }
        })
        
        const valido = errores.length === 0
        if (!valido) {
            const items = errores.reduce((text, error) => text + '<li style="font-size: 14px;">' + error + '</li>', '')
            const html = '<ul style="text-align: left;">' + items + '</ul>'
            Swal.fire({
                title: `Ha ocurrido un inconveniente`,
                html: html,
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            })
        }

        return valido
    }

    /**
     * Guarda las órdenes del turno, permitiendo editarlo al reingresar a la gestión
     * del mismo.
     */
    const guardar = () => {
        let valido = comprobarOrdenesValidas()
        if (valido) {
            props.saveUpdateTurno(rutas.MESA_TURNO + idMesa)
        }
    }

    /**
     * Vuelve a la interfaz de gestión del turno.
     */
    const volver = () => {
        history.push(rutas.MESA_TURNO + idMesa)
    }

    let Ordenes = []
    if (turno && Array.isArray(turno.ordenes)) {
        Ordenes = turno.ordenes.map(orden => {
            const producto = orden.producto
            const cantidad = orden.cantidad ? orden.cantidad : ''
            const entregado = orden.entregado ? orden.entregado : 0
            const clave = orden.id ? orden.id : producto.id
            return (
                <Orden
                    key={clave}
                    producto={producto}
                    guardando={loader}
                    cantidad={cantidad}
                    entregado={entregado}
                />
            )
        })
    }

    return (
        <div className="turno-ordenes row justify-content-md-center">
            <div className="col-md-12">
                <section className="ordenes-turno tarjeta-body h-100">
                    <Titulo ruta={rutas.MESA_TURNO + idMesa} titulo={titulo} />
                    <Loader display={loader} />
                    <div className="contenedor-ordenes" style={{ display: loader ? "none" : "grid" }}>
                        {Ordenes}
                    </div>
                    <div className="contenedor-botones justify-content-around" style={{ display: loader ? "none" : "flex" }}>
                        <button onClick={() => guardar()} className="btn btn-success float-right boton-guardar mt-2" >
                            <span className="ml-1">Guardar</span>
                        </button>
                        <button onClick={() => volver()} className="btn btn-secondary float-right boton-guardar mt-2" >
                            <span className="ml-1">Volver</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        turnos: state.turnos,
        mesas: state.mesas,
        mozos: state.mozos,
        productos: state.productos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetUpdateTurno: () => {
            dispatch(resetUpdateTurno())
        },
        updateTurno: (turno, mesa) => {
            dispatch(updateTurno(turno, mesa))
        },
        saveUpdateTurno: (volverA) => {
            dispatch(saveUpdateTurno(volverA))
        },
        fetchMesaById: (id) => {
            dispatch(fetchMesaById(id))
        },
        fetchProductos: (paginar) => {
            dispatch(fetchProductos(paginar))
        },
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Ordenes))