import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { resetCreateVenta, createVenta, saveCreateVenta } from "../../../../actions/VentaActions"
import { fetchProductos } from "../../../../actions/ProductoActions"

//CSS
import "../../../../assets/css/Gestion/VentaAlmacen.css"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Titulo from "../../../elementos/Titulo"
import Producto from "../../../elementos/Venta/Producto"
import SeleccionProductos from "../../../elementos/Modales/SeleccionProductos"

//Librerías
import AddBoxIcon from "@material-ui/icons/AddBox"
import Swal from 'sweetalert2'

//Utils
import { formatearMoneda } from "../../../../utils/formateador"
import { getIconoConId } from "../../../../utils/utils"

function Alta(props) {

    useEffect(() => {
        props.resetCreateVenta()
        props.fetchProductos(false)

        return function limpiarAlta() {
            props.resetCreateVenta()
        }
    }, [])

    const titulo = "Alta de venta en almacén"
    const venta = props.ventas.create.nueva
    const isCreating = props.ventas.create.isCreating

    const [show, setShow] = useState(false)

    /**
     * Abre el modal de selección de productos.
     */
    const abrirModalProductos = () => {
        setShow(true)
    }

    /**
     * Cierra el modal de selección de productos.
     */
    const onHide = () => {
        setShow(false)
    }

    /**
     * Productos elegidos para realizar la venta en almacén.
     */
    const elegidos = venta.lineas.map(linea => {
        const producto = linea.producto
        if (producto && !isNaN(producto.id)) {
            return producto
        }
    })

    /**
    * Busca un producto por id.
    * 
    * @param {String} idProducto 
    * @returns 
    */
    const buscarProducto = (idProducto) => {
        let producto = null
        props.productos.allIds.map(id => {
            const actual = props.productos.byId.productos[id]
            const idActual = actual && actual.id ? actual.id : 0
            if (idActual !== 0 && parseInt(idProducto) === parseInt(idActual)) {
                producto = actual
            }
        })
        return producto
    }

    /**
     * Agrega una producto como línea de venta con precio y cantidad vacías, luego
     * cierra el modal de selección de productos.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const addLineaVenta = (e) => {
        e.preventDefault()
        const elemento = getIconoConId(e)
        const idProducto = elemento.dataset.id
        const producto = buscarProducto(idProducto)
        let nuevas = venta.lineas
        if (!Array.isArray(nuevas)) {
            nuevas = []
        }
        let anteriores = venta.lineas
        if (!Array.isArray(anteriores)) {
            anteriores = []
        }
        let linea = anteriores.find(linea => linea.producto.id === producto.id)
        if (linea === undefined) {
            linea = {
                'precio': producto.precio_vigente,
                'cantidad': 1,
                'producto': producto
            }
            nuevas.push(linea)
            let nuevo = { 'lineas': nuevas }
            nuevo.total = nuevo.lineas.reduce((total, linea) => {
                const precio = linea.precio ? linea.precio : 0
                const cantidad = linea.cantidad ? linea.cantidad : 0
                return total + precio * cantidad
            }, 0)
            props.createVenta(nuevo)
        }
        setShow(false)
    }

    /**
     * Quita una línea de la venta.
     * 
     *  @param {SyntheticBaseEvent} e 
     */
    const removeLineaVenta = (e) => {
        let actualizado = venta
        const elemento = getIconoConId(e)
        const idQuitar = elemento.dataset.id
        let producto = null
        const restantes = actualizado.lineas.filter(linea => {
            producto = linea.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) !== parseInt(idQuitar)
        })

        actualizado.lineas = restantes
        actualizado.total = actualizado.lineas.reduce((total, linea) => {
            const precio = linea.precio ? linea.precio : 0
            const cantidad = linea.cantidad ? linea.cantidad : 0
            return total + precio * cantidad
        }, 0)
        props.createVenta(actualizado)
    }

    /**
     * Agrega o resta unidades a la cantidad de la línea de la venta.
     * 
     * @param {Object} producto 
     * @param {Integer} cantidad 
     * @returns 
     */
    const agregarCantidad = (producto, cantidad) => {
        const idProducto = producto.id
        let actualizada = venta.lineas.find(linea => {
            const producto = linea.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) === parseInt(idProducto)
        })

        if (actualizada === undefined) {
            return
        }

        let cambiada = venta
        const indice = cambiada.lineas.indexOf(actualizada)
        const nuevaCantidad = parseInt(actualizada.cantidad + cantidad)
        actualizada['cantidad'] = parseFloat(nuevaCantidad)
        cambiada.lineas[indice] = actualizada
        cambiada.total = cambiada.lineas.reduce((total, linea) => {
            const precio = linea.precio ? linea.precio : 0
            const cantidad = linea.cantidad ? linea.cantidad : 0
            return total + precio * cantidad
        }, 0)
        props.createVenta(cambiada)
    }

    /**
     * Cambia la cantidad de la línea de venta en modo escritorio.
     * 
     *  @param {SyntheticBaseEvent} e 
     */
    const onChangeLineaVenta = (e) => {
        const elemento = getIconoConId(e)
        const idProducto = elemento.dataset.id
        let actualizada = venta.lineas.find(linea => {
            const producto = linea.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) === parseInt(idProducto)
        })

        if (actualizada === undefined) {
            return
        }

        let cambiada = venta
        const indice = cambiada.lineas.indexOf(actualizada)
        actualizada[e.target.id] = parseFloat(e.target.value)
        cambiada.lineas[indice] = actualizada
        cambiada.total = cambiada.lineas.reduce((total, linea) => {
            const precio = linea.precio ? linea.precio : 0
            const cantidad = linea.cantidad ? linea.cantidad : 0
            return total + precio * cantidad
        }, 0)
        props.createVenta(cambiada)
    }

    /**
     * Devuelve la tabla para el alta en versión de escritorio.
     * 
     * @returns Element
     */
    const getTablaEscritorio = () => {
        let FilasHTML = []
        if (venta && Array.isArray(venta.lineas)) {
            FilasHTML = venta.lineas.map(linea => {
                const precio = linea.precio ? linea.precio : ''
                const producto = linea.producto
                const cantidad = linea.cantidad ? linea.cantidad : ''
                const subtotal = cantidad !== precio !== '' ? precio * cantidad : 0.00
                return (
                    <tr key={producto.id}>
                        <td>
                            <button className="boton-icono-quitar" data-id={producto.id} onClick={(e) => removeLineaVenta(e)}>
                                <i data-id={producto.id} className="fa fa-times"></i>
                            </button>
                        </td>
                        <td>{producto.nombre}</td>
                        <td>
                            <div className="input-group">
                                <input id="cantidad" type="number" className="text-right" data-id={producto.id} value={cantidad ? cantidad : ""} step="1" onChange={(e) => onChangeLineaVenta(e)} />
                                <div className="input-group-append">
                                    <span className="input-group-text">u</span>
                                </div>
                            </div>
                        </td>
                        <td>{formatearMoneda(producto.precio_vigente)}</td>
                        <td className="text-right">{formatearMoneda(subtotal)}</td>
                    </tr>
                )
            })
        }
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {FilasHTML.length === 0 ? <tr className="text-center"><td colSpan={5}>Agregue productos a vender</td></tr> : FilasHTML}
                    <tr>
                        <td colSpan={5} className="text-right text-success font-weight-bold">
                            <div onClick={() => abrirModalProductos()} className="d-flex justify-content-end align-items-center">
                                <AddBoxIcon style={{ color: '#5cb860' }} />
                                <button type="button" className="boton-modal bg-transparent text-success" data-target=".bs-example-modal-lg">Agregar producto</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="font-weight-bold">
                        <td colSpan={3}>Total</td>
                        <td colSpan={2} className="text-right">{formatearMoneda(venta.total)}</td>
                    </tr>
                </tfoot>
            </table>
        )
    }

    /**
     * Devuelve el alta para el diseño responsive.
     * 
     * @returns Element
     */
    const getTablaResponsive = () => {
        let FilasHTMLResponsive = []
        if (venta && Array.isArray(venta.lineas)) {
            FilasHTMLResponsive = venta.lineas.map(linea => {
                const precio = linea.precio ? linea.precio : ''
                const producto = linea.producto
                const cantidad = linea.cantidad ? linea.cantidad : ''
                const subtotal = cantidad !== precio !== '' ? precio * cantidad : 0.00
                return (
                    <Producto
                        data-id={producto.id}
                        key={producto.id}
                        producto={producto}
                        guardando={isCreating}
                        cantidad={cantidad}
                        subtotal={subtotal}
                        agregarCantidad={(a, b) => agregarCantidad(a, b)}
                        quitarProducto={(e) => removeLineaVenta(e)}
                    />
                )
            })
        }
        return (
            <div>
                {FilasHTMLResponsive.length > 0 ? '' : <span>Agregue productos a vender</span>}
                <div className="venta-productos">
                    {FilasHTMLResponsive}
                </div>
                <div className="mt-2 venta-footer">
                    <button onClick={() => abrirModalProductos()} type="button" className="boton-modal boton-modal-responsive text-success" data-target=".bs-example-modal-lg">
                        <AddBoxIcon style={{ color: '#5cb860' }} />
                        Producto
                    </button>
                    <div style={{ display: venta.total > 0 ? "block" : "none" }} className="venta-footer-total">
                        <b>Total:</b> {formatearMoneda(venta.total)}
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Comprueba que la venta tenga los datos válidos para ser guardada.
     * 
     * @returns Boolean
     */
    const comprobarValidez = () => {
        let errores = []
        let actual = venta
        if (!actual || !Array.isArray(actual.lineas) || actual.lineas.length === 0) {
            errores.push("Debe seleccionar al menos un producto.")
            actual.lineas = []
        }

        actual.lineas.map(linea => {
            const cantidad = linea.cantidad !== "" ? linea.cantidad : 0
            const producto = linea.producto
            const nombre = producto.nombre
            if (isNaN(cantidad) || parseFloat(cantidad) <= 0.00) {
                errores.push("La cantidad de producto '" + nombre + "' debe ser mayor a cero.\n")
            }
        })

        const valido = errores.length === 0
        if (!valido) {
            const items = errores.reduce((text, error) => text + '<li style="font-size: 14px;">' + error + '</li>', '')
            const html = '<ul style="text-align: left;">' + items + '</ul>'
            Swal.fire({
                title: `No se ha podido guardar la venta`,
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
     * Guarda la venta en almacén.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const guardarVenta = (e) => {
        let valido = comprobarValidez()
        if (valido) {
            props.saveCreateVenta()
        }
    }

    const AltaEscritorio = getTablaEscritorio()
    const AltaResponsive = getTablaResponsive()
    return (
        <div className="venta-almacen fondo-gris">
            <Titulo ruta={rutas.VENTA_ALMACEN_LISTADO} titulo={titulo} />
            <SeleccionProductos
                show={show}
                onHide={() => onHide()}
                ventaDirecta={true}
                addProducto={(e) => addLineaVenta(e)}
                elegidos={elegidos}
            />
            <div className="venta-alta-escritorio">
                {AltaEscritorio}
            </div>
            <div className="venta-alta-responsive">
                {AltaResponsive}
            </div>
            <button className="btn btn-success float-right boton-guardar mt-2" onClick={() => guardarVenta()}>
                <div style={{ display: isCreating ? "inline-block" : "none" }} className="spinner spinner-border text-light" role="status">
                    <span className="sr-only"></span>
                </div>
                <span className="ml-1">Guardar</span>
            </button>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        ventas: state.ventas,
        productos: state.productos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProductos: (paginar) => {
            dispatch(fetchProductos(paginar))
        },
        resetCreateVenta: () => {
            dispatch(resetCreateVenta())
        },
        createVenta: (venta) => {
            dispatch(createVenta(venta))
        },
        saveCreateVenta: () => {
            dispatch(saveCreateVenta())
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Alta))