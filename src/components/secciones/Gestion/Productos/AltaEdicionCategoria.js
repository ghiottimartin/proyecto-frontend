import React from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';

//Actions  
import {createCategoria, saveCreateCategoria, updateCategoria, saveUpdateCategoria, fetchCategoriaById} from '../../../../actions/CategoriaActions'


//Constants
import * as rutas from '../../../../constants/rutas.js';

//Boostrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//Components
import Loader from "../../../elementos/Loader";
import Titulo from "../../../elementos/Titulo";

//CSS
import '../../../../assets/css/Productos/Categoria.css';

class AltaEdicionCategoria extends React.Component {
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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        

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


    submitForm(e) {
        e.preventDefault();
        let linkVolver = rutas.getQuery('volverA');
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            this.props.saveCreateCategoria(linkVolver);
        }
        if (accion === rutas.ACCION_EDITAR) {
            this.props.saveUpdateCategoria(linkVolver);
        }

    }

    render() {
        const {botonVolverA, volverAValido} = this.state;
        let categoria = {};
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            categoria = this.props.categorias.create.nuevo;
        }
        let titulo = "Nueva categoria";
        if (accion === rutas.ACCION_EDITAR) {
            titulo = "Editar categoria";
            categoria = this.props.categorias.update.activo;
        }


        let buscando = this.props.categorias.byId.isFetching;
        
        let ruta = rutas.PRODUCTO_ALTA;
        let volverA = rutas.getQuery('volverA');
        if (volverA) {
            ruta = volverA;
        }

        return (
            <div className="categoria-alta">
                <Form className="tarjeta-body" onSubmit={(e) => {this.submitForm(e)}}>
                    <Titulo ruta={ruta} titulo={titulo}/>
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            id="nombre"
                            type="nombre"
                            onChange={(e) => this.onChangeCategoria(e)}
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
                            rows={3}
                            onChange={(e) => this.onChangeCategoria(e)}
                            value={categoria.descripcion}
                            placeholder="Ingresar descripción"
                        />
                    </Form.Group>
                    {
                        this.props.categorias.create.isCreating ?
                            <Loader display={true}/>
                            :
                            <div className="d-flex">
                                <Button className="boton-submit" variant="primary" type="submit" disabled={buscando}>
                                    Guardar categoria
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
        saveUpdateCategoria: (volverA) => {
            dispatch(saveUpdateCategoria(volverA))
        },
        fetchCategoriaById: (id) => {
            dispatch(fetchCategoriaById(id))
        },    

    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AltaEdicionCategoria));
