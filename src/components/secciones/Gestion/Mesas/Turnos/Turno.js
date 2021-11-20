import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//CSS
import "../../../../../assets/css/Gestion/Turnos/Turno.css"

//Constants
import * as colores from "../../../../../constants/colores"

//Librerías
import Swal from 'sweetalert2';

function Turno(props) {
    const turno = props.turno

    /**
     * Devuelve la tabla html con los productos del turno.
     * 
     * @returns {String}
     */
    const getHtmlProductos = () => {
        const ordenes = turno.ordenes
        if (ordenes.length === 0) {
            return `<div class="alert alert-warning" role="alert">No hay productos cargados.</div>`
        }

        const Productos = ordenes.map(orden => {
            const producto = orden.producto
            const cantidad = orden.cantidad
            const nombre = producto.nombre
            const total = orden.total_texto
            let html = "<tr>"
            html += "<td>" + nombre + "</td>"
            html += "<td>" + cantidad + "</td>"
            html += "<td>" + total + "</td>"
            html += "</tr>"
            return html
        })

        let html = "<table class=\"table\">"
        html += "<thead>"
        html += "<th scope=\"col\">Producto</th>"
        html += "<th scope=\"col\">Cantidad</th>"
        html += "<th scope=\"col\">Subtotal</th>"
        html += "</tr>"
        html += "</thead>"
        html += "<tbody>"
        html += Productos.join('')
        html += "</tbody>"
        html += "<tfoot>"
        html += "<tr class=\"font-weight-bold\">"
        html += "<td colspan=\"2\" class=\"text-left\">Total</td>"
        html += "<td>" + turno.total_texto + "</td>"
        html += "</tr>"
        html += "</tfoot>"
        html += "</table>"
        return html
    }

    /**
     * Abre un modal con los productos cargados del turno.
     * 
     * @param {Object} turno 
     */
    const verProductos = (turno) => {
        const html = getHtmlProductos(turno)
        console.log(html)
        Swal.fire({
            title: "Productos solicitados",
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
        //Falta implementar
    }

    let Operaciones = []
    Operaciones.push(
        <button key={turno.id + "-productos"} onClick={() => verProductos(turno)} style={{ backgroundColor: colores.COLOR_PRIMAY }}>
            Productos
        </button>
    )

    Operaciones.push(
        <button key={turno.id + "-venta"} onClick={() => verVenta(turno)} style={{ backgroundColor: colores.COLOR_SUCCESS }}>
            Venta
        </button>
    )

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