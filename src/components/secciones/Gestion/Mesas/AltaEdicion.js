import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { resetCreateMesa, resetUpdateMesa, createMesa, updateMesa, saveCreateMesa, saveUpdateMesa, fetchMesaById } from "../../../../actions/MesaActions"
import { fetchMozos } from "../../../../actions/UsuarioActions"

//Boostrap
import Form from "react-bootstrap/Form"

//CSS
import "../../../../assets/css/Gestion/Mesas.css"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Titulo from "../../../elementos/Titulo"
import SeleccionMozos from "../../../elementos/Modales/SeleccionMozos"

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
        props.fetchMozos()
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
     * Abre el modal de selección de mozos.
     */
    const abrirModalMozos = () => {
        setShow(true)
    }

    /**
     * Cierra el modal de selección de mozos.
     */
    const onHide = () => {
        setShow(false)
    }

    /**
     * Agrega un mozo a la colección de mozos.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const addMozo = (e) => {
        e.preventDefault()
        const idMozo = e.target.dataset.id
        const buscado = props.mozos.byId.mozos[idMozo]
        let nuevos = mesa.mozos
        if (!Array.isArray(nuevos)) {
            nuevos = []
        }
        let existente = nuevos.find(m => m.id === buscado.id)
        if (existente === undefined) {
            nuevos.push(buscado)
        }

        nuevos = nuevos.sort(function (a, b) {
            let mozoA = a.first_name;
            let mozoB = b.first_name;
            if(mozoA < mozoB) { return -1; }
            if(mozoA > mozoB) { return 1; }
            return 0;
        })
        let nuevo = { 'mozos': nuevos }
        if (accion === rutas.ACCION_EDITAR) {
            props.updateMesa(nuevo)
        } else {
            props.createMesa(nuevo)
        }
        setShow(false)
    }

    /**
     * Quita un mozo de la colección de mozos de la mesa.
     * 
     * @param {Object} mozo 
     */
    const removeMozo = (mozo) => {
        let nuevos = mesa.mozos
        if (!Array.isArray(nuevos)) {
            nuevos = []
        }

        let filtrados = nuevos
        const idMozo = parseInt(mozo.id)
        if (idMozo > 0) {
            filtrados = nuevos.filter(m => {
                const idActual = parseInt(m.id)
                return idActual !== parseInt(idMozo)
            })
        }
        filtrados = filtrados.sort(function (a, b) {
            let mozoA = a.first_name;
            let mozoB = b.first_name;
            if(mozoA < mozoB) { return -1; }
            if(mozoA > mozoB) { return 1; }
            return 0;
        })
        let nuevo = { 'mozos': filtrados }
        if (accion === rutas.ACCION_EDITAR) {
            props.updateMesa(nuevo)
        } else {
            props.createMesa(nuevo)
        }
    }

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
        const mozos = mesa.mozos
        if (mozos.length === 0) {
            errores.push("Debe seleccionar al menos un mozo.")
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

    /**
     * Mozos elegidos para la mesa.
     */
    const mozosElegidos = Array.isArray(mesa.mozos) ? mesa.mozos : []
    const listaMozos = () => {
        let mozos = []
        mozosElegidos.forEach(m => {
            mozos.push(
                <li key={m.id} className="d-flex justify-content-between align-items-center">
                    <span>{m.first_name}</span>
                    <button data-id={m.id} className="boton-transparente" onClick={() => removeMozo(m)}>
                        <i data-id={m.id} className="fa fa-times"></i>
                    </button>
                </li>
            )
        })
        if (mozosElegidos.length === 0) {
            mozos = <li>Seleccione al menos un mozo.</li>
        }
        return (
            <div>
                <h2 className="titulo-generico">Mozos:</h2>
                <ul>
                    {mozos}
                </ul>
            </div>
        )
    }

    return (
        <section className="seccion-mesas seccion-mesas-abm tarjeta-body">
            <Titulo ruta={rutas.MESAS_LISTAR} titulo={titulo} />
            <SeleccionMozos
                show={show}
                onHide={() => onHide()}
                addMozo={(e) => addMozo(e)}
                elegidos={mozosElegidos}
            />
            <Form id="formulario" onSubmit={(e) => guardar(e)}>
                <Form.Group>
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                        id="numero"
                        type="number"
                        min={0}
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
                        value={mesa.descripcion ? mesa.descripcion : ""}
                        onChange={(e) => onChangeMesa(e)}
                    />
                </Form.Group>
                <button onClick={() => abrirModalMozos()} type="button" className="boton-modal boton-modal-responsive text-success mb-2" data-target=".bs-example-modal-lg">
                    <AddBoxIcon style={{ color: '#5cb860' }} />
                    Mozo
                </button>
                {listaMozos()}
                <button className="btn btn-success float-right boton-guardar mt-2" type="submit">
                    <div style={{ display: isCreating ? "inline-block" : "none" }} className="spinner spinner-border text-light" role="status">
                        <span className="sr-only"></span>
                    </div>
                    <span className="ml-1">Guardar</span>
                </button>
            </Form>
        </section>
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
        fetchMozos: () => {
            dispatch(fetchMozos())
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