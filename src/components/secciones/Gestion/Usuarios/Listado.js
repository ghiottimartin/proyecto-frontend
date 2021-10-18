import React from "react";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";

//Actions
import {resetUsuarios, fetchUsuarios, saveDeleteUsuario} from "../../../../actions/UsuarioActions";

//Constants
import * as rutas from '../../../../constants/rutas.js';

//Components
import Loader from "../../../elementos/Loader";
import Titulo from "../../../elementos/Titulo";

//CSS
import "../../../../assets/css/Listado.css";

//Librerias
import history from "../../../../history";
import Swal from 'sweetalert2';
import AddBoxIcon from "@material-ui/icons/AddBox"

//Images
import lapiz from "../../../../assets/icon/pencil.png";
import tacho from "../../../../assets/icon/delete.png";

class Listado extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buscando:      true,
            noHayUsuarios: false
        }
    }

    componentDidMount() {
        this.props.resetUsuarios();
        this.props.fetchUsuarios();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let allIds      = this.props.usuarios.allIds;
        let usuarios    = this.props.usuarios.byId;
        let preUsuarios = prevProps.usuarios.byId;
        let deleting    = this.props.usuarios.delete;
        let preDeleting = prevProps.usuarios.delete;
        let busco = preUsuarios.isFetching && !usuarios.isFetching;
        let borro = preDeleting.isDeleting && !deleting.isDeleting;
        if ((busco || borro) && allIds.length === 0) {
            this.setState({
                noHayUsuarios: true,
            })
        }
        if (preUsuarios.isFetching && !usuarios.isFetching) {
            this.setState({
                buscando: false,
            })
        }
    }

    getRolesUsuario(usuario) {
        let roles = [];
        let esAdmin    = usuario.esAdmin;
        if (esAdmin) {
            roles.push('Administrador');
        }
        let esVendedor = usuario.esVendedor;
        if (esVendedor) {
            roles.push('Vendedor');
        }
        let esMozo     = usuario.esMozo;
        if (esMozo) {
            roles.push('Mozo');
        }
        let esComensal     = usuario.esComensal;
        if (esComensal) {
            roles.push('Comensal');
        }
        return roles.join(", ");
    }

    modalBorrar(usuario) {
        let logueado = this.props.usuarios.update.logueado;
        Swal.fire({
            title: `Está seguro de borrar el usuario '${usuario.first_name}'`,
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'rgb(88, 219, 131)',
            cancelButtonColor: '#bfbfbf',
        }).then((result) => {
            if (result.isConfirmed && logueado.id !== usuario.id) {
                this.props.saveDeleteUsuario(usuario.id);
            } else if (result.isConfirmed) {
                Swal.fire({
                    title: `No es posible borrar al usuario logueado`,
                    icon: 'warning',
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: true,
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: 'rgb(88, 219, 131)',
                })
            }
        })
    }

    getOperacionesUsuario(usuario) {
        let id         = usuario.id;
        let logueado   = this.props.usuarios.update.logueado;
        let rutaEditar = rutas.getUrl(rutas.USUARIOS, id, rutas.ACCION_EDITAR, rutas.TIPO_ADMIN, rutas.USUARIOS_LISTAR);
        let borrar =
            <div style={{display: usuario.puede_borrarse ? "block" : "none"}} onClick={() => this.modalBorrar(usuario)} title="Borrar"
               className="operacion">
                <img src={tacho} className="icono-operacion" alt="Borrar usuario"/>
                Borrar
            </div>;
        return (
            <div className="d-flex">
                <a onClick={() => history.push(rutaEditar)} title="Editar"
                   className="operacion">
                    <img src={lapiz} className="icono-operacion" alt="Editar usuario"/>
                    Editar
                </a>
                {id !== logueado.id ? borrar : ""}
            </div>
        );
    }

    render() {
        const { noHayUsuarios, buscando } = this.state;
        let Usuarios = [];
        if (noHayUsuarios) {
            Usuarios =
                <tr className="text-center">
                    <td colSpan="5">No hay usuarios cargados</td>
                </tr>;
        }
        this.props.usuarios.allIds.map(idUsuario => {
            let usuario = this.props.usuarios.byId.usuarios[idUsuario];
            if (usuario && usuario.id) {
                let roles       = this.getRolesUsuario(usuario);
                let operaciones = this.getOperacionesUsuario(usuario);
                Usuarios.push(
                    <tr key={usuario.id}>
                        <td>{usuario.first_name}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.dni}</td>
                        <td>{roles}</td>
                        <td>{operaciones}</td>
                    </tr>
                );
            }
        });
        const Cargando =
        <tr>
            <td></td>
            <td></td>
            <td><Loader display={true}/></td>
            <td></td>
            <td></td>
        </tr>;
        return (
            <div className="tabla-listado">
                <div className="table-responsive tarjeta-body listado">
                    <div className="d-flex justify-content-between">
                        <Titulo ruta={rutas.GESTION} titulo={"Usuarios"} clase="tabla-listado-titulo" />
                        <a href="#"
                            onClick={() => history.push(rutas.USUARIOS_ALTA_ADMIN + "?volverA=" + rutas.USUARIOS_LISTAR)}
                            data-toggle="tooltip" data-original-title="" title="">
                            <AddBoxIcon style={{ color:  '#5cb860'}}/>
                        </a>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Dni</th>
                            <th>Roles</th>
                            <th>Operaciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {buscando ? Cargando : Usuarios}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsuarios: () => {
            dispatch(fetchUsuarios())
        },
        resetUsuarios: () => {
            dispatch(resetUsuarios())
        },
        saveDeleteUsuario: (id) => {
            dispatch(saveDeleteUsuario(id))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));