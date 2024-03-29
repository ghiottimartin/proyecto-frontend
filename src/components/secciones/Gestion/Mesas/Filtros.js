import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { resetFiltros } from "../../../../actions/MesaActions"

//Boostrap
import Form from "react-bootstrap/Form";

//Librerías
import moment from 'moment';

function Filtros(props) {
    const filtros = props.mesas.byId.filtros
    const resetFiltros = props.mesas.byId.filtros.resetFiltros

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

    let maximo = moment().format("YYYY-MM-DD");
    return (
        <div className="filtros">
            <h4>Filtrado</h4>
            <Form onSubmit={(e) => props.filtrar(e)}>
                <div className="form-filtros">
                    <div className="contenedor-filtros">
                        <div className="filter-by text-nowrap flex-wrap">
                            <Form.Group>
                                <Form.Label>Número:</Form.Label>
                                <Form.Control
                                    id="numero"
                                    type="number"
                                    min="0"
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.numero}
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
                                    <option key={0} value="">Todas</option>
                                    <option key={1} value="disponible">Disponibles</option>
                                    <option key={2} value="ocupada">Ocupadas</option>
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
        mesas: state.mesas
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
