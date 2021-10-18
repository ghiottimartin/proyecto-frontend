import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { resetFiltros } from "../../../../actions/ProductoActions";
import { fetchCategorias } from "../../../../actions/CategoriaActions";

//Boostrap
import Form from "react-bootstrap/Form";

//CSS
import '../../../../assets/css/Filtros.css';

function Filtros(props) {

    useEffect(() => {
        props.resetFiltros()
        props.fetchCategorias()
    }, [])

    const changeFiltros = (e) => {
        props.onChangeBusqueda(e);
    }

    let categorias = [<option key={0} value={0}>Todas</option>]
    props.categorias.allIds.map(id => {
        const categoria = props.categorias.byId.categorias[id]
        if (categoria && categoria.id) {
            categorias.push(
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            )
        }
    })

    let tipos = [
        <option key={0} value={""}>Indistinto</option>,
        <option key={1} value={"compra"}>Compra directa</option>,
        <option key={2} value={"venta"}>Venta directa</option>
    ]

    const filtros = props.productos.byId.filtros
    return (
        <div className="filtros">
            <h4>Filtrado</h4>
            <Form onSubmit={(e) => props.filtrar(e)}>
                <div className="form-filtros">
                    <div className="contenedor-filtros">
                        <div className="filter-by text-nowrap">
                            <Form.Group>
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control
                                    id="nombre"
                                    type="text"
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.nombre ? filtros.nombre : ""}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Categoría:</Form.Label>
                                <Form.Control
                                    id="categoria"
                                    as="select"
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.categoria ? filtros.categoria : ""}
                                >
                                    {categorias}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Tipo:</Form.Label>
                                <Form.Control
                                    id="tipo"
                                    as="select"
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.tipo ? filtros.tipo : ""}
                                >
                                    {tipos}
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-sm btn-info m-0 waves-effect waves-light waves-float boton-filtrar">
                    <span className="fa fa-filter"></span> Filtrar
                </button>
            </Form>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        productos: state.productos,
        categorias: state.categorias,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetFiltros: () => {
            dispatch(resetFiltros())
        },
        fetchCategorias: () => {
            dispatch(fetchCategorias())
        },
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Filtros));