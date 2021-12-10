import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import history from "../../history"

//Api
import auth from "../../api/authentication"

//Actions
import { createPedido, saveCreatePedido, fetchPedidoById } from "../../actions/PedidoActions"

//Constants
import c from "../../constants/constants"
import * as rutas from "../../constants/rutas"

//Components
import Loader from "./Loader"

//CSS
import "../../assets/css/Producto.css"

//Images
import productoVacio from "../../assets/img/emptyImg.jpg"

//Librerias
import Swal from 'sweetalert2'
import isEmpty from "lodash/isEmpty"
import Button from '@material-ui/core/Button'
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"

function Producto(props) {
    const producto = props.producto
    const abierto = props.pedidos.byId.abierto
    const creando = props.pedidos.create.isCreating

    let path = productoVacio
    if (producto.imagen) {
        try {
            path = c.BASE_PUBLIC + producto.imagen
        } catch (e) {
        }
    }
    
    const getCantidad = () => {
        if (isEmpty(producto)) {
            return 0
        }
        let cantidad = 0
        if (Array.isArray(abierto.lineas) && abierto.lineas.length === 0) {
            return cantidad
        }
        let linea = abierto.lineas.find(function (linea) {
            return linea.producto.id === producto.id
        })
        if (linea) {
            cantidad = linea.cantidad
        }
        return cantidad
    }

    const agregarProducto = (cantidad) => {
        const logueado = auth.idUsuario()
        if (!logueado) {
            Swal.fire({
                title: `Para comenzar a realizar su pedido debe estar ingresar con su usuario. ¿Desea dirigirse al ingreso? `,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    let ruta = `${rutas.LOGIN}?volverA=${rutas.ALTA_PEDIDO}`
                    history.push(ruta)
                }
            })

            return
        }

        if (abierto.en_curso) {
            Swal.fire({
                title: "Ya tiene un pedido en curso. ¿Está seguro de comenzar otro pedido?",
                icon: 'question',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            }).then((result) => {
                if (result.isConfirmed) {
                    let pedido = actualizarPedido(cantidad)
                    crearPedidoAbierto(pedido)
                }
            })
        } else if (abierto.disponible) {
            let delivery = abierto.delivery
            let mensaje = 'Ya tiene un pedido por retirar, debe retirarlo por el local o anularlo'
            if (delivery) {
                mensaje = 'Tiene un pedido en proceso de envío'
            }
            Swal.fire({
                title: "No puede realizar otro pedido en este momento",
                text: mensaje,
                icon: 'question',
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText: 'Continuar',
                confirmButtonColor: 'rgb(88, 219, 131)',
            })
        } else {
            let pedido = actualizarPedido(cantidad)
            crearPedidoAbierto(pedido)
        }

    }

    const crearPedidoAbierto = (pedido) => {
        props.createPedido(pedido)
        props.saveCreatePedido()
    }

    const actualizarPedido = (cantidad) => {
        let pedido = abierto
        let linea = getLineaProducto()
        let nuevas = pedido.lineas
        let idLinea = linea.id > 0 ? linea.id : 0
        if (idLinea > 0) {
            nuevas = pedido.lineas.filter(linea => linea.id !== idLinea)
        }
        let nuevaCantidad = cantidad + linea.cantidad
        if (cantidad === 0) {
            nuevaCantidad = 0
        }
        linea.cantidad = nuevaCantidad
        nuevas.push(linea)
        pedido.lineas = nuevas
        pedido.lineasIds = nuevas.map(function (linea) {
            return linea.id
        })
        return pedido
    }

    const getLineaProducto = () => {
        let lineas = abierto.lineas
        let linea = lineas.find(linea => linea.producto.id === producto.id)
        if (linea === undefined) {
            return {
                id: 0,
                cantidad: 0,
                producto: producto
            }
        }
        return linea
    }

    const cantidad = getCantidad()
    let gestionCantidad = cantidad === 0 ?
        <Button variant="outlined" color="primary" className="anular no-cerrar-carrito" onClick={() => agregarProducto(1)}>
            <ShoppingCartIcon className="icono-material hvr-grow" />Agregar
        </Button>
        :
        <div className="producto-derecha-carrito-cantidad-gestion no-cerrar-carrito">
            <button
                className="mr-2"
                onClick={() => agregarProducto(-1)}>
                -
            </button>
            <span>{cantidad}</span>
            <button
                className="ml-2"
                onClick={() => agregarProducto(1)}>
                +
            </button>
        </div>
    return (
        <article key={producto.id} className="producto no-cerrar-carrito">
            <div className="producto-izquierda">
                <img src={path} onError={(e) => e.target.src = productoVacio} alt="Imagen de producto" />
            </div>
            <div className="producto-derecha">
                <div className="producto-derecha-titulos">
                    <h2>{producto.nombre}</h2>
                    <h3>{producto.descripcion}</h3>
                </div>
                <div className="producto-derecha-carrito">
                    <div className="producto-derecha-carrito-cantidad">
                        {
                            creando ? <Loader display={true} /> : gestionCantidad
                        }
                    </div>
                    <p className="producto-derecha-precio font-weight-bold text-right pr-2 m-0 text-nowrap">
                        {producto.precio_texto}
                    </p>
                </div>
            </div>
        </article>
    )
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createPedido: (pedido) => {
            dispatch(createPedido(pedido))
        },
        saveCreatePedido: (volverA) => {
            dispatch(saveCreatePedido(volverA))
        },
        fetchPedidoById: (pedido) => {
            dispatch(fetchPedidoById(pedido))
        },
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Producto))
