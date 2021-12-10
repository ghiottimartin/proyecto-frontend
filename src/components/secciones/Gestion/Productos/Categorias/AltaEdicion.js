import React from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';

//Actions  
import {createCategoria, saveCreateCategoria, updateCategoria, saveUpdateCategoria, fetchCategoriaById, resetCreateCategoria, fetchCategorias, resetCategorias} from '../../../../../actions/CategoriaActions'


//Constants
import * as rutas from '../../../../../constants/rutas.js';

//Boostrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//Components
import Loader from "../../../../elementos/Loader";
import Titulo from "../../../../elementos/Titulo";

//CSS
import '../../../../../assets/css/Productos/Categoria.css';

//Librerías
import Swal from 'sweetalert2';
import { similarity, quitarAcentos } from "../../../../../utils/cadenas";

class AltaEdicion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if (id) {
            this.props.fetchCategoriaById(id);
        }

        this.props.resetCategorias();
        this.props.fetchCategorias();
    }

    componentWillUnmount() {
        this.props.resetCreateCategoria();
    }

    onChangeCategoria(e) {
        var cambio          = {};
        cambio[e.target.id] = e.target.value;
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            this.props.createCategoria(cambio);
        }
        if (accion === rutas.ACCION_EDITAR) {
            this.props.updateCategoria(cambio);
        }

    }

    /**
     * Comprueba que existan categorías con nombres similares al que se intenta crear.
     * 
     * @returns Boolean
     */
    comprobarGuardarConCategoriasSimilares() {
        let exacta = false;
        const idEdicion = parseInt(this.props.match.params.id);
        const categoriaAltaEdicion = this.getCategoriaAltaEdicion();
        const nombreNuevo = categoriaAltaEdicion.nombre;

        let existentes = [];
        this.props.categorias.allIds.map(id => {
            const categoria = this.props.categorias.byId.categorias[id];
            const nombreActual = categoria.nombre;
            const idActual = categoria.id;
            if (categoria && idActual && nombreActual && idActual !== idEdicion) {
                let actualSinAcentos = quitarAcentos(nombreActual);
                let nuevaSinAcentos = quitarAcentos(nombreNuevo);
                var indice = similarity(actualSinAcentos, nuevaSinAcentos);
                if (indice > 0.4) {
                    existentes.push(nombreActual);
                }
                if (nuevaSinAcentos === actualSinAcentos) {
                    exacta = true;
                }
            }
        })

        if (exacta) {
            Swal.fire({
                title: 'Ya existe una categoría con ese nombre.',
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: true,
                confirmButtonText: 'Continuar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            });
            return false;
        }
        
        if (existentes.length > 0) {
            const nombres = existentes.join(", ");
            let title = "Existen categorías similares a las que intenta crear. ¿Está seguro de continuar?";
            let text = `Los nombres son: ${nombres}`;
            Swal.fire({
                title: title,
                text: text,
                icon: 'question',
                showCloseButton: true,
                showCancelButton: !exacta,
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.guardar();
                } else {
                    return false;
                }
            });
        }

        return existentes.length === 0;
    }

    /**
     * Guarda la categoría actual, ya sea alta o edición.
     */
    guardarConValidacion() {
        let guardarSimilares =  this.comprobarGuardarConCategoriasSimilares();
        if (!guardarSimilares) {
            return;
        }
        this.guardar();
    }

    guardar() {
        let linkVolver = rutas.getQuery('volverA');
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            this.props.saveCreateCategoria(linkVolver);
        }
        if (accion === rutas.ACCION_EDITAR) {
            this.props.saveUpdateCategoria(linkVolver);
        }
    }

    submitForm(e) {
        e.preventDefault();
        this.guardarConValidacion(true);
    }

    getCategoriaAltaEdicion() {
        let categoria = {};
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            categoria = this.props.categorias.create.nuevo;
        } else {
            categoria = this.props.categorias.update.activo;
        }
        return categoria;
    }

    render() {
        const {botonVolverA, volverAValido} = this.state;
        const categoria = this.getCategoriaAltaEdicion();
        let accion = this.props.match.params['accion'];
        let titulo = "Nueva categoria";
        const edicion = accion === rutas.ACCION_EDITAR;
        if (edicion) {
            titulo = "Editar categoria";
        }

        let buscando = this.props.categorias.byId.isFetching;
        let creando = this.props.categorias.byId.isCreating;
        let volverA = rutas.getQuery("volverA")
        if (edicion || !volverA || volverA === "") {
            volverA = rutas.CATEGORIAS_LISTAR_ADMIN
        }
        return (
            <div className="categoria-alta">
                <Form className="tarjeta-body" onSubmit={(e) => {this.submitForm(e)}}>
                    <Titulo ruta={volverA} titulo={titulo} />
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            id="nombre"
                            type="nombre"
                            onChange={(e) => this.onChangeCategoria(e)}
                            disabled={buscando}
                            value={categoria.nombre}
                            placeholder="Ingresar nombre"
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            id="descripcion"
                            as="textarea"
                            maxLength={250}
                            rows={3}
                            disabled={buscando}
                            onChange={(e) => this.onChangeCategoria(e)}
                            value={categoria.descripcion}
                            placeholder="Ingresar descripción"
                        />
                    </Form.Group>
                    {
                        creando || buscando ?
                            <Loader display={true}/>
                            :
                            <div className="d-flex">
                                <Button className="boton-submit" variant="success" type="submit" disabled={buscando}>
                                    Guardar
                                </Button>
                                {volverAValido ? botonVolverA : ""}
                            </div>
                    }
                </Form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        categorias: state.categorias,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        createCategoria: (categoria) => {
            dispatch(createCategoria(categoria))
        },
        updateCategoria: (categoria) => {
            dispatch(updateCategoria(categoria))
        },
        saveCreateCategoria: (volverA) => {
            dispatch(saveCreateCategoria(volverA))
        },
        saveUpdateCategoria: () => {
            dispatch(saveUpdateCategoria())
        },
        fetchCategoriaById: (id) => {
            dispatch(fetchCategoriaById(id))
        },
        resetCreateCategoria: () => {
            dispatch(resetCreateCategoria())
        },
        fetchCategorias: () => {
            dispatch(fetchCategorias())
        },
        resetCategorias: () => {
            dispatch(resetCategorias())
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AltaEdicion));
