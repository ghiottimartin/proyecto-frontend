import React from 'react';
import history from "./history";

//Api
import auth from "./api/authentication";

//Actions
import { createPedido, saveCreatePedido, saveDeletePedido, resetPedidoAbierto } from "./actions/PedidoActions";
import { fetchUsuarioLogueadoIfNeeded } from "./actions/UsuarioActions";

//Constants
import * as rutas from './constants/rutas.js';
import * as colores from "./constants/colores";

//Components
import AltaPedido from "./components/secciones/AltaPedido";
import AltaEdicionCategoria from "./components/secciones/Gestion/Productos/Categorias/AltaEdicion";
import AltaEdicionProducto from "./components/secciones/Gestion/Productos/AltaEdicion";
import CambiarPassword from "./components/secciones/Gestion/Usuarios/CambiarPassword";
import Carrito from "./components/elementos/Carrito";
import Editar from "./components/secciones/Gestion/Usuarios/Editar";
import Gestion from "./components/secciones/Gestion";
import ListadoProductos from "./components/secciones/Gestion/Productos/Listado";
import ListadoUsuarios from "./components/secciones/Gestion/Usuarios/Listado";
import LoaderLarge from "./components/elementos/LoaderLarge";
import Login from "./components/secciones/Gestion/Usuarios/Login";
import Navegador from "./components/elementos/Navegador";
import NotFound from "./components/secciones/NotFound";
import Registro from "./components/secciones/Gestion/Usuarios/Alta";
import ValidarEmail from "./components/secciones/Gestion/Usuarios/ValidarEmail";
import ListadoCategorias from "./components/secciones/Gestion/Productos/Categorias/Listado";
import PedidoListado from "./components/secciones/Pedidos/Listado";
import PedidoVisualizar from "./components/secciones/Pedidos/Visualizar";
import IngresoAlta from './components/secciones/Gestion/Ingreso/Alta';
import IngresoListado from './components/secciones/Gestion/Ingreso/Listado';
import IngresoVisualizar from './components/secciones/Gestion/Ingreso/Visualizar';
import MovimientosStock from './components/secciones/Gestion/MovimientosStock/Listado';
import AltaReemplazoMercaderia from './components/secciones/Gestion/ReemplazoMercaderia/Alta';
import ListadoReemplazoMercaderia from './components/secciones/Gestion/ReemplazoMercaderia/Listado';
import ReemplazoVisualizar from './components/secciones/Gestion/ReemplazoMercaderia/Visualizar';
import AltaVentaAlmacen from './components/secciones/Gestion/Venta/Alta';
import ListadoVentaAlmacen from './components/secciones/Gestion/Venta/Listado';
import VisualizarVenta from './components/secciones/Gestion/Venta/Visualizar';
import AltaEdicionMesa from './components/secciones/Gestion/Mesas/AltaEdicion';
import ListadoMesa from './components/secciones/Gestion/Mesas/Listado';
import MesaTurno from './components/secciones/Gestion/Mesas/Turno'
import MesaTurnos from './components/secciones/Gestion/Mesas/Turnos/Turnos'

//CSS
import "./App.css";
import "./assets/css/Inicio.css";

//Redux
import { connect } from 'react-redux';

//Router
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

