import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//CSS
import "../../../../../assets/css/Gestion/Turnos/Turno.css"

//Constants
import * as colores from "../../../../../constants/colores"
import * as rutas from "../../../../../constants/rutas"

//Librerías
import Swal from 'sweetalert2';
import history from "../../../../../history"

function Turno(props) {
    const turno = props.turno
    const idMesa = turno.mesa

    const venta = turno.venta
    const idVenta = venta !== null ? venta.id : null

    /**
     * Devuelve la tabla html con los productos del turno.
     * 
     * @returns {String}
     */
    const getHtmlProductos = () => {
        const ordenes = turno.ordenes
        if (ordenes.length === 0) {
            return `<div className="alert alert-warning" role="alert">No hay productos cargados.</div>`
        }

        const Productos = ordenes.map(orden => {
            const producto = orden.producto
            const cantidad = orden.cantidad
            const nombre = producto.nombre
            const precio = producto.precio_texto
            const total = orden.total_texto
            let html = `
            <li className="list-group-item list-group-item-action" style="border: 1px solid grey;">
                <div className="d-flex w-100 justify-content-between">
                    <h5 className="mt-1" style="font-size: 14px;margin-top: 5px;">${nombre}</h5>
                </div>
                <p style="font-size: 12px; margin-bottom: 0;">${cantidad} x ${precio}</p>
                <small style="font-size: 13px;">Subtotal: ${total}</small>
            </li>
            `
            return html
        })

        let html = `
            <ul className="list-group" style="height: 230px;overflow-y: auto;list-style:none;padding-left: 0;">
                ${Productos.join('')}
                <li className="list-group-item list-group-item-action" style="border: 1px solid grey;">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1" style="font-size: 14px;margin-top: 5px;">Total</h5>
                        <small style="font-size: 13px;">${turno.total_texto}</small>
                    </div>
                </li>
            </ul>
        `
        return html
    }

    /**
     * Abre un modal con los productos cargados del turno.
     * 
     * @param {Object} turno 
     */
    const verProductos = (turno) => {
        const html = getHtmlProductos(turno)
        Swal.fire({
            title: "<h4 style='font-size: 15px;'>Turno " + turno.fecha + " </br> Mesa " + turno.mesa_numero + '</h4>',
            html: html,
            icon: 'info',
            showCloseButton: true,
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'rgb(88, 219, 131)',
            cancelButtonColor: '#bfbfbf',
        })
    }

    const verVenta = () => {
        if (idVenta === null) {
            return;
        }
        const volverA = rutas.MESA_TURNOS + idMesa
        history.push(rutas.VENTA_VISUALIZAR + idVenta + `?volverA=${volverA}`)
    }

    let Operaciones = []
    Operaciones.push(
        <button key={turno.id + "-productos"} onClick={() => verProductos(turno)} style={{ backgroundColor: colores.COLOR_PRIMAY }}>
            Productos
        </button>
    )

    if (false) {
        Operaciones.push(
            <button key={turno.id + "-venta"} onClick={() => verVenta(turno)} style={{ backgroundColor: colores.COLOR_SUCCESS }}>
                Venta
            </button>
        )
    }

    return (
        <article key={turno.id} className="turno-tarjeta" style={{ backgroundColor: turno.color_fondo }}>
            <header className="mb-3">
                <span className={turno.estado_clase}>{turno.estado_texto}</span>
                <span>Turno {turno.numero_texto}</span>
            </header>
            <div className="d-flex flex-column">
                <span>
                    <i className="fas fa-calendar mr-2"></i>
                    {turno.fecha}
                </span>
                <span>
                    <i className="fas fa-hourglass-start mr-2"></i>
                    {turno.hora_inicio_texto}
                </span>
                <span>
                    <i className="fas fa-hourglass-end mr-2"></i>
                    {turno.hora_fin_texto}
                </span>
                <span>
                    <i className="fas fa-concierge-bell mr-2"></i>
                    {turno.mozo.first_name}
                </span>
                <span>
                    <i className="fas fa-money-bill-wave mr-2"></i>
                    {turno.total_texto}
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