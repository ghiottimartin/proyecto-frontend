import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { resetFiltros } from "../../../../actions/UsuarioActions";

//Boostrap
import Form from "react-bootstrap/Form";

function Filtros(props) {
    const filtros = props.usuarios.byId.filtros
    const resetFiltros = props.usuarios.byId.filtros.resetFiltros

    useEffect(() => {
        if (resetFiltros) {
            props.resetFiltros()
        }
    }, [resetFiltros])

    /**
     * Cambia los filtros a aplicar.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const changeFiltros = (e) => {
        props.onChangeBusqueda(e)
    }

    const logueado = props.usuarios.update.logueado;
    const esAdmin = logueado && logueado.esAdmin ? logueado.esAdmin : false;

    return (
        <div className="filtros">
            <h4>Filtrado</h4>
            <Form onSubmit={(e) => props.filtrar(e)}>
                <div className="form-filtros">
                    <div className="contenedor-filtros">
                        <div className="filter-by text-nowrap">
                            <Form.Group style={{display: esAdmin ? 'block' : 'none'}}>
                                <Form.Label>Rol:</Form.Label>
                                <Form.Control
                                    id="rol"
                                    as="select"
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.rol ? filtros.rol : ""}
                                >
                                    <option key={0} value="">Todos</option>
                                    <option key={1} value="mozo">Mozo</option>
                                    <option key={2} value="vendedor">Vendedor</option>
                                    <option key={3} value="comensal">Comensal</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Dni:</Form.Label>
                                <Form.Control
                                    id="dni"
                                    type="number"
                                    max={0}
                                    max={99999999}
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.dni ? filtros.dni : ""}
                                ></Form.Control>
                            </Form.Group>
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
                                <Form.Label>Estado:</Form.Label>
                                <Form.Control
                                    id="estado"
                                    as="select"
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.estado ? filtros.estado : ""}
                                >
                                    <option key={0} value="">Todos</option>
                                    <option key={1} value="activo">Activos</option>
                                    <option key={2} value="anulado">Anulados</option>
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
        ingresos: state.ingresos
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetFiltros: () => {
            dispatch(resetFiltros())
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Filtros));
