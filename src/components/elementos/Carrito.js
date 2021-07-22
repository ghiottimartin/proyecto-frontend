import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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
import isEmpty from "lodash/isEmpty";
import Swal from "sweetalert2";
import Button from '@material-ui/core/Button';

//Images
import imgVolver from "../../assets/img/arrow.png";

class Carrito extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrar: props.mostrar,
        }

        this.carrito = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    getLineasPedidoActivo() {
        const activo = this.props.pedidos.byId.abierto;
        if (isEmpty(activo)) {
            return [];
        }
        let lineas = [];
        activo.lineasIds.map(id => {
            let linea = activo.lineas.find(linea => linea.id === id);
            if (linea) {
                let producto = this.props.productos.byId.productos[linea.producto.id];
                linea.producto = producto ? producto : {};
            }
            lineas.push(linea);
        });
        lineas = lineas.sort(function (a, b) {
            let productoA = a.producto.nombre;
            let productoB = b.producto.nombre;
            if(productoA < productoB) { return -1; }
            if(productoA > productoB) { return 1; }
            return 0;
        })
        return lineas;
    }

    getLineasCarrito() {
        let lineas  = this.getLineasPedidoActivo();
        let compras = [];
        lineas.forEach(linea => {
            let clave = Math.random();
            compras.push(
                <ItemCarrito
                    key={clave}
                    linea={linea}
                    guardando={this.props.guardando}
                    borrando={this.props.borrando}
                    productoGuardando={this.props.producto}
                    agregarProducto={(producto, cantidad) => this.props.agregarProducto(producto, cantidad)}
                />
            );
        });
        return compras;
    }

    recibirPedido(sinLineas) {
        if (sinLineas) {
            return;
        }
        const abierto = this.props.pedidos.byId.abierto;
        const valido  = abierto.id > 0 && auth.idUsuario();
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

        let claseBlur    = blur ? "forzar-blur" : "";
        let compras      = this.getLineasCarrito();
        let deshabilitar = compras.length === 0;
        let total        = 0;
        let pedido       = this.props.pedidos.byId.abierto;
        if (pedido.id) {
            total = pedido.total;
        }
        return (
            <nav ref={this.carrito} className={`carrito ${claseBlur}`} style={{ right: !mostrar ? "-300px" : "0" }}>
                <img className="volverA" src={imgVolver} alt="Icono volver" onClick={() => this.props.changeMostrar()} />
                <div className="carrito-botones">
                    <Button variant="outlined" color="secondary" className="recibir" disabled={deshabilitar} onClick={() => this.recibirPedido(deshabilitar)}>
                        Enviar pedido
                    </Button>
                    <Button variant="outlined" color="primary" className="cancelar" disabled={deshabilitar} onClick={() => this.props.cancelarPedido(deshabilitar)}>
                        Cancelar
                    </Button>
                </div>
                <div className="carrito-compras">
                    {compras}
                    <span style={{display: total > 0 ? "block" : "none"}} className="text-right font-weight-bold">Subtotal: $ {total}</span>
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
