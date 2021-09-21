import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

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

class Gestion extends React.Component {
    constructor(props) {
        super(props);
    }

    getImagenPorRuta(ruta) {
        switch (ruta) {
            case rutas.COMPRAS:
                return imgCompras;
            case rutas.USUARIOS_LISTAR:
                return imgUsuarios;
            case rutas.PRODUCTOS_LISTAR_ADMIN:
                return imgProductos;
            case rutas.PEDIDOS_VENDEDOR:
                return imgPedidos;
        }
    }

    getOperacion(operacion) {
        let rol        = operacion.rol;
        let usuario    = this.props.usuarios.update.logueado;
        let roles      = usuario && usuario.rolesArray ? usuario.rolesArray : [];
        let autorizado = roles.includes(rol);
        if (!autorizado) {
            return;
        }

        let alt         = operacion && operacion.alt ? operacion.alt : "";
        let key         = Math.floor(Math.random() * 100);
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
                key={key}
                titulo={titulo}
                descripcion={descripcion}
                alt={alt}
                title={titulo}
                ruta={ruta}
                img={imagen}
                rol={rol}
                margenLeftImg={margenLeftImg}
            />
        );
    }

    getOperaciones() {
        const logueado    = this.props.usuarios.update.logueado;
        const convertir   = logueado && logueado.id ? logueado.operaciones : [];
        let   operaciones = [];
        convertir.map((operacion) => {
            let existe = this.getOperacion(operacion);
            if (existe) {
                operaciones.push(existe);
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