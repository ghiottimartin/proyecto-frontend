import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Constants
import * as roles from "../../../constants/roles"

//Librerías
import history from "../../../history"
import Swal from "sweetalert2"

function Pedido(props) {
    const pedido = props.pedido
    const cantidad_operaciones = pedido.operaciones.length

    /**
    * Devuelve true si el rol de la ruta coincide con el parámetro comparar.
    * 
    * @param {String} comparar 
    * @returns {Boolean}
    */
    const comprobarRutaRol = (comparar) => {
        let rol = props.match.params.rol;
        let rolVendedor = rol === comparar;
        return rolVendedor;
    }

    /**
     * Devuelve true si el listado de pedidos pertenece al los realizados por el usuario logueado.
     * 
     * @returns {Boolean}
     */
    const comprobarRutaTipoComensal = () => {
        let rolComensal = comprobarRutaRol(roles.ROL_COMENSAL);
        return rolComensal;
    }


    /**
     * Devuelve las operaciones de un pedido.
     * 
     * @param {Object} pedido 
     * @returns {void}
     */
    const getOperacionesPedido = (pedido) => {
        let operaciones = [];
        let rutaComensal = comprobarRutaTipoComensal();
        pedido.operaciones.forEach(operacion => {
            let accion = operacion.accion;
            if (rutaComensal && accion === 'entregar') {
                return;
            }
            operaciones.push(
                <div
                    key={operacion.key + "-responsive"}
                    title={operacion.title}
                    onClick={() => props.ejecutarOperacion(pedido, accion)}
                    className={"operacion-responsive " + operacion.clase_responsive }
                >
                    <i className={operacion.icono} aria-hidden="true"></i> {operacion.texto}
                </div>
            );
        })
        return (
            <div className={cantidad_operaciones > 1 ? "fila-operaciones" : "fila-operaciones d-flex" }>
                {operaciones}
            </div>
        );
    }

    const operaciones = getOperacionesPedido(pedido)

    return (
        <article key={pedido.id + "-responsive"} className="pedido-tarjeta">
            <header>
                <span className={pedido.tarjeta_estado_clase}>{pedido.estado_texto}</span>
                <span>Pedido {pedido.id_texto}</span>
            </header>
            <div className="d-flex flex-column">
                <span>
                    <i className="fas fa-calendar mr-2"></i>
                    {pedido.fecha_texto}
                </span>
                <span>
                    <i className="fas fa-globe-asia mr-2"></i>
                    {pedido.tipo_texto}
                </span>
                <span>
                    <i className="fas fa-money-bill-wave mr-2"></i>
                    {pedido.total_texto}
                </span>
            </div>
            <footer>
                {operaciones}
            </footer>
        </article>
    )
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Pedido))