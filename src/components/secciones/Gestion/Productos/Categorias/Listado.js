import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Actions
import {resetCategorias, fetchCategoriasIfNeeded, saveDeleteCategoria, updateCategoria} from "../../../../../actions/CategoriaActions";

//Constants
import * as rutas from "../../../../../constants/rutas";

//Componentes
import AddBoxIcon from "@material-ui/icons/AddBox"

//Imagenes
import Loader from "../../../../elementos/Loader";
import Titulo from "../../../../elementos/Titulo";

//Librerias
import history from "../../../../../history";
import Swal from "sweetalert2";

class Listado extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buscando:       true,
            noHayCategorias: false
        }
    }

    componentDidMount() {
        this.props.resetCategorias();
        this.props.fetchCategoriasIfNeeded();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let allIds       = this.props.categorias.allIds;
        let borrados     = this.props.categorias.delete;
        let categorias    = this.props.categorias.byId;
        let preCategorias = prevProps.categorias.byId;
        let sinIds       = allIds.length === 0;
        if (sinIds && ((preCategorias.isFetching && !categorias.isFetching) || (!borrados.isDeleting && prevProps.categorias.delete.isDeleting))) {
            this.setState({
                noHayCategorias: true,
            })
        }
        if (preCategorias.isFetching && !categorias.isFetching) {
            this.setState({
                buscando: false,
            })
        }
    }

    /**
     * Redirige a la edición de la categoría.
     * 
     * @param {Object} categoria 
     */
    editarCategoria(categoria) {
        let id         = categoria.id;
        let rutaEditar = rutas.getUrl(rutas.CATEGORIAS, id, rutas.ACCION_EDITAR, '', rutas.CATEGORIAS_LISTAR);
        this.props.updateCategoria(categoria);
        history.push(rutaEditar);
    }

    /**
     * Devuelve las operaciones de la categorías.
     * 
     * @param {Object} categoria 
     * @returns 
     */
    getOperacionesCategoria(categoria) {
        let operaciones = [];
        categoria.operaciones.forEach(operacion => {
            let accion = operacion.accion;
            operaciones.push(
                <div key={operacion.key} title={operacion.title} onClick={() => this.ejecutarOperacion(categoria, accion)} className={operacion.clase + " operacion"} >
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
     * Ejecuta la operación del listado de categorías según el caso.
     * 
     * @param {Object} categoria 
     * @param {String} accion 
     */
     ejecutarOperacion(categoria, accion) {
        switch (accion) {
            case 'editar':
                this.editarCategoria(categoria);
                break;
            
            case 'borrar':
                this.borrarCategoria(categoria);
                break;
            
        }
    }

    borrarCategoria(categoria) {
        Swal.fire({
            title: `¿Está seguro de borrar la categoria '${categoria.nombre}'?`,
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'rgb(88, 219, 131)',
            cancelButtonColor: '#bfbfbf',
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.saveDeleteCategoria(categoria.id);
            }
        })
    }

    render() {
        const { noHayCategorias, buscando } = this.state;
        let Categorias = [];
        if (noHayCategorias) {
            Categorias =
                <tr className="text-center">
                    <td colSpan="4">No hay categorias cargadas</td>
                </tr>;
        }
        this.props.categorias.allIds.map(idCategoria => {
            let categoria = this.props.categorias.byId.categorias[idCategoria];
            if (categoria && categoria.id) {
                let operaciones = this.getOperacionesCategoria(categoria);
          
                Categorias.push(
                    <tr key={categoria.id}>
                        <td>{categoria.id_texto}</td>
                        <td>{categoria.nombre}</td>
                        <td className="texto-una-linea">{categoria.descripcion}</td>
                        <td>{operaciones}</td>
                    </tr>
                );
            }
        });
        const Cargando =
            <tr>
                <td colSpan={4}><Loader display={true} /></td>
            </tr>;
        return (
            <div className="tabla-listado">
                <div className="table-responsive tarjeta-body listado">
                    <div className="d-flex PRODUCTOS_LISTAR_ADMIN-content-between">
                        <Titulo ruta={rutas.PRODUCTOS_LISTAR_ADMIN} titulo={"Categorias"} clase="tabla-listado-titulo"/>
                        <a href="#"
                            onClick={() => history.push(rutas.CATEGORIA_ALTA + "?volverA=" + rutas.CATEGORIAS_LISTAR_ADMIN)}
                            data-toggle="tooltip" data-original-title="" title="">
                            <AddBoxIcon style={{ color:  '#5cb860'}}/>
                        </a>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        {buscando ? Cargando : Categorias}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        categorias: state.categorias
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetCategorias: () => {
            dispatch(resetCategorias())
        },
        fetchCategoriasIfNeeded: () => {
            dispatch(fetchCategoriasIfNeeded())
        },
        saveDeleteCategoria: (id) => {
            dispatch(saveDeleteCategoria(id))
        },
        updateCategoria: (categoria) => {
            dispatch(updateCategoria(categoria))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));