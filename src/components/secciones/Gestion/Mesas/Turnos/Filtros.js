import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { resetFiltros } from "../../../../../actions/TurnoActions"

//Boostrap
import Form from "react-bootstrap/Form";

//Librerías
import moment from 'moment';

function Filtros(props) {
    const filtros = props.turnos.byId.filtros
    const resetFiltros = props.turnos.byId.filtros.resetFiltros

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
                    <div className="contenedor-filtros w-100">
                        <div className="filter-by text-nowrap w-100">
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
                            <Form.Group>
                                <Form.Label>Estado:</Form.Label>
                                <Form.Control
                                    id="estado"
                                    as="select"
                                    onChange={(e) => changeFiltros(e)}
                                    value={filtros.estado ? filtros.estado : ""}
                                >
                                    <option key={0} value="">Todos</option>
                                    <option key={1} value="abierto">Abiertos</option>
                                    <option key={2} value="cerrado">Cerrados</option>
                                    <option key={3} value="cancelado">Cancelados</option>
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
        turnos: state.turnos
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
