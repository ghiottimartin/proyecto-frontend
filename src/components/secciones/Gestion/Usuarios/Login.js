import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Actions
import { changeLogin, login, olvideMiPassword } from "../../../../actions/AuthenticationActions";

//Constants
import * as rutas from '../../../../constants/rutas.js';
import c from '../../../../constants/constants.js';

//Components
import Loader from "../../../elementos/Loader";

//CSS
import '../../../../assets/css/Usuarios/Login.css';

//Boostrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

//Images
import blackEye from "../../../../assets/img/eye.png";
import whiteEye from "../../../../assets/img/view.png";

//Librerias
import history from "../../../../history";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from 'sweetalert2';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgPassword: blackEye,
            captcha: false,
            tipo: 'password'
        };

        this.email = React.createRef();
    }

    componentDidMount() {
        if (this.props.authentication.token) {
            history.push(rutas.INICIO);
        }
        this.resetUsuario();
    }

    resetUsuario() {
        const cambio = {
            'email': '',
            'password': ''
        };
        this.props.changeLogin(cambio);
        this.email.current.value = "";
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.imgPassword !== this.state.imgPassword && this.state.imgPassword === blackEye) {
            this.toogleClave(false);
        }
        if (prevState.imgPassword !== this.state.imgPassword && this.state.imgPassword === whiteEye) {
            this.toogleClave(true);
        }
    }

    componentWillUnmount() {
        this.resetUsuario();
    }

    toogleClave(mostrar) {
        this.setState(prevState => ({
            tipo: mostrar ? 'text' : 'password'
        }))
    }

    onClickEye() {
        this.setState(prevState => ({
            imgPassword: prevState.imgPassword === blackEye ? whiteEye : blackEye,
        }));
    }

    onChangeUsuario(e) {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        this.props.changeLogin(cambio);
        if (e.target.id === 'email') {
            this.setState({
                validarEmail: ''
            });
        }
    }

    submitForm(e) {
        e.preventDefault();
        let   volverA = rutas.getQuery('volverA');
        const valido  = rutas.validarRuta(volverA);
        if (!valido) {
            volverA = "";
        }
        if (!this.state.captcha) {
            Swal.fire({
                title: `Debe completar el captcha`,
                icon: 'warning',
                showCloseButton: true,
                confirmButtonText: 'Continuar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            })
            return;
        }
        this.props.login(this.props.authentication.usuario, volverA);
        this.setState({ captcha: false });
    }

    olvideMiPassword(e) {
        e.preventDefault();
        if (this.email.current.value !== "" && this.email.current.checkValidity()) {
            this.setState({
                validarEmail: ''
            });
            this.props.olvideMiPassword(this.props.authentication.usuario);
        } else {
            this.setState({
                validarEmail: 'El campo email no debe estar vacío y debe tener formato de email'
            })
        }

    }

    onChangeCaptcha(valor) {
        if (valor) {
            this.setState({ captcha: true });
        }
    }

    render() {
        const { imgPassword, tipo } = this.state;
        const nuevoUsuario = this.props.usuarios.create.nuevo;
        return (
            <div className="login">
                <div className="login-contenedor">
                    <Form className="tarjeta-body" onSubmit={(e) => {this.submitForm(e)}}>
                        <h4>Ingreso</h4>
                        <Form.Group>
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                id="email"
                                ref={this.email}
                                type="email"
                                value={nuevoUsuario ? nuevoUsuario.email : ""}
                                onChange={(e) => this.onChangeUsuario(e)}
                                placeholder="Ingresar email"
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Contraseña</Form.Label>
                            <div className="contenedor-contrasenia">
                                <input
                                    id="password"
                                    className="form-control"
                                    type={tipo}
                                    value={nuevoUsuario ? nuevoUsuario.password : ""}
                                    onChange={(e) => this.onChangeUsuario(e)}
                                    placeholder="Contraseña"
                                    minLength="7"
                                    required
                                />
                                   <img onClick={(e) => this.onClickEye()} src={imgPassword} className="ver-password" alt="Mostrar/ocultar contraseña"/>
                            </div>
                        </Form.Group>
                        <span className="olvide-password" onClick={(e) => this.olvideMiPassword(e)}>
                            Olvide mi contraseña
                        </span>
                        <p className="email-valido">{this.state.validarEmail}</p>
                        {
                            this.props.authentication.currentlySending ?
                                <Loader display={true} />
                                :
                                <div className="d-flex flex-column align-items-center">
                                    <ReCAPTCHA
                                        sitekey={c.CAPTCHA_KEY}
                                        onChange={(valor) => this.onChangeCaptcha(valor)}
                                    />
                                    <Button className="boton-submit" variant="primary" type="submit">
                                        Iniciar sesión
                                    </Button>
                                </div>
                        }
                    </Form>
                </div>
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
        changeLogin: (usuario) => {
            dispatch(changeLogin(usuario))
        },
        login: (usuario, to) => {
            dispatch(login(usuario, to))
        },
        olvideMiPassword: (usuario) => {
            dispatch(olvideMiPassword(usuario))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