//Librerías
import Swal from 'sweetalert2';
import isEmpty from "lodash/isEmpty";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blur: false,
            borrando: false,
            guardando: false,
            mostrar: false,
            producto: 0,
        };
    }

    setBlur(blur) {
        this.setState({ blur: blur });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.pedidos.create.isCreating && !this.props.pedidos.create.isCreating) {
            this.setState({
                guardando: false,
                borrando: false,
                producto: 0,
            });
        }
    }

    changeMostrar() {
        this.setState(prevState => ({
            mostrar: !prevState.mostrar,
        }));
    }

    getCantidad(producto) {
        if (isEmpty(producto)) {
            return 0;
        }
        const abierto = this.props.pedidos.byId.abierto;
        let cantidad = 0;
        if (Array.isArray(abierto.lineas) && abierto.lineas.length === 0) {
            return cantidad;
        }
        let linea = abierto.lineas.find(function (linea) {
            return linea.producto.id === producto.id;
        });
        if (linea) {
            cantidad = linea.cantidad;
        }
        return cantidad;
    }

    agregarProducto(producto, cantidad) {
        if (!auth.idUsuario()) {
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
                    history.push(ruta);
                }
            });
        } else {
            let pedido = this.actualizarPedido(producto, cantidad);
            if (pedido.en_curso) {
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
                        this.crearPedidoAbierto(producto, pedido);
                    }
                });
            } else if (pedido.disponible) {
                Swal.fire({
                    title: "No puede realizar otro pedido en este momento",
                    text: 'Ya tiene un pedido por retirar, debe retirarlo por el local o anularlo',
                    icon: 'question',
                    showCloseButton: true,
                    focusConfirm: true,
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: 'rgb(88, 219, 131)',
                });
            } else {
                this.crearPedidoAbierto(producto, pedido);
            }
        }
    }

    crearPedidoAbierto(producto, pedido) {
        this.setState({
            guardando: true,
            producto: producto.id,
        });
        this.props.createPedido(pedido);
        this.props.saveCreatePedido();
    }

    actualizarPedido(producto, cantidad) {
        let pedido = this.props.pedidos.byId.abierto;
        let linea = this.getLineaProducto(producto, pedido);
        let nuevas = pedido.lineas;
        let idLinea = linea.id > 0 ? linea.id : 0;
        if (idLinea > 0) {
            nuevas = pedido.lineas.filter(linea => linea.id !== idLinea);
        }
        let nuevaCantidad = cantidad + linea.cantidad;
        if (cantidad === 0) {
            nuevaCantidad = 0;
        }
        linea.cantidad = nuevaCantidad;
        nuevas.push(linea);
        pedido.lineas = nuevas;
        pedido.lineasIds = nuevas.map(function (linea) {
            return linea.id;
        });
        this.setState({
            cantidad: nuevaCantidad
        })
        return pedido;
    }

    getLineaProducto(producto, pedido) {
        let lineas = pedido.lineas;
        let linea = lineas.find(linea => linea.producto.id === producto.id);
        if (linea === undefined) {
            return {
                id: 0,
                cantidad: 0,
                producto: producto
            };
        }
        return linea;
    }

    anularPedido(sinLineas) {
        const abierto = this.props.pedidos.byId.abierto;
        if (abierto.id > 0 && !sinLineas) {
            Swal.fire({
                title: `¿Está seguro de anular el pedido? `,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: true,
                confirmButtonText: 'Anular',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: colores.COLOR_ROJO,
                cancelButtonColor: '#bfbfbf',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.props.saveDeletePedido(abierto.id);
                }
            });

        }
    }

    render() {
        const { mostrar, guardando, producto, borrando, blur } = this.state;
        let claseBlur = blur ? "forzar-blur" : "";
        return (
            <div className="app">
                <LoaderLarge blur={blur} setBlur={(blur) => this.setBlur(blur)} />
                <Navegador changeMostrar={() => this.changeMostrar()} />
                <Carrito
                    blur={blur}
                    mostrar={mostrar}
                    producto={producto}
                    guardando={guardando}
                    borrando={borrando}
                    changeMostrar={() => this.changeMostrar()}
                    anularPedido={(sinLineas) => this.anularPedido(sinLineas)}
                    agregarProducto={(producto, cantidad) => this.agregarProducto(producto, cantidad)}
                />
                <div className={`contenedor ${claseBlur}`} style={{ width: mostrar ? "calc(100% - 300px)" : "100%" }}>
                    <Switch>
                        <Route exact path={[rutas.ALTA_PEDIDO, "/"]} render={(props) =>
                            <AltaPedido
                                {...props}
                                getCantidad={(producto) => this.getCantidad(producto)}
                                changeMostrar={() => this.changeMostrar()}
                                agregarProducto={(producto, cantidad) => this.agregarProducto(producto, cantidad)}
                                producto={producto}
                                guardando={guardando}
                            />}
                        />
                        <Route exact path={rutas.LOGIN} component={Login} />
                        <Route exact path={rutas.RESET_PASSWORD} component={CambiarPassword} />
                        <Route exact path={rutas.VALIDAR_EMAIL} component={ValidarEmail} />
                        <Route exact path={rutas.GESTION} component={Gestion} />
                        <Route exact path={rutas.USUARIOS_ALTA} component={Registro} />
                        <Route exact path={rutas.USUARIOS_LISTAR} component={ListadoUsuarios} />
                        <Route exact path={rutas.USUARIOS_EDITAR} component={Editar} />
                        <Route exact path={rutas.PRODUCTOS_LISTAR_ADMIN} component={ListadoProductos} />
                        <Route exact path={rutas.PRODUCTOS_ACCIONES} component={AltaEdicionProducto} />
                        <Route exact path={rutas.CATEGORIAS_LISTAR_ADMIN} component={ListadoCategorias} />
                        <Route exact path={rutas.CATEGORIAS_ACCIONES} component={AltaEdicionCategoria} />
                        <Route exact path={rutas.PEDIDOS} component={PedidoListado} />
                        <Route exact path={rutas.PEDIDO_VISUALIZAR} component={PedidoVisualizar} />
                        <Route exact path={rutas.INGRESO_MERCADERIA} component={IngresoListado} />
                        <Route exact path={rutas.INGRESO_MERCADERIA_ALTA} component={IngresoAlta} />
                        <Route exact path={rutas.INGRESO_MERCADERIA_VISUALIZAR_ID} component={IngresoVisualizar} />
                        <Route exact path={[rutas.MOVIMIENTOS_STOCK_ID, rutas.MOVIMIENTOS_STOCK_INGRESO_ID]} component={MovimientosStock} />
                        <Route exact path={rutas.REEMPLAZO_MERCADERIA_LISTAR} component={ListadoReemplazoMercaderia} />
                        <Route exact path={rutas.REEMPLAZO_MERCADERIA_ALTA} component={AltaReemplazoMercaderia} />
                        <Route exact path={rutas.REEMPLAZO_MERCADERIA_VISUALIZAR_ID} component={ReemplazoVisualizar} />
                        <Route exact path={rutas.MESAS_LISTAR} component={ListadoMesa} />
                        <Route exact path={rutas.MESA_ABM} component={AltaEdicionMesa} />
                        <Route exact path={rutas.MESA_TURNO_ID} component={MesaTurno} />
                        <Route exact path={rutas.MESA_TURNOS_ID} component={MesaTurnos} />
                        <Route exact path={rutas.VENTA_LISTADO} component={ListadoVentaAlmacen} />
                        <Route exact path={rutas.VENTA_ALTA} component={AltaVentaAlmacen} />
                        <Route exact path={rutas.VENTA_VISUALIZAR_ID} component={VisualizarVenta} />
                        <Route exact path="*" component={NotFound} />
                    </Switch>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        pedidos: state.pedidos,
        productos: state.productos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsuarioLogueadoIfNeeded: () => {
            dispatch(fetchUsuarioLogueadoIfNeeded())
        },
        createPedido: (pedido) => {
            dispatch(createPedido(pedido))
        },
        saveCreatePedido: (volverA) => {
            dispatch(saveCreatePedido(volverA))
        },
        saveDeletePedido: (id) => {
            dispatch(saveDeletePedido(id))
        },
        resetPedidoAbierto: () => {
            dispatch(resetPedidoAbierto())
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));