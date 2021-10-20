import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { resetFiltros } from "../../../../actions/MovimientosStockActions"

//Boostrap
import Form from "react-bootstrap/Form";

//Librerías
import moment from 'moment';

function Filtros(props) {
    const filtros = props.movimientos.byId.filtros
    const resetFiltros = props.movimientos.byId.filtros.resetFiltros

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
                        <div className="filter-by text-nowrap">                       
                            <Form.Group>
                                <Form.Label>Fecha desde:</Form.Label>
                                <Form.Control
                                    id="fechaDesde"
                                    type="date"
                                    lang="es-ES"
                                    max={maximo}
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.fechaDesde}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Fecha hasta:</Form.Label>
                                <Form.Control
                                    id="fechaHasta"
                                    type="date"
                                    lang="es-ES"
                                    max={maximo}
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.fechaHasta}
                                ></Form.Control>
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
