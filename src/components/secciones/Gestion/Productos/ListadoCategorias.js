import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Actions
import {resetCategorias, fetchCategoriasIfNeeded, saveDeleteCategoria, updateCategoria} from "../../../../actions/CategoriaActions";

//Constants
import * as rutas from "../../../../constants/rutas";

//Librerias
import history from "../../../../history";

//Imagenes
import tacho from "../../../../assets/icon/delete.png";
import lapiz from "../../../../assets/icon/pencil.png";
import Swal from "sweetalert2";
import Loader from "../../../elementos/Loader";
import Titulo from "../../../elementos/Titulo";

class ListadoCategorias extends React.Component {
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

    clickEditar(categoria) {
        let id         = categoria.id;
        let rutaEditar = rutas.getUrl(rutas.CATEGORIAS, id, rutas.ACCION_EDITAR, '', rutas.CATEGORIAS_LISTAR);
        this.props.updateCategoria(categoria);
        history.push(rutaEditar);
    }

    getOperacionesCategoria(categoria) {
        return (
            <div>
                <p onClick={() => this.clickEditar(categoria)} title="Editar "
                   className="operacion">
                    <img src={lapiz} className="icono-operacion" alt="Editar categoria"/>
                    Editar
                </p>
                <p onClick={() => this.modalBorrar(categoria)} title="Borrar"
                   className="operacion">
                    <img src={tacho} className="icono-operacion" alt="Borrar categoria"/>
                    Borrar
                </p>
            </div>
        );
    }

    modalBorrar(categoria) {
        Swal.fire({
            title: `Está seguro de borrar la categoria '${categoria.nombre}'`,
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
                    <td colSpan="5">No hay categorias cargadas</td>
                </tr>;
        }
        this.props.categorias.allIds.map(idCategoria => {
            let categoria = this.props.categorias.byId.categorias[idCategoria];
            if (categoria && categoria.id) {
                let operaciones = this.getOperacionesCategoria(categoria);
          
                Categorias.push(
                    <tr key={categoria.id}>
                    
                        <td>{categoria.nombre}</td>
                        <td>{categoria.descripcion}</td>
                        <td>{operaciones}</td>
                    </tr>
                );
            }
        });
        const Cargando =
            <tr>
                <td colSpan={3}><Loader display={true} /></td>
            </tr>;
        return (
            <div className="tabla-listado">
                <div className="table-responsive tarjeta-body listado">
                    <div className="d-flex justify-content-between">
                        <Titulo ruta={rutas.PRODUCTOS_LISTAR_ADMIN} titulo={"Categorias"} clase="tabla-listado-titulo" />
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListadoCategorias));