import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import $ from 'jquery';

//Api
import auth from "../../api/authentication";

//Actions
import { saveCerrarPedido } from "../../actions/PedidoActions";

//Components
import ItemCarrito from "./CarritoItem";

//CSS
import '../../assets/css/Carrito.css';

//Libraries
import Swal from "sweetalert2";

//Images
import imgVolver from "../../assets/img/arrow.png";

class Carrito extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrar: props.mostrar,
            lineas: [],
            buscando: false
        }

        this.carrito = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const buscando = this.props.pedidos.byId.isFetchingPedido;
        const estabaBuscando = prevProps.pedidos.byId.isFetchingPedido;
        console.log(buscando, estabaBuscando)
        if (!buscando && estabaBuscando) {
            console.log('Dejó de buscar')
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    getLineasCarrito() {
        let lineas = [];
        const activo = this.props.pedidos.byId.abierto;
        for (const [key, actual] of Object.entries(activo.lineas)) {
            let id = actual.id
            let linea = activo.lineas.find(linea => linea.id === id);
            if (linea) {
                let producto = this.props.productos.byId.productos[linea.producto.id];
                linea.producto = producto ? producto : {};
            }
            lineas.push(linea);
        }
        lineas = lineas.sort(function (a, b) {
            let productoA = a.producto.nombre;
            let productoB = b.producto.nombre;
            if (productoA < productoB) { return -1; }
            if (productoA > productoB) { return 1; }
            return 0;
        })
        let compras = [];
        lineas.forEach(linea => {
            compras.push(
                <ItemCarrito
                    key={linea.producto.id}
                    linea={linea}
                    guardando={this.props.guardando}
                    borrando={this.props.borrando}
                    productoGuardando={this.props.producto}
                    agregarProducto={(producto, cantidad) => this.props.agregarProducto(producto, cantidad)}
                />
            );
        });
        if (compras.length === 0) {
            var parar = true;
        }
        return compras;
    }

    entregarPedido(sinLineas) {
        if (sinLineas) {
            return;
        }
        const abierto = this.props.pedidos.byId.abierto;
        const valido = abierto.id > 0 && auth.idUsuario();
        if (!valido) {
            return;
        }
        Swal.fire({
            title: `¿Está seguro de cerrar el pedido? `,
            icon: 'question',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'rgb(88, 219, 131)',
            cancelButtonColor: '#bfbfbf',
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.saveCerrarPedido(abierto.id);
            }
        });
    }

    handleClickOutside(event) {
        let ocultar = this.comprobarOcultarCarrito(event);
        if (!ocultar && this.props.mostrar && this.carrito && !this.carrito.current.contains(event.target)) {
            this.props.changeMostrar();
        }
    }

    comprobarOcultarCarrito(evento) {
        let $elemento = $(evento.target).closest(".no-cerrar-carrito");
        return $elemento.length > 0;
    }

    render() {
        const { mostrar, blur } = this.props;

        let claseBlur = blur ? "forzar-blur" : "";
        let compras = this.getLineasCarrito();
        let deshabilitar = compras.length === 0;
        let total = 0;
        let pedido = this.props.pedidos.byId.abierto;
        if (pedido.id) {
            total = pedido.total;
        }
        return (
            <nav ref={this.carrito} className={`carrito ${claseBlur}`} style={{ right: !mostrar ? "-300px" : "0" }}>
                <img className="volverA" src={imgVolver} alt="Icono volver" onClick={() => this.props.changeMostrar()} />
                <div className="carrito-botones">
                    <button className="entregar bg-success" disabled={deshabilitar} onClick={() => this.entregarPedido(deshabilitar)}>
                        Enviar pedido
                    </button>
                    <button className="anular" disabled={deshabilitar} onClick={() => this.props.anularPedido(deshabilitar)}>
                        Anular
                    </button>
                </div>
                <div className="carrito-compras">
                    {compras}
                    <span style={{ display: total > 0 ? "block" : "none" }} className="text-right font-weight-bold">Subtotal: $ {total}</span>
                </div>
            </nav>
        );
    }
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos,
        productos: state.productos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveCerrarPedido: (id) => {
            dispatch(saveCerrarPedido(id))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Carrito));
