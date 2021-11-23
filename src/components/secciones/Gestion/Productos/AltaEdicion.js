import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

//Actions
import { createProducto, updateProducto, saveCreateProducto, saveUpdateProducto, fetchProductoById } from "../../../../actions/ProductoActions";
import { fetchCategorias } from "../../../../actions/CategoriaActions";

//Constants
import * as rutas from '../../../../constants/rutas.js';

//Boostrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//Components
import ArchivoImagen from "../../../elementos/ArchivoImagen";
import Loader from "../../../elementos/Loader";
import Titulo from "../../../elementos/Titulo";

//CSS
import '../../../../assets/css/Productos/AltaEdicion.css';

//Librerias
import history from "../../../../history";
import Swal from 'sweetalert2';

//Imagenes
import emptyImg from "../../../../assets/img/emptyImg.jpg";

//Utils
import { similarity, quitarAcentos } from "../../../../utils/cadenas";

class AltaEdicion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagen: emptyImg,
            botonVolverA: '',
            volverAValido: false
        };
    }

    componentDidMount() {
        this.actualizarBotonVolverA();
        this.props.fetchCategorias();
        let id = this.props.match.params.id;
        if (id) {
            this.props.fetchProductoById(id);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let logueado = this.props.usuarios.update.logueado;
        if (logueado === undefined || (logueado.id && !logueado.esAdmin)) {
            history.push(rutas.INICIO);
            Swal.fire({
                title: `No está autorizado para editar productos. `,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: true,
                confirmButtonText: 'Continuar',
            })

        }
    }

    actualizarBotonVolverA() {
        const volverA = rutas.getQuery('volverA');
        const valido = rutas.validarRuta(volverA);
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
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        if (imagen) {
            cambio = imagen;
        }
        let accion = this.props.match.params['accion'];

        const producto = this.getProductoAltaEdicion()
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
            this.setState({ imagen: imagen });

        var file = e.target.files[0];
        var reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        }
        var cambio = {};
        cambio[e.target.id] = file;
        cambio["imagen_nombre"] = file.name;
        this.onChangeProducto(e, cambio);
    }

    onChangeCheckbox(id) {
        var cambio = {};
        var valor = true;

        let producto = this.getProductoAltaEdicion()
        switch (id) {
            case 'compra_directa':
                if (producto.compra_directa) {
                    valor = false;
                }
                break;

            case 'venta_directa':
                if (producto.venta_directa) {
                    valor = false;
                }
                break;

        }
        cambio[id] = valor;
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            this.props.createProducto(cambio);
        }
        if (accion === rutas.ACCION_EDITAR) {
            this.props.updateProducto(cambio);
        }
    }

    /**
     * Devuelve el producto a crear o editar dependiendo de la ruta.
     * 
     * @returns Object
     */
    getProductoAltaEdicion() {
        let producto = {};
        let accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            producto = this.props.productos.create.nuevo;
        } else {
            producto = this.props.productos.update.activo;
        }
        return producto;
    }

    /**
     * Comprueba si existen nombre similares al que se intenta editar o crear, en caso de que existan
     * se alerta al usuario y consulta sobre si desea guardar o anular.
     * 
     * @returns Boolean
     */
    comprobarGuardarConProductosSimilares() {
        let exacta = false;
        const idEdicion = parseInt(this.props.match.params.id);
        const productoAltaEdicion = this.getProductoAltaEdicion();
        const nombreNuevo = productoAltaEdicion.nombre;

        let existentes = [];
        this.props.productos.allIds.map(id => {
            const producto = this.props.productos.byId.productos[id];
            const nombreActual = producto.nombre;
            const idActual = producto.id;
            if (producto && idActual && nombreActual && idActual !== idEdicion) {
                const nombreActual = producto.nombre;
                let actualSinAcentos = quitarAcentos(nombreActual);
                let nuevaSinAcentos = quitarAcentos(nombreNuevo);
                var indice = similarity(actualSinAcentos, nuevaSinAcentos);
                console.log(`Porcentaje de similitud entre '${actualSinAcentos}' y '${nuevaSinAcentos}': ${indice} `)
                if (indice > 0.6) {
                    existentes.push(nombreActual);
                }
                if (nuevaSinAcentos === actualSinAcentos) {
                    exacta = true;
                }
            }
        })

        if (exacta) {
            Swal.fire({
                title: 'Ya existe un producto con ese nombre.',
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

        const linkVolver = rutas.getQuery('volverA');
        if (existentes.length > 0) {
            const nombres = existentes.join(", ");
            Swal.fire({
                title: `Existen productos similares al que intenta crear. ¿Está seguro de continuar?`,
                text: `Los nombres son: ${nombres}`,
                icon: 'question',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.props.saveCreateProducto(linkVolver);
                } else {
                    return false;
                }
            });
        }

        return existentes.length === 0;
    }

    /**
     * Comprueba que los datos del producto sean válidos.
     * 
     * @returns Boolean
     */
    comprobarProductoValido() {
        let errores = [];
        const producto = this.getProductoAltaEdicion();
        const costo = producto.costo_vigente;
        if (isNaN(costo) || parseFloat(costo) <= 0.00) {
            errores.push("El costo del producto debe ser mayor o igual a cero.");
        }

        const precio = producto.precio_vigente;
        if (isNaN(precio) || parseFloat(precio) <= 0.00) {
            errores.push("El precio del producto debe ser mayor o igual a cero.");
        }

        if (!isNaN(costo) && !isNaN(precio) && parseFloat(costo) >= parseFloat(precio)) {
            errores.push("El precio del producto debe ser mayor al costo del mismo.");
        }

        if (errores.length > 0) {
            let texto = `<p className="text-left">${errores.join("<br/>")}</p>`;
            Swal.fire({
                title: `Hubo un error al crear el producto`,
                html: texto,
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText: 'Continaur',
                confirmButtonColor: 'rgb(88, 219, 131)',
            })
        }
        return errores.length === 0;
    }

    /**
     * Guarda el producto.
     * 
     * @param {SyntheticBaseEvent} e 
     * @returns 
     */
    guardarAltaEdicion(e) {
        e.preventDefault();
        let linkVolver = rutas.getQuery('volverA');
        let accion = this.props.match.params['accion'];

        let valido = this.comprobarProductoValido();
        if (!valido) {
            return;
        }

        let guardar = this.comprobarGuardarConProductosSimilares();
        if (!guardar) {
            return;
        }

        if (accion === rutas.ACCION_ALTA) {
            this.props.saveCreateProducto(linkVolver);
        }
        if (accion === rutas.ACCION_EDITAR) {
            this.props.saveUpdateProducto(linkVolver);
        }

    }

    render() {
        const { botonVolverA, volverAValido } = this.state;
        let producto = {};
        const accion = this.props.match.params['accion'];
        if (accion === rutas.ACCION_ALTA) {
            producto = this.props.productos.create.nuevo;
        }
        let path = this.state.imagen;
        let titulo = "Nuevo producto";
        const esEdicion = accion === rutas.ACCION_EDITAR
        if (esEdicion) {
            titulo = "Editar producto";
            producto = this.props.productos.update.activo;
            if (this.state.imagen === emptyImg) {
                try {
                    path = producto.imagen;
                } catch (e) {
                }
            }
        }


        const opcionesCategoria = this.props.categorias.allIds.map((key) => {
            var categoria = this.props.categorias.byId.categorias[key];
            if (categoria !== undefined && categoria.id) {
                return (
                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                )
            }

        });

        const buscando = this.props.categorias.byId.isFetching;
        const rutaCategoria = rutas.CATEGORIA_ALTA + '?volverA=' + rutas.PRODUCTO_ALTA;
        const stockDeshabilitado = producto.compra_directa && esEdicion;
        return (
            <div className="producto-alta">
                <Form className="tarjeta-body" onSubmit={(e) => { this.guardarAltaEdicion(e) }}>
                    <Titulo ruta={rutas.PRODUCTOS_LISTAR_ADMIN} titulo={titulo} />
                    <Form.Group>
                        <Form.Label>Categoría</Form.Label>
                        <div className="d-flex">
                            <Form.Control
                                id="categoria"
                                as="select"
                                defaultValue=""
                                onChange={(e) => this.onChangeProducto(e)}
                                value={producto.categoria}
                                required={true}
                                disabled={buscando}
                            >
                                <option key={0} value="">Seleccionar categoría</option>
                                {opcionesCategoria}
                            </Form.Control>
                            <Button variant="success" onClick={() => history.push(rutaCategoria)}>
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
                    <div className="form-check my-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={producto.compra_directa ? producto.compra_directa : false}
                            id="compra_directa"
                            onClick={() => this.onChangeCheckbox('compra_directa')}
                            onChange={() => { }}
                        />
                        <label className="form-check-label" htmlFor="compra_directa">
                            Compra directa
                        </label>
                    </div>
                    <div className="form-check my-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={producto.venta_directa ? producto.venta_directa : false}
                            id="venta_directa"
                            onClick={() => this.onChangeCheckbox('venta_directa')}
                            onChange={() => { }}
                        />
                        <label className="form-check-label" htmlFor="venta_directa">
                            Venta directa
                        </label>
                    </div>
                    <Form.Group>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            id="stock"
                            type="number"
                            min={0}
                            disabled={stockDeshabilitado}
                            onChange={(e) => this.onChangeProducto(e)}
                            value={producto.stock ? producto.stock : 0}
                            placeholder="Ingresar stock"
                            required={true}
                        />
                        <Form.Text className="text-muted" style={{ display: esEdicion ? "block" : "none" }}>
                            El stock sólo es editable si el producto no es de compra directa.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Alerta de stock</Form.Label>
                        <Form.Control
                            id="stock_seguridad"
                            type="number"
                            min={0}
                            onChange={(e) => this.onChangeProducto(e)}
                            value={producto.stock_seguridad ? producto.stock_seguridad : 0}
                            placeholder="Ingresar stock"
                            required={true}
                        />
                        <Form.Text id="stock_seguridad" muted>
                            Cantidad de alerta sobre faltante de stock
                        </Form.Text>
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
                        <Form.Label>Costo</Form.Label>
                        <Form.Control
                            id="costo_vigente"
                            type="number"
                            min={0}
                            onChange={(e) => this.onChangeProducto(e)}
                            value={producto.costo_vigente}
                            placeholder="Ingresar costo"
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                            id="precio_vigente"
                            type="number"
                            min={0}
                            onChange={(e) => this.onChangeProducto(e)}
                            value={producto.precio_vigente}
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
                            texto={producto && producto.imagen_nombre ? producto.imagen_nombre : ""}
                            changeImagen={(evento) => this.changeImagen(evento)}
                        />
                        <Form.Text className="text-muted">
                            La imagen tiene que ser nítida y estar centrada.
                        </Form.Text>
                    </Form.Group>
                    {
                        this.props.productos.create.isCreating || this.props.productos.update.isUpdating ?
                            <Loader display={true} />
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
        },
        fetchProductoById: (id) => {
            dispatch(fetchProductoById(id))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AltaEdicion));