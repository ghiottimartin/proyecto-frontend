import React, { useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchProductos, resetProductos } from "../../../../actions/ProductoActions"
import { createIngreso, saveCreateIngreso, resetCreateIngreso } from "../../../../actions/IngresoActions"

//CSS
import "../../../../assets/css/Gestion/Ingreso.css"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Loader from "../../../elementos/Loader"
import Titulo from "../../../elementos/Titulo"

//Librerías
import Swal from 'sweetalert2'
import AddBoxIcon from "@material-ui/icons/AddBox"
import history from "../../../../history"

//Utils
import { formatearMoneda } from "../../../../utils/formateador"
import { getIconoConId } from "../../../../utils/utils"

function Alta(props) {
    const titulo = "Alta de ingreso"
    const ingreso = props.ingresos.create.nuevo
    const buscando = props.productos.byId.isFetching

    useEffect(() => {
        props.fetchProductos(false)
        return function limpiarAlta() {
            props.resetCreateIngreso()
            props.resetProductos()
        }
    }, [])

    /**
     * Agrega una línea de ingreso.
     * 
     * @param {Object} producto 
     * @returns {void}
     */
    const addLineaIngreso = (producto) => {
        let nuevas = ingreso.lineas
        if (!Array.isArray(nuevas)) {
            nuevas = []
        }
        let anteriores = ingreso.lineas
        if (!Array.isArray(anteriores)) {
            anteriores = []
        }
        let linea = anteriores.find(linea => linea.producto.id === producto.id)
        if (linea === undefined) {
            linea = {
                'costo': producto.costo_vigente,
                'cantidad': '',
                'producto': producto
            }
            nuevas.push(linea)
            let nuevo = { 'lineas': nuevas }
            props.createIngreso(nuevo)
        }
        return;
    }

    /**
     * Quita una línea de ingreso.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const removeLineaIngreso = (e) => {
        let actualizado = ingreso
        const elemento = getIconoConId(e)
        const idQuitar = elemento.dataset.id
        let producto = null
        const restantes = actualizado.lineas.filter(linea => {
            producto = linea.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) !== parseInt(idQuitar)
        })

        actualizado.lineas = restantes
        props.createIngreso(actualizado)
    }

    /**
     * Devuelve las opciones elegibles de productos.
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

        const agregados = getIdsProductosIngreso()
        props.productos.allIds.map(id => {
            const existe = agregados.includes(id)
            const producto = props.productos.byId.productos[id]
            if (!existe && producto !== undefined && producto.compra_directa) {
                actuales.push(producto)
            }
        })
        actuales.sort(function (a, b) {
            let stockA = a.stock;
            let stockB = b.stock;
            return stockA - stockB;
        })
        return actuales
    }

    /**
     * Devuelve los id's de productos elegidos.
     * 
     * @returns {array}
     */
    const getIdsProductosIngreso = () => {
        if (!ingreso || !Array.isArray(ingreso.lineas)) {
            return []
        }

        const ids = ingreso.lineas.map(l => {
            const producto = l.producto
            if (producto !== undefined && producto.id !== undefined) {
                return producto.id
            }
        })
        return ids
    }

    let Opciones = []
    const opciones = getOpcionesProductos()
    opciones.forEach(producto => {
        const title = "Agregar " + producto.nombre
        const stock_alerta = producto.stock_seguridad
        Opciones.push(
            <li key={producto.id} title={title} onClick={() => addLineaIngreso(producto)} className={producto.alertar ? 'table-danger' : ''}>
                {producto.nombre} <span className="text-muted" style={{fontSize: "13px"}}>{ producto.alertar ? `(Min ${stock_alerta})` : ''}</span>
                <span className="badge badge-primary badge-pill float-right" title={`Stock del producto ${producto.nombre}`}>
                    {producto.stock}
                </span>
            </li>)
    })

    /**
     * Cambia la línea de ingreso por id de producto.
     * 
     * @param {SyntheticBaseEvent} e 
     * @returns {void}
     */
    const onChangeLineaIngreso = (e) => {
        const elemento = getIconoConId(e)
        const idProducto = elemento.dataset.id
        let actualizada = ingreso.lineas.find(linea => {
            const producto = linea.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) === parseInt(idProducto)
        })

        if (actualizada === undefined) {
            return
        }

        let cambiado = ingreso
        const indice = cambiado.lineas.indexOf(actualizada)
        actualizada[e.target.id] = parseFloat(e.target.value)
        cambiado.lineas[indice] = actualizada
        cambiado.total = cambiado.lineas.reduce((total, linea) => {
            const costo = linea.costo ? linea.costo : 0
            const cantidad = linea.cantidad ? linea.cantidad : 0
            return total + costo * cantidad
        }, 0)
        props.createIngreso(cambiado)
    }

    /**
     * Devuelve true si el alta de ingreso es válida. Sino muestra los errores
     * con Sweetalert.
     * 
     * @returns {Boolean}
     */
    const comprobarIngresoValido = () => {
        let errores = []
        if (!ingreso || !Array.isArray(ingreso.lineas) || ingreso.lineas.length === 0) {
            errores.push("Debe seleccionar al menos un producto.")
            ingreso.lineas = []
        }

        ingreso.lineas.map(linea => {
            const cantidad = linea.cantidad !== "" ? linea.cantidad : 0
            const producto = linea.producto
            const nombre = producto.nombre
            if (isNaN(cantidad) || parseFloat(cantidad) <= 0.00) {
                errores.push("La cantidad de producto " + nombre + " debe ser mayor a cero.\n")
            }

            const costo = linea.costo ? linea.costo : 0
            if (isNaN(costo) || parseFloat(costo) <= 0.00) {
                errores.push("El costo de producto " + nombre + " debe ser mayor a cero.\n")
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
     * Guarda un ingreso nuevo.
     */
    const guardarIngreso = () => {
        let valido = comprobarIngresoValido()
        if (valido) {
            props.saveCreateIngreso()
        }
    }

    let Filas = []
    if (ingreso && Array.isArray(ingreso.lineas)) {
        Filas = ingreso.lineas.map(linea => {
            const costo = linea.costo ? linea.costo : ''
            const producto = linea.producto
            const cantidad = linea.cantidad ? linea.cantidad : ''
            const subtotal = cantidad !== costo !== '' ? costo * cantidad : 0.00
            const stock = producto.stock
            const stock_seguridad = producto.stock_seguridad
            return (
                <tr key={producto.id}>
                    <td>
                        <button className="boton-icono-quitar" data-id={producto.id} onClick={(e) => removeLineaIngreso(e)}>
                            <i data-id={producto.id} className="fa fa-times"></i>
                        </button>
                    </td>
                    <td>{producto.nombre}</td>
                    <td>{producto.stock} <br/><span className="text-muted" style={{fontSize: "13px"}}>{`(Min ${producto.stock_seguridad})`}</span></td>
                    <td>
                        <div className="input-group">
                            <input id="cantidad" type="number" className="text-right" data-id={producto.id} value={cantidad ? cantidad : ""} step="1" onChange={(e) => onChangeLineaIngreso(e)} />
                            <div className="input-group-append">
                                <span className="input-group-text">u</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">$</span>
                            </div>
                            <input id="costo" type="number" className="text-right" data-id={producto.id} value={costo ? costo : ""} step="0.01" onChange={(e) => onChangeLineaIngreso(e)} />
                        </div>
                    </td>
                    <td className="text-right">{formatearMoneda(subtotal)}</td>
                </tr>
            )
        })
    }

    const Total = <tr>
        <td colSpan={5}>Total</td>
        <td className="text-right">{formatearMoneda(ingreso.total)}</td>
    </tr>

    const isCreating = props.ingresos.create.isCreating

    let cantidadProductosCompraDirecta = 0
    props.productos.allIds.map(idProducto => {
        const productoActual = props.productos.byId.productos[idProducto]
        if (productoActual && productoActual.id && productoActual.compra_directa) {
            cantidadProductosCompraDirecta++;
        }
    })
    let placeholder = "No hay productos de compra directa cargados.";
    if (cantidadProductosCompraDirecta > 0) {
        placeholder = "No quedan más productos de compra directa para agregar."
    }

    return (
        <div className="ingreso-mercaderia tarjeta-body">
            <Titulo ruta={rutas.INGRESO_MERCADERIA} titulo={titulo} />
            <div className="row ingreso-mercaderia-contenedor">
                <div className="col-lg-4">
                    <div className="lista-seleccionable">
                        <h5>
                            Productos
                            <a href="#"
                                onClick={() => history.push(rutas.PRODUCTO_ALTA + "?volverA=" + rutas.INGRESO_MERCADERIA_ALTA)}
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
                    <h5>Resumen</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="tabla-columna-quitar"></th>
                                <th className="tabla-columna-descripcion">Descripción</th>
                                <th className="tabla-columna-cantidad">Stock</th>
                                <th className="tabla-columna-cantidad">Cantidad</th>
                                <th className="tabla-columna-costo">Costo</th>
                                <th className="tabla-columna-subtotal text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Filas.length === 0 ? <tr className="text-center"><td colSpan={6}>Agregue productos a ingresar</td></tr> : Filas}
                        </tbody>
                        <tfoot>
                            {Filas.length === 0 ? '' : Total}
                        </tfoot>
                    </table>
                    <button className="btn btn-success float-right boton-guardar" onClick={() => guardarIngreso()}>
                        <div style={{ display: isCreating ? "inline-block" : "none" }} className="spinner spinner-border text-light" role="status">
                            <span className="sr-only"></span>
                        </div>
                        <span className="ml-1">Guardar</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        productos: state.productos,
        ingresos: state.ingresos
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProductos: (paginar) => {
            dispatch(fetchProductos(paginar))
        },
        createIngreso: (ingreso) => {
            dispatch(createIngreso(ingreso))
        },
        saveCreateIngreso: () => {
            dispatch(saveCreateIngreso())
        },
        resetCreateIngreso: () => {
            dispatch(resetCreateIngreso())
        },
        resetProductos: () => {
            dispatch(resetProductos())
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Alta))