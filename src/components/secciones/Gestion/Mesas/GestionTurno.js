import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchMesaById } from "../../../../actions/MesaActions"
import { fetchMozos, resetMozos } from "../../../../actions/UsuarioActions"
import { updateTurno, resetUpdateTurno, saveUpdateTurno, anularTurno, cerrarTurno, comanda } from "../../../../actions/TurnoActions"
import { fetchProductos } from "../../../../actions/ProductoActions"

//CSS
import "../../../../assets/css/Gestion/Mesas.css"

//Constants
import * as rutas from "../../../../constants/rutas"
import * as colores from "../../../../constants/colores"

//Components
import Titulo from "../../../elementos/Titulo"
import Loader from "../../../elementos/Loader"
import Producto from "../../../elementos/Venta/Producto"
import SeleccionProductos from "../../../elementos/Modales/SeleccionProductos"

//Librerías
import AddBoxIcon from "@material-ui/icons/AddBox"
import Form from "react-bootstrap/Form";
import Swal from 'sweetalert2'
import history from "../../../../history"

//Utils
import { formatearMoneda } from "../../../../utils/formateador"
import { getIconoConId } from "../../../../utils/utils"

function GestionTurno(props) {
    const idMesa = props.match.params['id']
    const buscando = props.mesas.byId.isFetching
    const isUpdating = props.turnos.update.isUpdating
    const isDownloading = props.turnos.update.isDownloading
    const loader = buscando || isUpdating || isDownloading

    const turno = props.turnos.update.activo
    const mesa = turno.mesa
    const mesaNombre = mesa && mesa.id ? mesa.numero_texto : '...'
    let titulo = `Gestión del Turno de la Mesa ${mesaNombre}`

    useEffect(() => {
        if (!isNaN(idMesa)) {
            props.fetchMesaById(idMesa)
        }
        props.fetchMozos()
        props.fetchProductos(false)
        return function limpiar() {
            props.resetMozos()
        }
    }, [])

    const [showProductos, setShowProductos] = useState(false)

    /**
     * Abre el modal de selección de productos.
     */
    const abrirModalProductos = () => {
        setShowProductos(true)
    }

    /**
     * Cierra el modal de selección de productos.
     */
    const onHide = () => {
        setShowProductos(false)
    }

    /**
     * Productos elegidos para el turno.
     */
    const elegidos = turno.ordenes.map(orden => {
        const producto = orden.producto
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
     * Agrega un producto como órden del turno con precio y una unidad, luego
     * cierra el modal de selección de productos.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const addProductoOrden = (e) => {
        e.preventDefault()
        const elemento = getIconoConId(e)
        let idProducto = elemento.dataset.id
        const producto = buscarProducto(idProducto)
        let nuevas = turno.ordenes
        if (!Array.isArray(nuevas)) {
            nuevas = []
        }
        let anteriores = turno.ordenes
        if (!Array.isArray(anteriores)) {
            anteriores = []
        }
        let orden = anteriores.find(orden => orden.producto.id === producto.id)
        if (orden === undefined) {
            orden = {
                'cantidad': 1,
                'cantidad_anterior': 0,
                'producto': producto
            }
            nuevas.push(orden)
            let nuevo = { 'ordenes': nuevas }
            nuevo.total = nuevo.ordenes.reduce((total, orden) => {
                const producto = orden.producto && orden.producto.id ? orden.producto : {}
                const precio = producto && producto.precio_vigente ? producto.precio_vigente : 0
                const cantidad = orden.cantidad ? orden.cantidad : 0
                return total + precio * cantidad
            }, 0)
            props.updateTurno(nuevo, mesa)
        }
        setShowProductos(false)
    }

    /**
     * Actualiza el turno modificando la cantidad de una orden determinada.
     * 
     * @param {Object} producto 
     * @param {Integer} cantidad 
     * @returns 
     */
    const actualizarOrden = (producto, cantidad) => {
        const idProducto = producto.id
        let actualizado = turno.ordenes.find(orden => {
            const producto = orden.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) === parseInt(idProducto)
        })

        if (actualizado === undefined) {
            return
        }

        
        let cambiado = turno
        const stock = producto.stock
        const indice = cambiado.ordenes.indexOf(actualizado)
        const nueva_cantidad = parseInt(actualizado.cantidad + cantidad)

        const cantidad_anterior = actualizado.cantidad_anterior
        const stock_restante = stock + cantidad_anterior - nueva_cantidad
        if (stock_restante < 0) {
            const verbo = stock > 1 ? "quedan" : "queda"
            const items = stock > 1 ? "items" : "item"
            let texto_explicativo = `Había solicitado ${cantidad_anterior}, puede pedir hasta ${nueva_cantidad - 1} ya que `
            texto_explicativo += `${verbo} ${stock} ${items} de '${producto.nombre}'`
            Swal.fire({
                title: `No hay suficiente stock`,
                text: texto_explicativo,
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            })
            return
        } 
        actualizado['cantidad'] = parseFloat(nueva_cantidad)
        cambiado.ordenes[indice] = actualizado
        cambiado.total = cambiado.ordenes.reduce((total, orden) => {
            const producto = orden.producto && orden.producto.id ? orden.producto : {}
            const precio = producto && producto.precio_vigente ? producto.precio_vigente : 0
            const cantidad = orden.cantidad ? orden.cantidad : 0
            return total + precio * cantidad
        }, 0)
        props.updateTurno(turno, mesa)
    }

    /**
     * Quita una orden del turno.
     * 
     *  @param {SyntheticBaseEvent} e 
     */
    const removeOrden = (e) => {
        e.preventDefault()
        const elemento = getIconoConId(e)
        let idProducto = elemento.dataset.id
        let producto = buscarProducto(idProducto)
        if (!producto || isNaN(producto.id)) {
            return
        }

        let actualizado = turno
        const idQuitar = producto.id
        const restantes = actualizado.ordenes.filter(orden => {
            producto = orden.producto
            const idBuscar = producto.id ? producto.id : 0
            return parseInt(idBuscar) !== parseInt(idQuitar)
        })

        actualizado.ordenes = restantes
        actualizado.total = actualizado.ordenes.reduce((total, orden) => {
            const producto = orden.producto && orden.producto.id ? orden.producto : {}
            const precio = producto && producto.precio_vigente ? producto.precio_vigente : 0
            const cantidad = orden.cantidad ? orden.cantidad : 0
            return total + precio * cantidad
        }, 0)
        props.updateTurno(actualizado, mesa)
    }

    /**
     * Cambia el mozo del turno actual.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const onChangeMozo = (e) => {
        var cambio = {}
        const idMozo = e.target.value
        const mozo = props.mozos.byId.mozos[idMozo]
        cambio[e.target.id] = mozo
        props.updateTurno(cambio, mesa)
    }

    /**
     * Comprueba que el turno actual tenga los datos suficientes para ser guardado.
     * 
     * @param {Boolean} mostrar
     */
    const comprobarTurnoValido = (mostrar) => {
        const mozo = turno.mozo
        let errores = []
        if (isNaN(mozo.id)) {
            errores.push("Debe seleccionar un mozo para guardar el turno.")
        }

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
    const guardarBorrador = () => {
        let valido = comprobarTurnoValido()
        if (valido) {
            props.saveUpdateTurno()
        }
    }

    /**
     * Imprime los productos a preparar para ser entregados en un pdf.
     */
    const comanda = () => {
        const restante = turno.ordenes.reduce((suma, orden) => {
            const cantidad = orden.cantidad ? orden.cantidad : 0
            const entregado = orden.entregado ? orden.entregado : 0
            const resta = cantidad - entregado
            return suma + resta
        }, 0)
        if (restante === 0) {
            Swal.fire({
                title: `No se puede exportar la comanda`,
                text: 'Los productos ya fueron entregados en su totalidad.',
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            })
        } else {
            props.comanda(idMesa)
        }
    }

    /**
     * Dedirige a la interfaz de entrega de órdenes del turno.
     */
    const entregar = () => {
        history.push(rutas.TURNOS_ORDENES + idMesa)
    }

    /**
     * Devuelve true si todos los productos fueron entregados, sino
     * muestra cartel de alerta.
     */
    const comprobarPuedeCerrar = () => {
        const restante = turno.ordenes.reduce((suma, orden) => {
            const cantidad = orden.cantidad ? orden.cantidad : 0
            const entregado = orden.entregado ? orden.entregado : 0
            const resta = cantidad - entregado
            return suma + resta
        }, 0)
        if (restante > 0) {
            Swal.fire({
                title: `Productos no entregados`,
                text: 'Para cerrar el turno todos los productos deben estar entregados',
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            })
            return false
        }
        return true
    }

    /**
     * Cierra el turno actual, dejando el turno como cancelado y
     * la mesa disponible.
     */
    const cerrar = () => {
        let puede = comprobarPuedeCerrar()
        if (!puede) {
            return;
        }
        Swal.fire({
            title: `¿Está seguro de cerrar el turno? `,
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Cerrar',
            cancelButtonText: 'Continuar',
            confirmButtonColor: colores.COLOR_INFO,
            cancelButtonColor: '#bfbfbf',
        }).then((result) => {
            if (result.isConfirmed) {
                props.cerrarTurno(turno)
            }
        });
    }

    /**
     * Cierra el turno actual, dejando el turno como cerrado, la mesa disponible 
     * y creando una venta tipo mesa.
     */
    const anular = () => {
        Swal.fire({
            title: `¿Está seguro de anular el turno? `,
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Anular',
            cancelButtonText: 'Continuar',
            confirmButtonColor: colores.COLOR_ROJO,
            cancelButtonColor: '#bfbfbf',
        }).then((result) => {
            if (result.isConfirmed) {
                props.anularTurno(turno.id)
            }
        });
    }

    let Ordenes = []
    if (turno && Array.isArray(turno.ordenes)) {
        Ordenes = turno.ordenes.map(orden => {
            const producto = orden.producto
            const precio = producto && producto.id && producto.precio_vigente ? producto.precio_vigente : ''
            const cantidad = orden.cantidad ? orden.cantidad : ''
            const subtotal = cantidad !== precio !== '' ? precio * cantidad : 0.00
            const clave = orden.id ? orden.id : producto.id

            const stock = producto.stock
            const stock_restante = stock + orden.cantidad_anterior - cantidad
            return (
                <Producto
                    key={clave}
                    producto={producto}
                    guardando={loader}
                    cantidad={cantidad}
                    subtotal={subtotal}
                    stock={stock_restante}
                    mostrarStock={true}
                    entregas={orden.entregado}
                    agregarCantidad={(producto, cantidad) => actualizarOrden(producto, cantidad)}
                    quitarProducto={(e) => removeOrden(e)}
                />
            )
        })
    }

    let OpcionesMozos = []
    OpcionesMozos.push(<option key={0} value={0}>Debe seleccionar un mozo.</option>)
    props.mozos.allIds.map(idMozo => {
        const mozo = props.mozos.byId.mozos[idMozo]
        let opcion = {}
        opcion[idMozo] = mozo.first_name
        OpcionesMozos.push(<option key={mozo.id} value={mozo.id}>{mozo.first_name}</option>)
    })

    return (
        <div className="mesa-turno row justify-content-md-center">
            <div className="col-md-12">
                <section className="seccion-turno tarjeta-body h-100">
                    <Titulo ruta={rutas.MESAS_LISTAR} titulo={titulo} />
                    <SeleccionProductos
                        show={showProductos}
                        onHide={() => onHide()}
                        ventaDirecta={true}
                        addProducto={(e) => addProductoOrden(e)}
                        elegidos={elegidos}
                    />
                    <Form.Group>
                        <Form.Label>Mozo:</Form.Label>
                        <Form.Control
                            id="mozo"
                            as="select"
                            onChange={(e) => onChangeMozo(e)}
                            value={turno && turno.mozo && turno.mozo.id ? turno.mozo.id : ""}
                        >
                            {OpcionesMozos}
                        </Form.Control>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span>Productos</span>
                            <a href="#"
                                className="ml-2"
                                onClick={() => abrirModalProductos()}
                                data-toggle="tooltip" data-original-title="" title="">
                                <AddBoxIcon style={{ color: '#5cb860' }} />
                            </a>
                        </div>
                        <button onClick={() => entregar()} className="btn btn-transparent text-primary font-weight-bold float-right boton-guardar" >
                            <span className="ml-1">Entregar</span>
                            <i className="fas fa-concierge-bell ml-2"></i>
                        </button>
                    </div>
                    <Loader display={loader} />
                    <div className="contenedor-ordenes" style={{ display: loader ? "none" : "block" }}>
                        <div className="venta-productos">
                            {Ordenes}
                        </div>
                    </div>
                    <div className="mt-2 venta-footer">
                        <div style={{ display: turno.total > 0 ? "block" : "none" }} className="venta-footer-total my-2">
                            <b>Total:</b> {formatearMoneda(turno.total)}
                        </div>
                    </div>
                    <div className="contenedor-botones" style={{ display: loader ? "none" : "grid" }}>
                        <button onClick={() => guardarBorrador()} className="btn btn-success float-right boton-guardar mt-2 boton-guardar" title="Guarda el turno y permite continuar despúes">
                            <span className="ml-1">Guardar</span>
                        </button>
                        <button onClick={() => comanda()} className="btn btn-primary float-right boton-guardar mt-2 boton-comanda" title="Descarga de pdf de productos no entregados">
                            <span className="ml-1">Comanda</span>
                        </button>
                        <button onClick={() => cerrar()} className="btn btn-info float-right boton-guardar mt-2 boton-cerrar" title="Cierra el turno generando la venta del mismo">
                            <span className="ml-1">Cerrar</span>
                        </button>
                        <button onClick={() => anular()} className="btn btn-danger float-right mt-2 boton-anular" title="Anula el turno, volviendo atrás el stock solicitado">
                            <span className="ml-1">Anular</span>
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
        fetchMozos: () => {
            dispatch(fetchMozos())
        },
        updateTurno: (turno, mesa) => {
            dispatch(updateTurno(turno, mesa))
        },
        saveUpdateTurno: () => {
            dispatch(saveUpdateTurno())
        },
        fetchMesaById: (id) => {
            dispatch(fetchMesaById(id))
        },
        resetMozos: () => {
            dispatch(resetMozos())
        },
        fetchProductos: (paginar) => {
            dispatch(fetchProductos(paginar))
        },
        anularTurno: (id) => {
            dispatch(anularTurno(id))
        },
        cerrarTurno: (turno) => {
            dispatch(cerrarTurno(turno))
        },
        comanda: (id) => {
            dispatch(comanda(id))
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GestionTurno))