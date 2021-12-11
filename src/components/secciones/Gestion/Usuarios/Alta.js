import React from 'react';
import { withRouter, useLocation } from 'react-router-dom'
import { connect } from 'react-redux';

//Actions
import { resetPassword } from "../../../../actions/AuthenticationActions";
import { createUsuario, saveCreateUsuario, resetCreateUsuario } from "../../../../actions/UsuarioActions";

//Constants
import * as rutas from '../../../../constants/rutas.js';
import c from '../../../../constants/constants.js';

//Boostrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//Components
import Loader from "../../../elementos/Loader";
import Titulo from "../../../elementos/Titulo";

//CSS
import '../../../../assets/css/Usuarios/Registro.css';

//Images
import blackEye from "../../../../assets/img/eye.png";
import whiteEye from "../../../../assets/img/view.png";

//Librerias
import $ from 'jquery';
import history from "../../../../history";
import Swal from 'sweetalert2';
import ReCAPTCHA from "react-google-recaptcha";

class Alta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tipo: 'password',
            captcha: false,
            imgPassword: blackEye,
            botonVolverA: '',
            volverAValido: false
        };

        this.inputConfirmaPasw = React.createRef();
    }

    componentDidMount() {
        this.props.resetCreateUsuario();
        const volverA = rutas.getQuery('volverA');
        const valido = rutas.validarRuta(volverA);
        let botonVolverA = "";
        if (valido) {
            botonVolverA =
                <button className="boton-submit btn btn-light" onClick={() => history.push(volverA)} title="Volver">
                    Volver
                </button>;
        }
        this.setState({ botonVolverA: botonVolverA, volverAValido: valido });

        let tipoRuta = this.props.match.params['tipo'];
        let tipoAdmin = tipoRuta === rutas.TIPO_ADMIN;
        if (tipoAdmin && this.state.captcha === false) {
            this.onChangeCaptcha(true);
        }

        let responsive = $(window).width() <= 849;
        if (responsive) {
            this.setState({ captcha: true })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let tipoRuta = this.props.match.params['tipo'];
        let logueado = this.props.usuarios.update.logueado;
        let tipoAdmin = tipoRuta === rutas.TIPO_ADMIN;
        if ((!tipoAdmin && this.props.authentication.token) || (tipoAdmin && logueado && logueado.id && (!logueado.esAdmin && !logueado.esVendedor))) {
            history.push(rutas.INICIO);
        }
        if (prevState.imgPassword !== this.state.imgPassword && this.state.imgPassword === blackEye) {
            this.toogleClave(false);
        }
        if (prevState.imgPassword !== this.state.imgPassword && this.state.imgPassword === whiteEye) {
            this.toogleClave(true);
        }
        if (tipoAdmin && this.state.captcha === false) {
            this.onChangeCaptcha(true);
        }

    }

    componentWillUnmount() {
        this.props.resetCreateUsuario();
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
        var mensaje = "";
        cambio[e.target.id] = e.target.value;
        let tipoRuta = this.props.match.params['tipo'];
        let tipoAdmin = tipoRuta === rutas.TIPO_ADMIN;
        let logueado = this.props.usuarios.create.nuevo;
        if (logueado.tipoRegistro === undefined || logueado.tipoRegistro === "") {
            cambio["tipoRegistro"] = tipoAdmin ? "admin" : "comun";
        }
        this.props.createUsuario(cambio);
        if (e.target.id === "password_confirmation") {
            if (this.props.usuarios.create.nuevo.password !== e.target.value) {
                mensaje = "Las contraseñas no coinciden";
            } else {
                mensaje = "";
            }
            this.inputConfirmaPasw.current.setCustomValidity(mensaje);
        }
    }

    onChangeRolUsuario(nombre) {
        var valor = true;
        var cambio = {};
        var usuario = this.props.usuarios.create.nuevo;
        switch (nombre) {
            case 'esComensal':
                if (usuario.esComensal) {
                    valor = false;
                }
                break;
            case 'esMozo':
                if (usuario.esMozo) {
                    valor = false;
                }
                break;
            case 'esVendedor':
                if (usuario.esVendedor) {
                    valor = false;
                }
                break;
        }
        cambio[nombre] = valor;
        this.props.createUsuario(cambio);
    }

    validarUsuario() {
        let valido = true;
        let mensajes = [];

        let tipo = this.props.match.params['tipo'];
        let tipoAdmin = tipo === rutas.TIPO_ADMIN;
        let usuario = this.props.usuarios.create.nuevo;
        let esMozo = usuario.esMozo;
        let esAdmin = usuario.esAdmin;
        let esVendedor = usuario.esVendedor;
        let esComensal = usuario.esComensal;
        if (!esMozo && !esAdmin && !esVendedor && !esComensal && tipoAdmin) {
            valido = false;
            mensajes.push("* Debe seleccionar al menos un rol para el usuario");
        }
        if (!tipoAdmin) {
            usuario.roles = ['comensal'];
        }

        let dni = parseInt(usuario.dni);
        if (dni <= 0) {
            valido = false;
            mensajes.push("* El dni del usuario debe ser mayor a cero");
        }
        if (dni > 99999999) {
            valido = false;
            mensajes.push("* El dni del usuario tener 8 dígitos o menos");
        }

        if (mensajes.length > 0) {
            let texto = `<p className="text-left">${mensajes.join("<br/>")}</p>`;
            Swal.fire({
                title: 'Error al guardar',
                html: texto,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: true,
                confirmButtonText: 'Continuar',
                confirmButtonColor: 'rgb(88, 219, 131)',
            });
        }
        return valido;
    }

    submitForm(e) {
        e.preventDefault();
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

        let tipoRuta = this.props.match.params['tipo'];
        let tipoAdmin = tipoRuta === rutas.TIPO_ADMIN;
        let valido = this.validarUsuario();
        let linkVolver = rutas.getQuery('volverA');
        if (!valido) {
            return;
        }
        if (!tipoAdmin && this.props.usuarios.create.nuevo.password_confirmation === this.props.usuarios.create.nuevo.password) {
            this.props.saveCreateUsuario(false, linkVolver);
        } else if (tipoAdmin) {
            this.props.saveCreateUsuario(true, linkVolver);
        }
        this.setState({ captcha: false });
    }

    onChangeCaptcha(valor) {
        if (valor) {
            this.setState({ captcha: true });
        }
    }

    render() {
        const { imgPassword, tipo, botonVolverA, volverAValido } = this.state;
        const tipoRuta = this.props.match.params['tipo'];
        const usuario = this.props.usuarios.create.nuevo;
        const tipoAdmin = tipoRuta === rutas.TIPO_ADMIN;
        const Ojo = () => {
            return (
                <img onClick={(e) => this.onClickEye()} src={imgPassword} className="ver-password" alt="Mostrar/ocultar contraseña" />
            );
        };
        var titulo = tipoAdmin ? "Alta de usuario" : "Registro";
        var ruta = tipoAdmin ? rutas.USUARIOS_LISTAR : null;
        let captchaHTML = "";
        if (!tipoAdmin) {
            captchaHTML =
                <ReCAPTCHA
                    className="login-captcha"
                    sitekey={c.CAPTCHA_KEY}
                    onChange={(valor) => this.onChangeCaptcha(valor)}
                />;
        }

        let responsive = $(window).width() <= 849;
        return (
            <div className="registro">
                <div className="registro-contenedor">
                    <Form className="tarjeta-body" onSubmit={(e) => { this.submitForm(e) }}>
                        <h4>{ }</h4>
                        <Titulo ruta={ruta} titulo={titulo} />
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                id="first_name"
                                type="nombre"
                                maxLength={150}
                                onChange={(e) => this.onChangeUsuario(e)}
                                placeholder="Ingresar nombre"
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                id="email"
                                type="email"
                                onChange={(e) => this.onChangeUsuario(e)}
                                placeholder="Ingresar email"
                                required={true}
                            />
                        </Form.Group>
                        {!tipoAdmin ?
                            <div className="claves">
                                <Form.Group>
                                    <Form.Label>Contraseña</Form.Label>
                                    <div className="contenedor-contrasenia">
                                        <input
                                            id="password"
                                            className="form-control"
                                            type={tipo}
                                            onChange={(e) => this.onChangeUsuario(e)}
                                            placeholder="Contraseña"
                                            minLength="8"
                                            required={true}
                                        />
                                        <Ojo />
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Confirmar contraseña</Form.Label>
                                    <div className="contenedor-contrasenia">
                                        <input
                                            id="password_confirmation"
                                            className="form-control"
                                            ref={this.inputConfirmaPasw}
                                            type={tipo}
                                            onChange={(e) => this.onChangeUsuario(e)}
                                            placeholder="Confirma contraseña"
                                            minLength="8"
                                            required={true}
                                        />
                                        <Ojo />
                                    </div>
                                </Form.Group>
                            </div>
                            :
                            <div className="contenedor-roles">
                                <Form.Group>
                                    <Form.Label>DNI</Form.Label>
                                    <input
                                        id="dni"
                                        className="form-control"
                                        type="number"
                                        onChange={(e) => this.onChangeUsuario(e)}
                                        placeholder="Ingrese DNI"
                                        max="99999999"
                                        required={true}
                                    />
                                    <Form.Text className="text-muted">
                                        Esta será la contraseña del usuario que está creando.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="d-flex flex-column">
                                    <Form.Label>Roles</Form.Label>
                                    <div className="form-check form-check-inline" onClick={() => this.onChangeRolUsuario('esMozo')}>
                                        <input
                                            className="form-check-input" type="checkbox" id="esMozo"
                                            checked={usuario && usuario.esMozo ? usuario.esMozo : false}
                                            onChange={() => { }}
                                        />
                                        <label className="form-check-label" htmlFor="inlineCheckbox2">Mozo</label>
                                    </div>
                                    <div className="form-check form-check-inline" onClick={() => this.onChangeRolUsuario('esVendedor')}>
                                        <input
                                            className="form-check-input" type="checkbox" id="esVendedor"
                                            checked={usuario && usuario.esVendedor ? usuario.esVendedor : false}
                                            onChange={() => { }}
                                        />
                                        <label className="form-check-label" htmlFor="inlineCheckbox3">Vendedor</label>
                                    </div>
                                    <div className="form-check form-check-inline" onClick={() => this.onChangeRolUsuario('esComensal')}>
                                        <input
                                            className="form-check-input" type="checkbox" id="esComensal"
                                            checked={usuario && usuario.esComensal ? usuario.esComensal : false}
                                            onChange={() => { }}

                                        />
                                        <label className="form-check-label" htmlFor="inlineCheckbox3">Comensal</label>
                                    </div>
                                </Form.Group>
                            </div>
                        }
                        {
                            this.props.usuarios.create.isCreating ?
                                <Loader display={true} />
                                :
                                <div className="d-flex flex-column align-items-center">
                                    {!responsive ?
                                        <div>
                                            {captchaHTML}
                                        </div>
                                        : ''
                                    }
                                    <div className="d-flex justify-content-between w-100">
                                        <Button className="boton-submit" variant="primary" type="submit" >
                                            {!tipoAdmin ? "Registrarse" : "Guardar"}
                                        </Button>
                                        {volverAValido ? botonVolverA : ""}
                                    </div>
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
        createUsuario: (usuario) => {
            dispatch(createUsuario(usuario))
        },
        saveCreateUsuario: (admin, volverA) => {
            dispatch(saveCreateUsuario(admin, volverA))
        },
        resetPassword: (usuario) => {
            dispatch(resetPassword(usuario))
        },
        resetCreateUsuario: () => {
            dispatch(resetCreateUsuario())
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Alta));
