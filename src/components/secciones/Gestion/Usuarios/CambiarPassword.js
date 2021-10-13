import React from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

//Api
import auth from "../../../../api/authentication";

//Actions
import {updateUsuario, saveUpdateUsuario, fetchUsuarioLogueadoIfNeeded} from "../../../../actions/UsuarioActions";
import {resetPassword, validarToken} from "../../../../actions/AuthenticationActions";

//Bootstrap
import Form from "react-bootstrap/Form";

//Constants
import * as rutas from '../../../../constants/rutas.js';

//Components
import Loader from "../../../elementos/Loader";

//CSS
import "../../../../assets/css/Usuarios/CambiarPassword.css";

//Librerias
import history from "../../../../history";

class CambiarPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.confirmaPass = React.createRef();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if (auth.logueado()) {
            history.push(rutas.INICIO);
        }
        if (this.props.match.params.token) {
            this.props.validarToken('reset', this.props.match.params.token);
        } else if (!this.props.authentication.token) {
            history.push(rutas.LOGIN);
        } else {
            history.push(rutas.INICIO);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.authentication.errorMessage) {
            setTimeout(() => history.push(rutas.LOGIN), 5000);
        }
    }

    onChangeUsuario(e) {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        if (e.target.id === "confirmaPass") {
            cambio["password_confirmation"] = e.target.value;
        }
        this.props.updateUsuario(cambio);
        if (e.target.id === "password") {
            if (this.props.usuarios.update.activo.confirmaPass !== e.target.value) {
                this.confirmaPass.current.setCustomValidity("Las contraseñas no coinciden");
            } else {
                this.confirmaPass.current.setCustomValidity("");
            }
        }
        if (e.target.id === "confirmaPass") {
            if (this.props.usuarios.update.activo.password !== e.target.value) {
                this.confirmaPass.current.setCustomValidity("Las contraseñas no coinciden");
            } else {
                this.confirmaPass.current.setCustomValidity("");
            }
        }
    }

    submitForm(e) {
        e.preventDefault();
        if (this.props.usuarios.update.activo.confirmaPass === this.props.usuarios.update.activo.password) {
            if (!this.props.match.params.token)
                history.push(rutas.INICIO);
            else {
                let usuario = this.props.usuarios.update.activo;
                usuario.token = this.props.match.params.token;
                this.props.resetPassword(usuario);
            }
        }
    }

    render() {
        const usuarioLogueado = this.props.usuarios.update.activo;
        const errorTokenMessage = this.props.authentication.errorMessage;
        return (
            <div className="cambiar-password">
                <div style={{display: errorTokenMessage || this.props.usuarios.error ? "block": "none" }}
                     className="contenedor-mensaje-error">
                    <h1>Error</h1>
                    <b style={{color: "red"}}>{errorTokenMessage}</b>
                    <b style={{color: "red"}}>{this.props.usuarios.error}</b>
                </div>
                <Form style={{ display: !this.props.authentication.currentlySending }}className="tarjeta-body" onSubmit={(e) => {
                    this.submitForm(e)
                }} style={{display: this.props.authentication.errorMessage ? "none" : "block"}}>
                    <h4>{!this.props.match.params.token ? "Cambiar contraseña" : "Restauración de contraseña"}</h4>
                    <Form.Group>
                        <Form.Label>Contraseña</Form.Label>
                        <input
                            id="password"
                            className="form-control"
                            type="password"
                            onChange={(e) => this.onChangeUsuario(e)}
                            value={usuarioLogueado ? usuarioLogueado.password : ""}
                            placeholder="Contraseña"
                            minLength="8"
                            required={!this.props.authentication.token}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Contraseña</Form.Label>
                        <input
                            id="confirmaPass"
                            ref={this.confirmaPass}
                            className="form-control"
                            type="password"
                            onChange={(e) => this.onChangeUsuario(e)}
                            value={usuarioLogueado ? usuarioLogueado.confirmaPass : ""}
                            placeholder="Confirmar Contraseña"
                            minLength="8"
                            required={true}
                        />
                    </Form.Group>
                    <Row>
                        <Col md={12} className="botoneraIngreso">
                            {/*<p style={{color: "red"}}>{this.props.usuarios.create.error}</p>*/}
                            {/*<p style={{color: "red"}}>{this.props.usuarios.update.error}</p>*/}
                            <Button className="boton-submit" type="submit"
                                    style={{display: this.props.authentication.currentlySending ? "none" : "block"}}
                                    disabled={this.props.authentication.currentlySending || this.props.usuarios.update.isUpdating || this.props.authentication.errorMessage}>Aceptar</Button>
                            <br/>
                            <Loader display={this.props.authentication.currentlySending}/>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsuarioLogueadoIfNeeded: () => {
          dispatch(fetchUsuarioLogueadoIfNeeded());
        },
        updateUsuario: (usuario) => {
            dispatch(updateUsuario(usuario))
        },
        saveUpdateUsuario: () => {
            dispatch(saveUpdateUsuario())
        },
        resetPassword: (usuario) => {
            dispatch(resetPassword(usuario))
        },
        validarToken: (tipoToken, token) => {
            dispatch(validarToken(tipoToken, token))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CambiarPassword));