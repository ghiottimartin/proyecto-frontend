import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Elementos
import Modal from "../../elementos/Modales/Modal"


function SeleccionProductos(props) {
    const titulo = "Selección de productos";

    const getProductosHtml = () => {
        const elegir = props.productos.allIds.map(id => {
            const producto = props.productos.byId.productos[id]
            const elegidos = props.elegidos
            const elegido = elegidos.find(e => parseInt(e.id) === parseInt(producto.id))
            if (elegido === undefined) {
                return producto
            }
        })

        let Opciones = []
        if (Array.isArray(elegir)) {
            elegir.map(producto => {
                if (producto && !isNaN(producto.id)) {
                    const title = "Agregar " + producto.nombre
                    Opciones.push(<li key={producto.id} data-id={producto.id} title={title} onClick={(e) => props.addProducto(e)}>{producto.nombre}</li>)
                }
            })
        }

        return (
            <div className="lista-seleccionable">
                <ul>{Opciones.length > 0 ? Opciones : "No hay más productos para seleccionar."}</ul>
            </div>
        )
    }

    const cuerpo = getProductosHtml();
    return (
        <div className="seleccion-productos" >
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
        productos: state.productos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SeleccionProductos))