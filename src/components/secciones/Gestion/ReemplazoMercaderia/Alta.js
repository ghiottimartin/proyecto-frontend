import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import { createReemplazo, saveCreateReemplazo, resetCreateReemplazo } from "../../../../actions/ReemplazoMercaderiaActions"
import { fetchProductos, resetProductos } from "../../../../actions/ProductoActions"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Titulo from "../../../elementos/Titulo"
import Loader from "../../../elementos/Loader"

//CSS
import "../../../../assets/css/Gestion/ReemplazoMercaderia.css"

//Librerias
import Swal from 'sweetalert2'
import AddBoxIcon from "@material-ui/icons/AddBox"
import history from "../../../../history"

//Utils
import { getIconoConId } from "../../../../utils/utils"

function Alta(props) {
    const titulo = "Alta de reemplazo de mercadería"
    const buscando = props.productos.byId.isFetching
    const reemplazo = props.reemplazos.create.nuevo
    const isCreating = props.reemplazos.create.isCreating

    useEffect(() => {
        props.fetchProductos(false)
        return function limpiarAltaReemplazo() {
            props.resetCreateReemplazo()
            props.resetProductos()
        }
    }, [])

    /**
     * Devuelve las opciones elegibles de productos con stock mayor a cero.
     * 
     * @returns {array}
     */
    const getOpcionesProductos = () => {
        if (buscando) {
            return []
        }

        let actuales = []
        if (!props && !props.productos && !Array.isArray(props.productos.allIds)) {
            return actuales;
        }

        const agregados = getIdsProductosReemplazo()
        props.productos.allIds.map(id => {
            const existe = agregados.includes(id)
            const producto = props.productos.byId.productos[id]
            if (!existe && producto !== undefined && producto.stock && producto.stock > 0 && producto.compra_directa) {
                actuales.push(producto)
            }
        })
        actuales.sort(function (a, b) {
            let productoA = a.nombre;
            let productoB = b.nombre;
            if (productoA < productoB) { return -1; }
            if (productoA > productoB) { return 1; }
            return 0;
        })
        return actuales
    }

    /**
     * Devuelve los id's de productos elegidos.
     * 
     * @returns {array}
     */
    const getIdsProductosReemplazo = () => {
        if (!reemplazo || !Array.isArray(reemplazo.lineas)) {
            return []
        }

        const ids = reemplazo.lineas.map(l => {
            const producto = l.producto
            if (producto !== undefined && producto.id !== undefined && producto.stock && producto.stock > 0) {
                return producto.id
            }
        })
        return ids
    }

    /**
     * Agrega una línea de reemplazo.
     * 
     * @param {Object} producto 
     * @returns {void}
     */
    const addLineaReemplazo = (producto) => {
        let nuevas = reemplazo.lineas
        if (!Array.isArray(nuevas)) {
            nuevas = []
        }
        let anteriores = reemplazo.lineas
        if (!Array.isArray(anteriores)) {
            anteriores = []
        }
        let linea = anteriores.find(linea => linea.producto.id === producto.id)
        if (linea === undefined) {
            linea = {
                'stock_anterior': producto.stock,
                'stock_nuevo': '',
                'producto': producto
            }
            nuevas.push(linea)
            let nuevo = { 'lineas': nuevas }
            props.createReemplazo(nuevo)
        }
        return;
    }

    /**
     * Quita una línea de reemplazo.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const removeLineaReemplazo = (e) => {
        let actualizado = reemplazo
        const elemento = getIconoConId(e)
        const idQuitar = elemento.dataset.id
        let producto = null
        const restantes = actualizado.lineas.filter(linea => {
            producto = linea.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) !== parseInt(idQuitar)
        })

        actualizado.lineas = restantes
        props.createReemplazo(actualizado)
    }

    let Opciones = []
    const opciones = getOpcionesProductos()
    opciones.forEach(producto => {
        const title = "Agregar " + producto.nombre
        const stock_alerta = producto.stock_seguridad
        Opciones.push(
            <li key={producto.id} title={title} onClick={() => addLineaReemplazo(producto)} className={producto.alertar ? 'table-danger' : ''}>
                {producto.nombre} <span className="text-muted" style={{fontSize: "13px"}}>{ producto.alertar ? `(Min ${stock_alerta})` : ''}</span>
                <span className="badge badge-primary badge-pill float-right" title={`Stock del producto ${producto.nombre}`}>
                    {producto.stock}
                </span>
            </li>)
    })

    /**
     * Devuelve true si el alta de reemplazo es válida. Sino muestra los errores
     * con Sweetalert.
     * 
     * @returns {Boolean}
     */
    const comprobarReemplazoValido = () => {
        let errores = []
        if (!reemplazo || !Array.isArray(reemplazo.lineas) || reemplazo.lineas.length === 0) {
            errores.push("Debe seleccionar al menos un producto.")
            reemplazo.lineas = []
        }

        reemplazo.lineas.map(linea => {
            const producto = linea.producto
            const nombre = producto.nombre
            const stock = producto.stock

            const cantidad_egreso = !isNaN(linea.cantidad_egreso) ? linea.cantidad_egreso : 0
            const cantidad_ingreso = !isNaN(linea.cantidad_ingreso) ? linea.cantidad_ingreso : 0

            const vacias = cantidad_egreso === 0 && cantidad_ingreso === 0

            const diferencia = cantidad_ingreso - cantidad_egreso
            const stock_nuevo = stock + diferencia
            if (stock_nuevo < 0) {
                errores.push("El nuevo stock del producto " + nombre + " debe ser mayor o igual a cero.\n")
            }

            if (!vacias && cantidad_egreso < 0) {
                errores.push("La cantidad de egreso del producto " + nombre + " no puede ser negativa.\n")
            }

            if (!vacias && cantidad_ingreso < 0) {
                errores.push("La cantidad de ingreso del producto " + nombre + " no puede ser negativa.\n")
            }

            if (!vacias && diferencia === 0) {
                errores.push("La diferencia entre la cantidad de ingreso y la cantidad de egreso del producto " + nombre + " no puede ser cero.\n")
            }

            if (vacias) {
                errores.push("Debe ingresar una cantidad de ingreso y egreso para el producto " + nombre + ".\n")
            }
        })

        const valido = errores.length === 0
        if (!valido) {
            const items = errores.reduce((text, error) => text + '<li style="font-size: 14px;">' + error + '</li>', '')
            const html = '<ul style="text-align: left;">' + items + '</ul>'
            Swal.fire({
                title: `No se puede guardar el reemplazo`,
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
     * Guarda un reemplazo nuevo.
     */
    const guardarReemplazo = () => {
        let valido = comprobarReemplazoValido()
        if (valido) {
            props.saveCreateReemplazo()
        }
    }

    /**
     * Cambia la línea de reemplazo por id de producto.
     * 
     * @param {SyntheticBaseEvent} e 
     * @returns {void}
     */
    const onChangeLineaReemplazo = (e) => {
        const elemento = getIconoConId(e)
        const idProducto = elemento.dataset.id
        let actualizada = reemplazo.lineas.find(linea => {
            const producto = linea.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) === parseInt(idProducto)
        })

        if (actualizada === undefined) {
            return
        }

        let cambiado = reemplazo
        const indice = cambiado.lineas.indexOf(actualizada)
        actualizada[e.target.id] = parseFloat(e.target.value)

        const producto = actualizada.producto
        const stock = producto.stock
        const cantidad_egreso = !isNaN(actualizada.cantidad_egreso) ? actualizada.cantidad_egreso : 0
        const cantidad_ingreso = !isNaN(actualizada.cantidad_ingreso) ? actualizada.cantidad_ingreso : 0
        const stock_nuevo = stock + cantidad_ingreso - cantidad_egreso
        actualizada['stock_nuevo'] = !isNaN(stock_nuevo) ? parseFloat(stock_nuevo) : 0
        cambiado.lineas[indice] = actualizada
        props.createReemplazo(cambiado)
    }

    let Filas = []
    if (reemplazo && Array.isArray(reemplazo.lineas)) {
        Filas = reemplazo.lineas.map(linea => {
            const stock_anterior = linea.stock_anterior ? linea.stock_anterior : ''
            const stock_nuevo = linea.stock_nuevo
            const cantidad_egreso = linea.cantidad_egreso
            const cantidad_ingreso = linea.cantidad_ingreso
            const producto = linea.producto
            return (
                <tr key={producto.id}>
                    <td>
                        <button className="boton-icono-quitar" data-id={producto.id} onClick={(e) => removeLineaReemplazo(e)}>
                            <i data-id={producto.id} className="fa fa-times"></i>
                        </button>
                    </td>
                    <td>{producto.nombre}</td>
                    <td>{stock_anterior}</td>
                    <td>
                        <div className="input-group">
                            <input id="cantidad_ingreso" type="number" className="text-right" data-id={producto.id} value={cantidad_ingreso} step="1" onChange={(e) => onChangeLineaReemplazo(e)} />
                            <div className="input-group-append">
                                <span className="input-group-text">u</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="input-group">
                            <input id="cantidad_egreso" type="number" className="text-right" data-id={producto.id} value={cantidad_egreso} step="1" onChange={(e) => onChangeLineaReemplazo(e)} />
                            <div className="input-group-append">
                                <span className="input-group-text">u</span>
                            </div>
                        </div>
                    </td>
                    <td>{stock_nuevo}</td>
                </tr>
            )
        })
    }

    const cantidadLineas = Array.isArray(reemplazo.lineas) ? reemplazo.lineas.length : 0
    let cantidadProductosStock = 0
    props.productos.allIds.map(idProducto => {
        const productoActual = props.productos.byId.productos[idProducto]
        if (productoActual && productoActual.id && productoActual.stock && productoActual.stock > 0) {
            cantidadProductosStock++;
        }
    })
    let placeholder = "No hay productos de compra directa con stock.";
    if (cantidadProductosStock > 0) {
        placeholder = "No quedan más productos de compra directa con stock mayor a cero para agregar."
    }


    return (
        <div className="reemplazo-mercaderia-alta tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.REEMPLAZO_MERCADERIA_LISTAR} titulo={titulo} />
            </div>
            <div className="row reemplazo-mercaderia-contenedor">
                <div className="col-lg-4">
                    <div className="reemplazo-mercaderia-articulos">
                        <h5>
                            Productos
                            <a href="#"
                                onClick={() => history.push(rutas.PRODUCTO_ALTA + "?volverA=" + rutas.REEMPLAZO_MERCADERIA_ALTA)}
                                className="ml-2"
                                data-toggle="tooltip" data-original-title="" title="">
                                <AddBoxIcon style={{ color: '#5cb860' }} />
                            </a>
                        </h5>
                        <ul>{buscando ? <Loader display={true} /> : Opciones}</ul>
                        {Opciones.length === 0 && !buscando ? <p>{placeholder}</p> : <></>}
                    </div>
                </div>
                <div className="col-lg-8 position-relative">
                    <h5>Reemplazos</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="tabla-columna-quitar"></th>
                                <th className="tabla-columna-descripcion">Descripción</th>
                                <th className="tabla-columna-stock-anterior">Stock actual</th>
                                <th className="tabla-columna-stock-anterior">Cantidad ingreso</th>
                                <th className="tabla-columna-stock-anterior">Cantidad egreso</th>
                                <th className="tabla-columna-stock-nuevo">Stock nuevo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Filas.length === 0 ? <tr className="text-center"><td colSpan={6}>Agregue productos a reemplazar</td></tr> : Filas}
                        </tbody>
                    </table>
                    <button className="btn btn-success float-right boton-guardar" onClick={() => guardarReemplazo()}>
                        <div style={{ display: isCreating ? "inline-block" : "none" }} className="spinner spinner-border text-light" role="status">
                            <span className="sr-only"></span>
                        </div>
                        <span className="ml-1">Guardar</span>
                    </button>
                </div>
            </div>
        </div>
    );

}

function mapStateToProps(state) {
    return {
        reemplazos: state.reemplazos,
        productos: state.productos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        createReemplazo: (reemplazo) => {
            dispatch(createReemplazo(reemplazo))
        },
        fetchProductos: (paginar) => {
            dispatch(fetchProductos(paginar))
        },
        saveCreateReemplazo: () => {
            dispatch(saveCreateReemplazo())
        },
        resetCreateReemplazo: () => {
            dispatch(resetCreateReemplazo())
        },
        resetProductos: () => {
            dispatch(resetProductos())
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Alta));
