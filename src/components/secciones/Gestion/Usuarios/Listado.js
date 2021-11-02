import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Actions
import { resetUsuarios, fetchUsuarios, saveDeleteUsuario, saveUpdateUsuario, updateUsuario, updateFiltros } from "../../../../actions/UsuarioActions";

//Constants
import * as rutas from '../../../../constants/rutas.js';

//Components
import Loader from "../../../elementos/Loader";
import Titulo from "../../../elementos/Titulo";
import Filtros from "./Filtros";
import Paginacion from "../../../elementos/Paginacion"

//CSS
import "../../../../assets/css/Listado.css";

//Librerias
import history from "../../../../history";
import Swal from 'sweetalert2';
import AddBoxIcon from "@material-ui/icons/AddBox"

class Listado extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paginaUno: true
        }
    }

    componentDidMount() {
        this.buscarUsuarios();
    }

    buscarUsuarios() {
        this.props.resetUsuarios();
        this.props.fetchUsuarios();
    }

    componentDidUpdate(prevProps) {
        const cambioDePagina = prevProps.usuarios.byId.filtros.paginaActual !== this.props.usuarios.byId.filtros.paginaActual
        if (cambioDePagina) {
            this.buscarUsuarios();
        }
    }

    /**
     * Devuelve los roles del usuario.
     * 
     * @param {Object} usuario 
     * @returns 
     */
    getRolesUsuario(usuario) {
        let roles = [];
        let esAdmin = usuario.esAdmin;
        if (esAdmin) {
            roles.push('Administrador');
        }
        let esVendedor = usuario.esVendedor;
        if (esVendedor) {
            roles.push('Vendedor');
        }
        let esMozo = usuario.esMozo;
        if (esMozo) {
            roles.push('Mozo');
        }
        let esComensal = usuario.esComensal;
        if (esComensal) {
            roles.push('Comensal');
        }
        return roles.join(", ");
    }

    /**
     * Abre el modal para confirmar el borrado del usuario.
     * 
     * @param {Object} usuario 
     */
    modalBorrar(usuario) {
        let logueado = this.props.usuarios.update.logueado;
        Swal.fire({
            title: `¿Está seguro de borrar el usuario '${usuario.first_name}'?`,
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

    /**
     * Abre el modal para confirmar la deshabilitación del usuario.
     * 
     * @param {Object} usuario 
     */
    modalDeshabilitar(usuario) {
        let logueado = this.props.usuarios.update.logueado;
        Swal.fire({
            title: `¿Está seguro de deshabilitar el usuario '${usuario.first_name}'?`,
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'rgb(88, 219, 131)',
            cancelButtonColor: '#bfbfbf',
            input: 'textarea',
            inputLabel: 'Motivo',
            inputPlaceholder: 'Indique un motivo...',
            inputAttributes: {
                'aria-label': 'Indique un motivo',
                required: true,
                minlength: 10
            },
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value.length < 10 && value.length > 0) {
                        resolve('La longitud del motivo debe ser de al menos 10 caracteres.')
                    } else if (value.length === 0) {
                        resolve('Debe indicar un motivo.')
                    } else {
                        resolve()
                    }
                })
            }
        }).then((result) => {
            if (result.isConfirmed && logueado.id !== usuario.id) {
                let motivo = result.value;
                this.props.saveDeleteUsuario(usuario.id, motivo);
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

    /**
     * Abre el modal para confirmar la habilitación del usuario.
     * 
     * @param {Object} usuario 
     */
    modalHabilitar(usuario) {
        Swal.fire({
            title: `¿Está seguro de habilitar el usuario '${usuario.first_name}'? `,
            icon: 'question',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Habilitar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: 'rgb(92, 184, 96)',
            cancelButtonColor: '#bfbfbf',
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.updateUsuario(usuario);
                this.props.saveUpdateUsuario(true);
            }
        });
    }

    /**
     * Devuelve las operaciones del listado de usuarios.
     * 
     * @param {Object} usuario 
     * @returns 
     */
    getOperacionesUsuario(usuario) {
        let operaciones = [];
        usuario.operaciones_listado.forEach(operacion => {
            let accion = operacion.accion;
            operaciones.push(
                <div key={operacion.key} title={operacion.title} onClick={() => this.ejecutarOperacion(usuario, accion)} className={operacion.clase + " operacion"} >
                    <i className={operacion.icono} aria-hidden="true"></i> {operacion.texto}
                </div>
            );
        })
        return (
            <div className="fila-operaciones">
                {operaciones}
            </div>
        )
    }

    /**
     * Ejecuta la operación del listado del usuarios según el caso.
     * 
     * @param {Object} usuario 
     * @param {String} accion 
     */
    ejecutarOperacion(usuario, accion) {
        switch (accion) {
            case 'deshabilitar':
                this.modalDeshabilitar(usuario);
                break;

            case 'habilitar':
                this.modalHabilitar(usuario);
                break;

            case 'borrar':
                this.modalBorrar(usuario);
                break;

            case 'editar':
                let id = usuario.id;
                let rutaEditar = rutas.getUrl(rutas.USUARIOS, id, rutas.ACCION_EDITAR, rutas.TIPO_ADMIN, rutas.USUARIOS_LISTAR);
                history.push(rutaEditar);
                break;
        }

    }

    /**
     * Redirige al listado de usuarios.
     */
    redirigirListado() {
        const ruta = rutas.USUARIOS_ALTA_ADMIN + "?volverA=" + rutas.USUARIOS_LISTAR
        history.push(ruta);
    }

    /**
     * Filtra los usuarios.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    filtrarUsuarios(e) {
        e.preventDefault();
        if (this.state.paginaUno) {
            var cambio = {
                target: {
                    id: 'paginaActual',
                    value: 1
                }
            };
            this.onChangeBusqueda(cambio);
        }
        this.props.fetchUsuarios();
    }

    /**
     * Cambia los filtros a aplicar, si cambia un filtro que no sea la paginación
     * vuelve a la página inicial.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    onChangeBusqueda(e) {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        if (e.target.id !== "paginaActual") {
            this.setState({ paginaUno: true })
        } else {
            this.setState({ paginaUno: false })
        }
        this.props.updateFiltros(cambio);
    }

    /**
    * Cambia la página del filtro de paginación.
    * 
    * @param {Number} pagina 
    * @returns 
    */
    cambiarDePagina(pagina) {
        if (isNaN(pagina)) {
            return;
        }

        let cambio = {};
        cambio['paginaActual'] = pagina;
        this.props.updateFiltros(cambio);
    }

    render() {
        const buscando = this.props.usuarios.byId.isFetching;
        const filtros = this.props.usuarios.byId.filtros;
        const totalCero = this.props.usuarios.byId.total == 0;
        const registros = this.props.usuarios.byId.registros;
        let Usuarios = [];
        if (totalCero) {
            Usuarios =
                <tr className="text-center">
                    <td colSpan="7">No hay usuarios cargados</td>
                </tr>;
        } else if (this.props.usuarios.allIds.length === 0) {
            Usuarios =
                <tr className="text-center">
                    <td colSpan={12}>No hay usuarios para los filtros aplicados.</td>
                </tr>;
        }
        this.props.usuarios.allIds.map(idUsuario => {
            let usuario = this.props.usuarios.byId.usuarios[idUsuario];
            if (usuario && usuario.id) {
                let roles = this.getRolesUsuario(usuario);
                let operaciones = this.getOperacionesUsuario(usuario);
                Usuarios.push(
                    <tr key={usuario.id}>
                        <td>{usuario.first_name}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.dni}</td>
                        <td>{roles}</td>
                        <td><span className={usuario.habilitado_clase}>{usuario.habilitado_texto}</span></td>
                        <td>{usuario.observaciones}</td>
                        <td>{operaciones}</td>
                    </tr>
                );
            }
        });
        const Cargando =
            <tr>
                <td colSpan={7}><Loader display={true} /></td>
            </tr>;
        return (
            <div className="tabla-listado">
                <div className="table-responsive tarjeta-body listado">
                    <div className="d-flex justify-content-between">
                        <Titulo ruta={rutas.GESTION} titulo={"Usuarios"} clase="tabla-listado-titulo" />
                        <a href="#"
                            onClick={() => this.redirigirListado()}
                            data-toggle="tooltip" data-original-title="" title="">
                            <AddBoxIcon style={{ color: '#5cb860' }} />
                        </a>
                    </div>
                    <Filtros
                        {...this.props}
                        filtrar={(e) => this.filtrarUsuarios(e)}
                        onChangeBusqueda={(e) => this.onChangeBusqueda(e)}
                    />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Dni</th>
                                <th>Roles</th>
                                <th>Estado</th>
                                <th>Observaciones</th>
                                <th>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buscando ? Cargando : Usuarios}
                        </tbody>
                    </table>
                    {
                        buscando || totalCero ?
                            ''
                            :
                            <Paginacion
                                activePage={filtros.paginaActual}
                                itemsCountPerPage={filtros.registrosPorPagina}
                                totalItemsCount={registros}
                                pageRangeDisplayed={5}
                                onChange={(e) => this.cambiarDePagina(e)}
                            />
                    }
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
        saveDeleteUsuario: (id, motivo) => {
            dispatch(saveDeleteUsuario(id, motivo))
        },
        saveUpdateUsuario: (habilitar) => {
            dispatch(saveUpdateUsuario(habilitar))
        },
        updateUsuario: (usuario) => {
            dispatch(updateUsuario(usuario))
        },
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));