import React from "react";
import {withRouter} from "react-router-dom";

//Constants
import * as rutas from '../../constants/rutas.js';

//Redux
import {connect} from "react-redux";

//Librerías
import SweetAlert from "react-bootstrap-sweetalert"
import history from "../../history";

class MensajeCorrecto extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mostrar: false,
            procesoFinalizado: false,
            mensajes: [],
            titulo: "",
            ruta: "",
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.mostrar) {
            this.setState({mostrar: true});
        }

        var procesoFinalizado = false;
        var mensajes = this.state.mensajes;
        var titulo = "";
        Object.entries(this.props.todos).forEach(
            ([key, value]) => {
                var valuePrev = prevProps.todos[key];
                if (valuePrev && value && !value.currentlySending && valuePrev.currentlySending && !value.errorMessage && value.mensajeCorrecto) {
                    mensajes.push(value.mensajeCorrecto);
                    this.setState({ruta: value.ruta});
                    procesoFinalizado = true;
                }
                if (value.create && valuePrev && valuePrev.create && !value.create.isCreating && valuePrev.create.isCreating && !value.create.error && value.create.success) {
                    mensajes.push(value.create.success);
                    this.setState({ruta: value.create.ruta});
                    procesoFinalizado = true;
                }
                if (value.update && valuePrev && valuePrev.update && !value.update.isUpdating && valuePrev.update.isUpdating && !value.update.error) {
                    let mensaje = "" ;
                    if (value.update.success) {
                        mensaje = value.update.success;
                        mensajes.push(mensaje);
                    } else {
                        key = key.slice(0, key.length - 1);
                        mensajes.push(key.charAt(0).toUpperCase() + key.slice(1) + " actualizado correctamente.");
                    }
                    procesoFinalizado = true;
                }
                if (value.delete && valuePrev && valuePrev.delete && !value.delete.isDeleting && valuePrev.delete.isDeleting && !value.delete.error) {
                    let mensaje = key.charAt(0).toUpperCase() + key.slice(1, key.length - 1) + " borrado correctamente";
                    if (value.delete.success) {
                        mensaje = value.delete.success;
                    }
                    mensajes.push(mensaje);
                    procesoFinalizado = true;
                }
            }
        );
        if (this.state.mostrar !== procesoFinalizado && procesoFinalizado) {
            this.setState({
                mostrar: procesoFinalizado,
                titulo: titulo
            });
        }
    }

    ocultarModal() {
        this.setState({mostrar: false, mensajes: []});
        let ruta = this.state.ruta;
        if(ruta) {
            let valida = rutas.validarRuta(ruta);
            if (valida) {
                history.push(ruta);
            }
        }
    }


    render() {
        const {mostrar, titulo, mensajes} = this.state;
        if (mensajes)
            var Mensajes = mensajes.slice(-3).map((mensaje, index) => {
                return (<p key={index}><span className="glyphicon glyphicon-check"
                                             style={{marginTop: "10px", width: "20px"}}/> {mensaje}</p>);
            });
        return (
            <div className="no-cerrar-carrito">
                <SweetAlert title={titulo} success onConfirm={() => {
                    this.ocultarModal();
                }} show={mostrar}
                            confirmBtnBsStyle="success" confirmBtnText="Aceptar">
                    {Mensajes}
                </SweetAlert>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        todos: state,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {}
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MensajeCorrecto));
