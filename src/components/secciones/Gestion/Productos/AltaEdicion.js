import React from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';

//Actions
import {createProducto, updateProducto, saveCreateProducto, saveUpdateProducto} from "../../../../actions/ProductoActions";
import {fetchCategorias} from "../../../../actions/CategoriaActions";

//Constants
import * as rutas from '../../../../constants/rutas.js';

//Boostrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//Components
import ArchivoImagen from "../../../elementos/ArchivoImagen";
import Loader from "../../../elementos/Loader";

//CSS
import '../../../../assets/css/Productos/AltaEdicion.css';

//Librerias
import history from "../../../../history";
import Swal from 'sweetalert2';

//Imagenes
import emptyImg from "../../../../assets/img/emptyImg.jpg";
import c from "../../../../constants/constants";

class AltaEdicion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagen: emptyImg,
            botonVolverA:  '',
            volverAValido: false
        };
    }

    componentDidMount() {
        this.actualizarBotonVolverA();
        this.props.fetchCategorias();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let logueado = this.props.usuarios.update.activo;
        if (logueado === undefined || (logueado.id && !logueado.esAdmin)) {
            history.push(rutas.INICIO);
        }
        let id     = this.props.match.params['id'];
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_EDITAR && prevProps.productos.allIds.length === 0 && this.props.productos.allIds.length > 0) {
            let producto = this.props.productos.byId.productos[id];
            if (producto !== undefined) {
                this.props.updateProducto(producto);
            }
        }
    }

    actualizarBotonVolverA() {
        const volverA    = rutas.getQuery('volverA');
        const valido     = rutas.validarRuta(volverA);
        let botonVolverA = "";
        if (valido) {
            botonVolverA =
                <button className="boton-submit btn btn-light" onClick={() => history.push(volverA)} title="Volver">
                    Volver
                </button>;
        }
        this.setState({ botonVolverA: botonVolverA, volverAValido: valido });
    }

    onChangeProducto(e, imagen) {
        var cambio          = {};
        cambio[e.target.id] = e.target.value;
        if (imagen) {
            cambio = imagen;
        }
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            this.props.createProducto(cambio);
        }
        if (accion === rutas.ACCION_EDITAR) {
            this.props.updateProducto(cambio);
        }

    }

    changeImagen(e) {
        let archivo = e.target.files.length > 0 ? e.target.files[0] : null;
        if (archivo === null) {
            return;
        }
        let imagen = URL.createObjectURL(archivo);
        if (e.target.id === 'imagen')
            this.setState({ imagen: imagen});

        var file = e.target.files[0];
        var reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        }
        var cambio = {};
        cambio[e.target.id] = file;
        cambio["fileImagen"] = file.name;
        this.onChangeProducto(e, cambio);
    }

    submitForm(e) {
        e.preventDefault();
        let linkVolver = rutas.getQuery('volverA');
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            this.props.saveCreateProducto(linkVolver);
        }
        if (accion === rutas.ACCION_EDITAR) {
            this.props.saveUpdateProducto(linkVolver);
        }

    }

    render() {
        const {botonVolverA, volverAValido} = this.state;
        let producto = {};
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            producto = this.props.productos.create.nuevo;
        }
        let path   = this.state.imagen;
        let titulo = "Nuevo producto";
        if (accion === rutas.ACCION_EDITAR) {
            titulo = "Editar producto";
            producto = this.props.productos.update.activo;
            if (this.state.imagen === emptyImg) {
                try {
                    path = c.BASE_PUBLIC + "img/productos/" + producto.imagen;
                } catch (e) {
                }
            }
        }


        var opcionesCategoria = this.props.categorias.allIds.map((key) => {
            var categoria = this.props.categorias.byId.categorias[key];
            if (categoria !== undefined && categoria.id) {
                return (
                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                )
            }

        });

        let buscando = this.props.categorias.byId.isFetching;

        return (
            <div className="producto-alta">
                <Form className="tarjeta-body" onSubmit={(e) => {this.submitForm(e)}}>
                    <h4>{titulo}</h4>
                    <Form.Group>
                        <Form.Label>Categoría</Form.Label>
                        <div className="d-flex">
                            <Form.Control
                                id="categoria_id"
                                as="select"
                                defaultValue=""
                                onChange={(e) => this.onChangeProducto(e)}
                                value={producto.categoria_id}
                                required={true}
                                disabled={buscando}
                            >
                                <option key={0} value="">Seleccionar categoría</option>
                                {opcionesCategoria}
                            </Form.Control>
                            <Button variant="success" onClick={()=> history.push("/categorias/alta/")}> 
                            +
                            </Button>
                         </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            id="nombre"
                            type="nombre"
                            onChange={(e) => this.onChangeProducto(e)}
                            value={producto.nombre}
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
                            onChange={(e) => this.onChangeProducto(e)}
                            value={producto.descripcion}
                            placeholder="Ingresar descripción"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                            id="precioVigente"
                            type="number"
                            min={0}
                            onChange={(e) => this.onChangeProducto(e)}
                            value={producto.precioVigente}
                            placeholder="Ingresar precio"
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Imagen</Form.Label>
                        <ArchivoImagen
                            id="imagen"
                            imagen={path}
                            imgError={emptyImg}
                            texto={producto && producto.fileImagen ? producto.fileImagen : ""}
                            changeImagen={(evento) => this.changeImagen(evento)}
                        />
                        <Form.Text className="text-muted">
                            La imagen tiene que ser nítida y estar centrada.
                        </Form.Text>
                    </Form.Group>
                    {
                        this.props.productos.create.isCreating || this.props.productos.update.isUpdating ?
                            <Loader display={true}/>
                            :
                            <div className="d-flex">
                                <Button className="boton-submit" variant="primary" type="submit" disabled={buscando}>
                                    Guardar producto
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
        productos: state.productos,
        usuarios: state.usuarios,
        categorias: state.categorias,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        createProducto: (producto) => {
            dispatch(createProducto(producto))
        },
        updateProducto: (producto) => {
            dispatch(updateProducto(producto))
        },
        saveCreateProducto: (volverA) => {
            dispatch(saveCreateProducto(volverA))
        },
        saveUpdateProducto: (volverA) => {
            dispatch(saveUpdateProducto(volverA))
        },
        fetchCategorias: () => {
            dispatch(fetchCategorias())
        }

    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AltaEdicion));