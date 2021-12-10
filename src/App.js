import React from 'react';

//Actions
import { saveDeletePedido } from "./actions/PedidoActions";

//Constants
import * as rutas from './constants/rutas.js';

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
import GestionTurno from './components/secciones/Gestion/Mesas/GestionTurno'
import HistoricoTurnos from './components/secciones/Gestion/Mesas/Turnos/Historico'
import MesaOrdenes from './components/secciones/Gestion/Mesas/Turnos/Ordenes'

//CSS
import "./assets/css/Inicio.css";

//Redux
import { connect } from 'react-redux';

//Router
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

//Librerias
import Swal from 'sweetalert2';

//Constants
import * as colores from "./constants/colores";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blur: false,
            mostrar: false
        };
    }

    setBlur(blur) {
        this.setState({ blur: blur });
    }

    changeMostrar() {
        this.setState(prevState => ({
            mostrar: !prevState.mostrar,
        }));
    }

    anularPedido(sinLineas) {
        const abierto = this.props.pedidos.byId.abierto;
        if (abierto.id > 0 && !sinLineas) {
            Swal.fire({
                title: `¿Está seguro de borrar el pedido? `,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: true,
                confirmButtonText: 'Borrar',
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
        const { mostrar, blur } = this.state;
        let claseBlur = blur ? "forzar-blur" : "";
        return (
            <div className="app">
                <LoaderLarge blur={blur} setBlur={(blur) => this.setBlur(blur)} />
                <Navegador changeMostrar={() => this.changeMostrar()} />
                <Carrito
                    blur={blur}
                    mostrar={mostrar}
                    changeMostrar={() => this.changeMostrar()}
                    anularPedido={(sinLineas) => this.anularPedido(sinLineas)}
                />
                <div className={`contenedor ${claseBlur}`} style={{ width: mostrar ? "calc(100% - 300px)" : "100%" }}>
                    <Switch>
                        <Route exact path={[rutas.ALTA_PEDIDO, "/"]} render={(props) =>
                            <AltaPedido
                                {...props}
                                changeMostrar={() => this.changeMostrar()}
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
                        <Route exact path={rutas.MESA_TURNO_ID} component={GestionTurno} />
                        <Route exact path={rutas.MESA_TURNOS_ID} component={HistoricoTurnos} />
                        <Route exact path={rutas.TURNOS_ORDENES_ID} component={MesaOrdenes} />
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
        pedidos: state.pedidos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveDeletePedido: (id) => {
            dispatch(saveDeletePedido(id))
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));