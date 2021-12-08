import React from "react";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";

//Api
import auth from "../../api/authentication";

//Constants
import * as rutas from '../../constants/rutas.js';

//Components
import Loader from "../elementos/Loader";

//CSS
import "../../assets/css/Gestion.css";

//Elementos
import TarjetaMenu from "../elementos/TarjetaMenu";

//Imagenes
import imgUsuarios from "../../assets/img/menu/gestion-usuario.svg";
import imgCompras from "../../assets/img/menu/compras.svg";
import imgProductos from "../../assets/img/menu/productos.png";
import imgPedidos from "../../assets/img/menu/pedidos.png";
import imgMesa from "../../assets/img/menu/table.png";

//Librerias
import history from "../../history";

class Gestion extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let idUsuario = auth.idUsuario();
        if (isNaN(idUsuario)) {
            history.push(rutas.LOGIN);
        }
    }

    /**
     * Devuelve una imagen según la ruta.
     * 
     * @param {String} ruta 
     * @returns 
     */
    getImagenPorRuta(ruta) {
        switch (ruta) {
            case rutas.INGRESO_MERCADERIA:
                return imgCompras;
            
            case rutas.USUARIOS_LISTAR:
                return imgUsuarios;
            
            case rutas.PRODUCTOS_LISTAR_ADMIN:
            case rutas.REEMPLAZO_MERCADERIA_LISTAR:
                return imgProductos;
            
            case rutas.PEDIDOS_VENDEDOR:
            case rutas.VENTA_LISTADO:
                return imgPedidos;
            
            case rutas.MESAS_LISTAR:
                return imgMesa;
            
        }
    }

    /**
     * Devuelve una TarjetaMenu para crear una operación.
     * 
     * @param {Object} operacion 
     * @returns TarjetaMenu
     */
    getOperacion(operacion) {
        let roles      = operacion.roles ? operacion.roles : [];
        let usuario    = this.props.usuarios.update.logueado;
        let rolesArray = usuario && usuario.rolesArray ? usuario.rolesArray : [];
        let autorizado = false;
        rolesArray.map(rol => {
            const contiene = roles.includes(rol)
            if (contiene) {
                autorizado = true;
            }
        });
        
        if (!autorizado) {
            return null;
        }

        let id          = operacion && operacion.id ? operacion.id : 0;
        let alt         = operacion && operacion.alt ? operacion.alt : "";
        let ruta        = operacion && operacion.ruta ? operacion.ruta : "";
        let titulo      = operacion && operacion.titulo ? operacion.titulo : "";
        let descripcion = operacion && operacion.descripcion ? operacion.descripcion : "";
        if (ruta !== "") {
            ruta = rutas.validarRuta(ruta) ? ruta : "#";
        }
        let imagen        = this.getImagenPorRuta(ruta);
        let margenLeftImg = operacion.ruta === rutas.PEDIDOS_VENDEDOR ? "13px" : "";
        return(
            <TarjetaMenu
                key={id}
                titulo={titulo}
                descripcion={descripcion}
                alt={alt}
                title={titulo}
                ruta={ruta}
                img={imagen}
                roles={roles}
                margenLeftImg={margenLeftImg}
            />
        );
    }

    /**
     * Devuelve las operaciones de gestión.
     * 
     * @returns Array
     */
    getOperaciones() {
        const logueado    = this.props.usuarios.update.logueado;
        const convertir   = logueado && logueado.id ? logueado.operaciones : [];
        let   operaciones = [];
        convertir.map((operacion) => {
            let encontrada = this.getOperacion(operacion);
            if (encontrada !== null) {
                operaciones.push(encontrada);
            }
        });

        let contenedorOperaciones =  (
            <div className="contenedor-operaciones">
                <div className="operaciones">
                    {operaciones}
                </div>
            </div>
        );

        if (convertir.length === 0) {
            contenedorOperaciones = (<div></div>);
        }
        return contenedorOperaciones;
    }

    render() {
        let buscando    = this.props.usuarios.update.isFetchingUsuarioLogueado;
        let operaciones = this.getOperaciones();
        return (
            <div className="gestion">
                {buscando ?
                    <div className="tarjeta-body">
                        <b className="mb-5">Buscando operaciones de gestión...</b>
                        <Loader display={buscando} />
                    </div>
                    :
                    operaciones
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        usuarios: state.usuarios,
        roles: state.roles,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Gestion));