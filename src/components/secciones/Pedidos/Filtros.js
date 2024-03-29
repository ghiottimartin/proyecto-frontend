import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { resetFiltros } from "../../../actions/PedidoActions";

//Boostrap
import Form from "react-bootstrap/Form";

//CSS
import '../../../assets/css/Filtros.css';

//Librerías
import moment from 'moment';

class Filtros extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.resetFiltros();
    }

    changeFiltros(e) {
        this.props.onChangeBusqueda(e);
    }

    getOpcionesEstados() {
        let opciones = [];
        opciones.push(<option key={0} value="">Todos</option>);
        opciones.push(<option key={1} value="abierto">Abierto</option>);
        opciones.push(<option key={2} value="en curso">En curso</option>);
        opciones.push(<option key={3} value="disponible">Disponible</option>);
        opciones.push(<option key={4} value="recibido">Entregado</option>);
        opciones.push(<option key={5} value="anulado">Anulado</option>);
        return opciones;

    }

    render() {
        const props = this.props;
        const filtros = props.pedidos.byId.filtros;
        let maximo = moment().format("YYYY-MM-DD");
        const mostrarFiltroUsuario = props.rutaVendedor;
        const estados = this.getOpcionesEstados()
        return (
            <div className="filtros">
                <h4>Filtrado</h4>
                <Form onSubmit={(e) => this.props.filtrar(e)}>
                    <div className="form-filtros pb-2">
                        <div className="contenedor-filtros">
                            <div className="filter-by text-nowrap">                       
                                <Form.Group>
                                    <Form.Label>Fecha desde:</Form.Label>
                                    <Form.Control
                                        id="fechaDesde"
                                        type="date"
                                        lang="es-ES"
                                        max={maximo}
                                        onChange={(e) => this.changeFiltros(e)}
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
                                        onChange={(e) => this.changeFiltros(e)}
                                        value={filtros.fechaHasta}
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group className="filtro-numero">
                                    <Form.Label>Número:</Form.Label>
                                    <Form.Control
                                        id="numero"
                                        type="number"
                                        min="0"
                                        onChange={(e) => this.changeFiltros(e)}
                                        value={filtros.numero}
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group style={{display: mostrarFiltroUsuario ? "block" : "none"}}>
                                    <Form.Label>Usuario:</Form.Label>
                                    <Form.Control
                                        id="nombreUsuario"
                                        type="text"
                                        onChange={(e) => this.changeFiltros(e)}
                                        value={filtros.usuario}
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group className="filtro-estado">
                                    <Form.Label>Estado:</Form.Label>
                                    <Form.Control
                                        id="estado"
                                        as="select"
                                        onChange={(e) => this.changeFiltros(e)}
                                        value={filtros.estado ? filtros.estado : ""}
                                    >
                                        {estados}
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
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos,
        usuarios: state.usuarios
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
