import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchProductosIfNeeded } from "../../../../actions/ProductoActions"
import { createIngreso, saveCreateIngreso } from "../../../../actions/IngresoActions"

//CSS
import "../../../../assets/css/Gestion/Ingreso.css"

//Constants
import * as rutas from "../../../../constants/rutas"

//Componentes
import Titulo from "../../../elementos/Titulo"

//Librerías
import Swal from 'sweetalert2'

//Utils
import { formatearMoneda } from "../../../../utils/formateador"

function Ingreso(props) {
    const titulo = "Ingreso"
    const ingreso = props.ingresos.create.nuevo

    useEffect(() => {
        fetchProductosIfNeeded()
    }, [props.productos.allIds])

    const addLineaIngreso = (producto) => {
        let nuevas = ingreso.lineas
        let linea = ingreso.lineas.find(linea => linea.producto.id === producto.id)
        if (linea === undefined) {
            linea = {
                'precio': '',
                'cantidad': '',
                'producto': producto
            }
            nuevas.push(linea)
            let nuevo = { 'lineas': nuevas }
            props.createIngreso(nuevo)
        }
    }

    const removeLineaIngreso = (e) => {
        let actualizado = ingreso
        const idQuitar = e.target.dataset.id
        let producto = null
        const restantes = actualizado.lineas.filter(linea => {
            producto = linea.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) !== parseInt(idQuitar)
        })

        actualizado.lineas = restantes
        props.createIngreso(actualizado)
    }

    const getOpcionesProductos = () => {
        let actuales = []
        const agregados = getIdsProductosIngreso()
        props.productos.allIds.map(id => {
            const existe = agregados.includes(id)
            const producto = props.productos.byId.productos[id]
            if (!existe && producto !== undefined) {
                actuales.push(producto)
            }
        })
        return actuales
    }

    const getIdsProductosIngreso = () => {
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
        Opciones.push(<li key={producto.id} title={title} onClick={() => addLineaIngreso(producto)}>{producto.nombre}</li>)
    })

    const onChangeLineaIngreso = (e) => {
        const idProducto = e.target.dataset.id
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
            const precio = linea.precio ? linea.precio : 0
            const cantidad = linea.cantidad ? linea.cantidad : 0
            return total + precio * cantidad
        }, 0)
        props.createIngreso(cambiado)
    }

    const comprobarIngresoValido = () => {
        let errores = []
        ingreso.lineas.map(linea => {
            const cantidad = linea.cantidad !== "" ? linea.cantidad : 0 
            const producto = linea.producto
            const nombre = producto.nombre
            if (isNaN(cantidad) || parseFloat(cantidad) <= 0.00) {
                errores.push("La cantidad de producto " + nombre + " debe ser mayor a cero.\n")
            }

            const precio = linea.precio ? linea.precio : 0
            if (isNaN(precio) || parseFloat(precio) <= 0.00) {
                errores.push("El precio de producto " + nombre + " debe ser mayor a cero.\n")
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

    const crearIngreso = () => {
        let valido = comprobarIngresoValido()
        if (valido) {
            props.saveCreateIngreso()
        }
    }

    const Filas = ingreso.lineas.map(linea => {
        const producto = linea.producto
        const cantidad = linea.cantidad ? linea.cantidad : ''
        const precio = linea.precio ? linea.precio : ''
        const subtotal = cantidad !== precio !== '' ? precio * cantidad : 0.00
        return(
            <tr key={producto.id}>
                <td>
                    <button className="boton-icono-quitar" data-id={producto.id} onClick={(e) => removeLineaIngreso(e)}>
                        <i data-id={producto.id} className="fa fa-times"></i>
                    </button>
                </td>
                <td>{producto.nombre}</td>
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
                        <input id="precio" type="number" className="text-right" data-id={producto.id} value={precio ? precio : ""} step="0.01" onChange={(e) => onChangeLineaIngreso(e)} />
                    </div>
                </td>
                <td className="text-right">{formatearMoneda(subtotal)}</td>
            </tr>
        )
    })

    const Total = <tr>
        <td colSpan={4}>Total</td>
        <td className="text-right">{formatearMoneda(ingreso.total)}</td>
    </tr>

    const isCreating = props.ingresos.create.isCreating

    return (
        <div className="ingreso-mercaderia tarjeta-body">
            <Titulo ruta={rutas.GESTION} titulo={titulo} />
            <div className="row ingreso-mercaderia-contenedor">
                <div className="col-lg-4">
                    <div className="ingreso-mercaderia-articulos">
                        <h5>Productos</h5>
                        <ul>{Opciones}</ul>
                    </div>
                </div>
                <div className="col-lg-8 position-relative">
                    <h5>Resumen</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th className="text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Filas.length === 0 ? <tr className="text-center"><td colspan={5}>Agregue productos a ingresar</td></tr> : Filas}
                        </tbody>
                        <tfoot>
                            {Filas.length === 0 ? '' : Total}
                        </tfoot>
                    </table>
                    <button onClick={() => crearIngreso()}className="btn btn-success float-right boton-guardar">
                        {isCreating ? <i class="fa fa-spinner fa-spin fa-fw" aria-hidden="true"></i> : ''}
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
        fetchProductosIfNeeded: () => {
            dispatch(fetchProductosIfNeeded())
        },
        createIngreso: (ingreso) => {
            dispatch(createIngreso(ingreso))
        },
        saveCreateIngreso: () => {
            dispatch(saveCreateIngreso())
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Ingreso))