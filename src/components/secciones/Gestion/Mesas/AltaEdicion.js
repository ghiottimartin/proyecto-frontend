import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { resetCreateMesa, resetUpdateMesa, createMesa, updateMesa, saveCreateMesa, saveUpdateMesa, fetchMesaById } from "../../../../actions/MesaActions"

//Boostrap
import Form from "react-bootstrap/Form"

//CSS
import "../../../../assets/css/Gestion/Mesas.css"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Titulo from "../../../elementos/Titulo"

//Librerías
import AddBoxIcon from "@material-ui/icons/AddBox"
import Swal from "sweetalert2"

function AltaEdicion(props) {
    const idMesa = props.match.params['id']
    const accion = props.match.params['accion']
    const isCreating = props.mesas.create.isCreating

    let mesa = props.mesas.create.nuevo
    let titulo = "Alta de mesa"
    if (accion === rutas.ACCION_EDITAR) {
        mesa = props.mesas.update.activo
        titulo = "Edición de Mesa " + mesa.numero_texto
    }

    useEffect(() => {
        if (!isNaN(idMesa)) {
            props.fetchMesaById(idMesa)
        }
        return function limpiarAlta() {
            props.resetCreateMesa()
            props.resetUpdateMesa()
        }
    }, [])

    const [show, setShow] = useState(false)

    /**
     * Actualiza la mesa en base al evento.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const onChangeMesa = (e) => {
        var cambio = {}
        cambio[e.target.id] = e.target.value
        if (accion === rutas.ACCION_ALTA) {
            props.createMesa(cambio)
        }
        if (accion === rutas.ACCION_EDITAR) {
            props.updateMesa(cambio)
        }
    }

    /**
     * Valida que la mesa tenga los datos correctos para ser guardada.
     * 
     * @param {Boolean} mostrar 
     * @returns {Boolean}
     */
    const validarMesa = (mostrar) => {
        let errores = []

        const numero = mesa.numero
        if (numero < 0 || isNaN(numero)) {
            errores.push("El número de mesa debe ser mayor a cero.")
        }


        const hayErrores = errores.length > 0
        if (mostrar && hayErrores) {
            const mensajes = errores.join('/n')
            Swal.fire({
                title: 'Hubo un error al guardar la mesa.',
                text: mensajes,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: true,
                confirmButtonText: 'Continuar',
                confirmButtonColor: 'rgb(88, 219, 131)',
                cancelButtonColor: '#bfbfbf',
            });
        }

        return !hayErrores;
    }

    /**
     * Guarda la mesa en la base de datos.
     * 
     * @param {SyntheticBaseEvent} e 
     * @returns 
     */
    const guardar = (e) => {
        e.preventDefault()
        if (e.target.id !== 'formulario') {
            return;
        }

        const valida = validarMesa(true)
        if (valida && accion === rutas.ACCION_ALTA) {
            props.saveCreateMesa()
        }
        if (valida && accion === rutas.ACCION_EDITAR) {
            props.saveUpdateMesa()
        }
    }

    return (
        <div className="row justify-content-md-center">
            <div className="col-md-6">
                <section className="seccion-mesas seccion-mesas-abm tarjeta-body">
                    <Titulo ruta={rutas.MESAS_LISTAR} titulo={titulo} />
                    <Form id="formulario" onSubmit={(e) => guardar(e)}>
                        <Form.Group>
                            <Form.Label>Número *</Form.Label>
                            <Form.Control
                                id="numero"
                                type="number"
                                min={0}
                                max={500}
                                onChange={(e) => onChangeMesa(e)}
                                value={mesa.numero ? mesa.numero : ""}
                                placeholder="Ingrese un número de mesa"
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control
                                id="descripcion"
                                as="textarea" rows={3}
                                maxLength={99}
                                value={mesa.descripcion ? mesa.descripcion : ""}
                                placeholder="Observaciones"
                                onChange={(e) => onChangeMesa(e)}
                            />
                        </Form.Group>
                        <button className="btn btn-success float-right boton-guardar mt-2" type="submit">
                            <div style={{ display: isCreating ? "inline-block" : "none" }} className="spinner spinner-border text-light" role="status">
                                <span className="sr-only"></span>
                            </div>
                            <span className="ml-1">Guardar</span>
                        </button>
                    </Form>
                </section>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        mesas: state.mesas,
        mozos: state.mozos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetCreateMesa: () => {
            dispatch(resetCreateMesa())
        },
        resetUpdateMesa: () => {
            dispatch(resetUpdateMesa())
        },
        createMesa: (mesa) => {
            dispatch(createMesa(mesa))
        },
        updateMesa: (mesa) => {
            dispatch(updateMesa(mesa))
        },
        saveCreateMesa: () => {
            dispatch(saveCreateMesa())
        },
        saveUpdateMesa: () => {
            dispatch(saveUpdateMesa())
        },
        fetchMesaById: (id) => {
            dispatch(fetchMesaById(id))
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AltaEdicion))