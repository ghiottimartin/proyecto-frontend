import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Boostrap
import Form from "react-bootstrap/Form";

//CSS
import '../../../assets/css/Pedidos/Filtros.css';

//Librerías
import moment from 'moment';

class Filtros extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buscando: false,
        }
    }

    changeDirection() {
        var filtros = {};
        filtros.target = {};
        filtros.target.id = "direction";
        filtros.target.value = this.props.filtros.direction === "ASC" ? "DESC" : "ASC";
        this.changeFiltros(filtros);
    }

    changeFiltros(e) {
        this.setState({
            buscando: true
        });
        this.props.onChangeBusqueda(e);
    }

    render() {
        const props = this.props;
        let buscando = this.state.buscando;
        let maximo = moment().format("YYYY-MM-DD");
        return (
            <div className="filtros">
                <h4>Filtrado</h4>
                <Form onSubmit={(e) => this.props.filtrar(e)}>
                    <div className="form-filtros">
                        <div className="contenedor-filtros">
                            <div className="filter-by text-nowrap">                       
                                <Form.Group>
                                    <Form.Label>Fecha desde</Form.Label>
                                    <Form.Control
                                        id="fechaDesde"
                                        type="date"
                                        lang="es-ES"
                                        max={maximo}
                                        onChange={(e) => this.changeFiltros(e)}
                                        value={props.filtros.fechaDesde}
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Fecha hasta</Form.Label>
                                    <Form.Control
                                        id="fechaHasta"
                                        type="date"
                                        lang="es-ES"
                                        max={maximo}
                                        onChange={(e) => this.changeFiltros(e)}
                                        value={props.filtros.fechaHasta}
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
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos,
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
      
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Filtros));
