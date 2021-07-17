import React from 'react';
import $ from 'jquery';

//Routes-redux
import history from "../../history";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { logout } from "../../actions/AuthenticationActions";
import { fetchUsuarioLogueadoIfNeeded } from "../../actions/UsuarioActions";

//Api
import auth from "../../api/authentication";

//Constants
import * as rutas from '../../constants/rutas.js';

//CSS
import '../../assets/css/Navegador.css';

//Icons
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

//Images
import logo from "../../assets/img/logo.png";
import menu from "../../assets/img/menu.png";

class Navegador extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            esAdmin: null,
            collapse: false,
        };

        this.menu = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        window.scroll(0, 0);
        let logueado = this.props.usuarios.update.logueado;
        if (auth.idUsuario() && logueado.id === undefined) {
            this.props.fetchUsuarioLogueadoIfNeeded();
        }
        if (this.props.usuarios.update.logueado.first_name) {
            this.setNombreUsuarioLogueado();
        }
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let logueado = this.props.usuarios.update.logueado;
        if (prevProps.usuarios.update.logueado.first_name !== logueado.first_name
            && (this.state.first_name === "" || this.state.first_name !== logueado.first_name)) {
            this.setNombreUsuarioLogueado();
        }
        if (this.state.esAdmin === null && logueado.id) {
            this.setState({
                esAdmin: logueado.esAdmin
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setNombreUsuarioLogueado() {
        let nombre = this.props.usuarios.update ? this.props.usuarios.update.logueado.first_name : "";
        this.setState({
            nombre: nombre ? nombre.trim() : ""
        });
    }

    redirectTo(ruta) {
        if (ruta === "") {
            return;
        }
        if (!this.props.authentication.currentlySending && ruta === rutas.LOGOUT) {
            this.props.logout();
            window.location.reload();
        } else if (!this.props.authentication.currentlySending) {
            history.push(ruta);
        }

    }

    getRutaActiva(ruta) {
        let rutaActual = window.location.pathname;
        let esActual = rutaActual === ruta;
        let esRutaGestion = this.comprobarEsRutaGestion(ruta, rutaActual);
        return esActual || esRutaGestion;
    }

    comprobarEsRutaGestion(ruta, rutaActual) {
        let esAltaUsuarios = rutaActual.indexOf(rutas.USUARIOS_ALTA_ADMIN) === 0;
        let esEditarUsuarios = rutaActual.indexOf(rutas.USUARIOS_EDITAR_ADMIN) === 0;
        let esListadoUsuarios = rutaActual.indexOf(rutas.USUARIOS_LISTAR) === 0;
        let esListadoProductos = rutaActual.indexOf(rutas.PRODUCTOS_LISTAR_ADMIN) === 0;
        let esAltaProductos = rutaActual.indexOf(rutas.PRODUCTO_ALTA) === 0;
        return ruta === rutas.GESTION && (esAltaUsuarios || esListadoUsuarios || esEditarUsuarios || esListadoProductos || esAltaProductos);
    }

    toogleResponsive(e) {
        this.setState({ collapse: !this.state.collapse });
    }

    /**
    * Alert if clicked on outside of element
    */
    handleClickOutside(event) {
        if (this.menu && this.menu.current && !this.menu.current.contains(event.target)) {
            this.setState({ collapse: false });
        }
    }

    render() {
        const { nombre, esAdmin, collapse } = this.state;
        const logueado = this.props.authentication.token;
        const ItemMenu = props => {
            let display = props.mostrar ? "" : "no-mostrar";
            let grow = props.grow ? "hvr-grow" : "";
            let ruta = props.ruta;
            let activa = this.getRutaActiva(props.ruta);
            let claseActiva = activa ? "activo" : "";
            return (
                <button
                    className={`itemMenu no-cerrar-carrito ${display} ${grow} ${claseActiva}`}
                    onClick={() => this.redirectTo(ruta)}
                    style={{ cursor: props.grow ? "pointer" : "unset" }}
                >
                    {props.texto}
                </button>
            )
        };

        const OpcionesMenu = (props) => (
            <>
                <ItemMenu
                    mostrar={props.mostrar}
                    grow={true}
                    texto={"Almacén"}
                    ruta={rutas.ALMACEN}
                />
                <ItemMenu
                    mostrar={props.mostrar}
                    grow={true}
                    texto={"Menu"}
                    ruta={rutas.MENU}
                />
                <ItemMenu
                    mostrar={props.mostrar}
                    grow={true}
                    texto={"Pedidos"}
                    admin={true}
                    ruta={rutas.PEDIDOS}
                />
                <ItemMenu
                    mostrar={props.mostrar && props.esAdmin}
                    grow={true}
                    texto={"Gestión"}
                    admin={true}
                    ruta={rutas.GESTION}
                />
            </>
        );

        const NoLogueado = props => (
            <>
                <ItemMenu
                    mostrar={props.mostrar}
                    grow={true}
                    texto={"Login"}
                    ruta={rutas.LOGIN}
                />
                <ItemMenu
                    mostrar={props.mostrar}
                    grow={false}
                    texto={"Registro"}
                    ruta={rutas.USUARIOS_ALTA_COMUN}
                />
            </>
        );
        const Logueado = props => (
            <>
                <ItemMenu
                    mostrar={props.mostrar && props.nombre}
                    grow={false}
                    texto={nombre !== "" ? "Hola " + nombre + "!" : ""}
                    ruta={""}
                    tipo={"boton"}
                />
                <OpcionesMenu mostrar={props.mostrar && props.responsive} esAdmin={esAdmin} />
                <ItemMenu
                    mostrar={props.mostrar}
                    grow={true}
                    texto={"Mi perfil"}
                    ruta={rutas.USUARIOS_EDITAR_COMUN}
                />
                <ItemMenu
                    mostrar={props.mostrar}
                    grow={true}
                    texto={"Salir"}
                    ruta={rutas.LOGOUT}
                />
            </>
        );

        let responsive = $(window).width() <= 849;

        return (
            <nav className="navegador no-cerrar-carrito">
                <div className="izquierda">
                    <img className="logo" src={logo}
                        onClick={() => this.redirectTo(rutas.INICIO)}
                        alt="Logo sistema gestión"
                        title="Logo sistema de gestión gastronómico"
                    />
                    {!responsive ? <OpcionesMenu mostrar={true} esAdmin={esAdmin} /> : ""}

                </div>
                <div className="derecha">
                    <ShoppingCartIcon className="icono-material hvr-grow" onClick={() => this.props.changeMostrar()} />
                    <NoLogueado mostrar={!logueado} />
                    <Logueado mostrar={logueado} responsive={responsive} nombre={true} />
                </div>
                {responsive ?
                    <div className="derecha-responsive" ref={this.menu}>
                        <ShoppingCartIcon className="icono-material hvr-grow" onClick={() => this.props.changeMostrar()} />
                        <div className="menu-responsive">
                            <img src={menu} alt="Menu" onClick={(e) => this.toogleResponsive(e)} />
                        </div>
                        <div className={collapse ? "menu-responsive-collapse colapse" : "menu-responsive-collapse"} style={{ right: collapse ? "-1px" : "-300px" }}>
                            <NoLogueado mostrar={!logueado} />
                            <Logueado mostrar={logueado} responsive={responsive} nombre={false} />
                        </div>
                    </div>                
                : ""}
            </nav>
        );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(logout())
        },
        fetchUsuarioLogueadoIfNeeded: () => {
            dispatch(fetchUsuarioLogueadoIfNeeded())
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navegador));
