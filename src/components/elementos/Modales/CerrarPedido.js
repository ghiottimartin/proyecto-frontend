import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { updatePedidoAbierto, saveCerrarPedido } from "../../../actions/PedidoActions"

//Boostrap
import Form from "react-bootstrap/Form";

//CSS
import "../../../assets/css/Elementos/CerrarPedido.css"

//Elementos
import Modal from "./Modal"

//Libraries
import Swal from "sweetalert2"

//Utils
import { formatearMoneda } from "../../../utils/formateador"

function CerrarPedido(props) {
    const abierto = props.pedidos.byId.abierto

    const titulo =
        <div className="confirmar-pedido-header">
            <div className="swal2-icon swal2-question swal2-icon-show" style={{ display: "flex" }}>
                <div className="swal2-icon-content">?</div>
            </div>
            <div>
                Confirmar pedido
            </div>
        </div>;

    const onChangePedido = (e) => {
        var cambio = {}
        cambio[e.target.id] = e.target.value
        props.updatePedidoAbierto(cambio)
    }

    const comprobarPedidoCerradoValido = () => {
        let errores = []
        
        const tipo = abierto.tipo
        let tipo_delivery = tipo === 'delivery'
        let tipo_retiro = tipo === 'retiro'
        if (!tipo_delivery && !tipo_retiro) {
            errores.push("Debe seleccionar un tipo de pedido: retiro en local o delivery.")
        }

        const direccion = abierto.direccion
        if (tipo_delivery && (typeof direccion !== 'string' || direccion.length < 7)) {
            errores.push("La dirección debe tener mínimo 7 caracteres.")
        }

        const total = abierto.total
        const cambio = abierto.cambio
        if (!isNaN(cambio) && cambio !== "" && cambio < total) {
            errores.push("El monto a pagar no puede ser menor al total.")
        }

        const diferencia = cambio - total;
        const total_potencia = total * 10;
        if (diferencia > total_potencia) {
            errores.push("El cambio es muy grande, ingrese un monto mas chico.")
        }

        const valido = errores.length === 0
        if (!valido) {
            const items = errores.reduce((text, error) => text + '<li style="font-size: 14px;">' + error + '</li>', '')
            const html = '<ul style="text-align: left;">' + items + '</ul>'
            Swal.fire({
                title: `No se ha podido cerrar el pedido:`,
                html: html,
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            })
        }


        if (valido) {
            props.onHide()

            const campos = {
                'direccion': direccion,
                'cambio': cambio,
                'tipo': tipo,
            }
            props.saveCerrarPedido(abierto.id, campos)
        }

        return valido
    }

    const cerrarPedido = (e) => {
        e.preventDefault()
        comprobarPedidoCerradoValido()
    }

    const getHtml = () => {
        const total = formatearMoneda(abierto.total)
        const cambio = abierto.cambio
        const tipo = abierto && abierto.tipo ? abierto.tipo : ''
        const direccion = abierto && abierto.direccion ? abierto.direccion : ''
        const tipoDelivery = tipo === 'delivery'
        return (
            <Form className="confirmar-pedido-cuerpo" onSubmit={(e) => cerrarPedido(e)}>
                <div className="confirmar-pedido-cuerpo-texto">
                    <span>Indique el cambio.</span>
                    <span>Recuerda que el valor del pedido es de <b>{total}</b></span>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <div className="confirmar-pedido-inputs">
                        <div className="form-group mt-3">
                            <label htmlFor="cambio">Cambio:</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">$</span>
                                </div>
                                <input
                                    id="cambio"
                                    type="number"
                                    className="input-cambio text-right"
                                    value={cambio}
                                    placeholder="Cambio"
                                    step="0.01"
                                    onChange={(e) => onChangePedido(e)}
                                />
                                <small id="direccion" className="form-text text-muted">El cambio no es obligatorio.</small>
                            </div>
                        </div>
                        <Form.Group>
                            <Form.Label>Tipo de pedido:</Form.Label>
                            <Form.Control
                                id="tipo"
                                as="select"
                                onChange={(e) => onChangePedido(e)}
                                value={tipo}
                            >
                                <option key={1} value="retiro">Retiro en local</option>
                                <option key={2} value="delivery">Delivery</option>
                            </Form.Control>
                        </Form.Group>
                        <div className="form-group mt-3" style={{display: tipoDelivery ? "block" : "none"}}>
                            <label htmlFor="direccion">Direccion:</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className="fas fa-map-marked"></i>
                                    </span>
                                </div>
                                <input
                                    id="direccion"
                                    type="text"
                                    maxLength={250}
                                    className="input-direccion"
                                    value={direccion}
                                    placeholder="Dirección de entrega"
                                    onChange={(e) => onChangePedido(e)}
                                />
                                <small id="direccion" className="form-text text-muted">Si su usuario no tiene dirección la misma se guardará.</small>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="float-right m-4 btn btn-sm btn-success m-0 waves-effect waves-light waves-float boton-filtrar">
                    Guardar
                </button>
            </Form>
        )
    }

    const cuerpo = getHtml();
    return (
        <Modal
            className="confirmar-pedido"
            show={props.show}
            titulo={titulo}
            cuerpo={cuerpo}
            onHide={() => props.onHide()}
        />
    )
}

function mapStateToProps(state) {
    return {
        pedidos: state.pedidos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePedidoAbierto: (pedido) => {
            dispatch(updatePedidoAbierto(pedido))
        },
        saveCerrarPedido: (id, campos) => {
            dispatch(saveCerrarPedido(id, campos))
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CerrarPedido))