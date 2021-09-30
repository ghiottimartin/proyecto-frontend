import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { resetFiltros } from "../../../actions/PedidoActions";

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

    componentDidMount() {
        this.props.resetFiltros();
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
        const filtros = props.pedidos.byId.filtros;
        let maximo = moment().format("YYYY-MM-DD");
        const textoEntregado = props.rutaVendedor ? "Entregado" : "Recibido";
        const mostrarFiltroUsuario = props.rutaVendedor;
        return (
            <div className="filtros">
                <h4>Filtrado</h4>
                <Form onSubmit={(e) => this.props.filtrar(e)}>
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
                                <Form.Group>
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
                                <Form.Group>
                                    <Form.Label>Estado:</Form.Label>
                                    <Form.Control
                                        id="estado"
                                        as="select"
                                        onChange={(e) => this.changeFiltros(e)}
                                        value={filtros.estado ? filtros.estado : ""}
                                    >
                                        <option key={0} value="">Todos</option>
                                        <option key={1} value="abierto">Abierto</option>
                                        <option key={2} value="cerrado">Cerrado</option>
                                        <option key={3} value="cancelado">Cancelado</option>
                                        <option key={4} value="recibido">{textoEntregado}</option>
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
