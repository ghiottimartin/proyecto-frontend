import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import { updateFiltros, fetchReemplazos, updateReemplazo } from "../../../../actions/ReemplazoMercaderiaActions"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Titulo from "../../../elementos/Titulo"
import Loader from "../../../elementos/Loader"
import Paginacion from "../../../elementos/Paginacion"
import Filtros from "./Filtros"

//CSS
import "../../../../assets/css/Gestion/ReemplazoMercaderia.css"

//Librerias
import AddBoxIcon from "@material-ui/icons/AddBox"
import history from '../../../../history'

function Listado(props) {
    const reemplazos = props.reemplazos
    const buscando = reemplazos.byId.isFetching
    const titulo = "Listado de reemplazos de mercaderías"

    //Filtros 
    const filtros = reemplazos.byId.filtros
    const registros = reemplazos.byId.registros
    const total = reemplazos.byId.total
    const totalCero = parseInt(total) === 0
    const [paginaUno, setPaginaUno] = useState(false)
    const [noHayReemplazos, setNoHayReemplazos] = useState(false)

    useEffect(() => {
        props.fetchReemplazos()
    }, [filtros.paginaActual])

    useEffect(() => {
        let noHayReemplazos = false
        if (props.reemplazos.allIds.length === 0) {
            noHayReemplazos = true
        }
        setNoHayReemplazos(noHayReemplazos)      
    }, [props.reemplazos.allIds])

    /**
    * Cambia la página del filtro de paginación.
    * 
    * @param {Number} pagina 
    * @returns 
    */
    const cambiarDePagina = (pagina) => {
        if (isNaN(pagina)) {
            return
        }

        let cambio = {}
        cambio['paginaActual'] = pagina
        props.updateFiltros(cambio)
    }

    /**
     * Filtra los reemplazos.
     * 
     * @param {SyntheticBaseEvent} e 
     */
     const filtrarReemplazos = (e) => {
        e.preventDefault()
        if (paginaUno) {
            var cambio = {
                target: {
                    id: 'paginaActual',
                    value: 1
                }
            }
            onChangeBusqueda(cambio)
        }
        props.fetchReemplazos()
    }

    /**
     * Cambia los filtros a aplicar, si cambia un filtro que no sea la paginación
     * vuelve a la página inicial.
     * 
     * @param {SyntheticBaseEvent} e 
     */
     const onChangeBusqueda = (e) => {
        var cambio = {}
        cambio[e.target.id] = e.target.value
        if (e.target.id !== "paginaActual") {
            setPaginaUno(true)
        } else {
            setPaginaUno(false)
        }
        props.updateFiltros(cambio)
    }

    /**
     * Devuelve una array de elementos html con las operaciones del reemplazo de mercadería.
     * 
     * @returns {Array}
     */
     const getOperacionesReemplazo = (reemplazo) => {
        let operaciones = [];
        reemplazo.operaciones.forEach(operacion => {
            let accion = operacion.accion;            
            operaciones.push(
                <div key={operacion.key} onClick={() => ejecutarOperacion(reemplazo, accion)} className={operacion.clase + " operacion"} >
                    <i className={operacion.icono} aria-hidden="true"></i> {operacion.texto}
                </div>
            );
        })
        return (
            <div className="fila-operaciones">
                {operaciones}
            </div>
        );
    }

    /**
     * Ejecuta la operación del listado de reemplazos de mercadería según el caso.
     * 
     * @param {Object} reemplazo 
     * @param {String} accion 
     */
     const ejecutarOperacion = (reemplazo, accion)  => {
        switch (accion) {
            case 'visualizar':
                visualizarReemplazo(reemplazo);
                break;
            
        }
    }

    /**
     * Redirige a la visualización del reemplazo de mercadería.
     * 
     * @param {Object} reemplazo 
     */
     const visualizarReemplazo = (reemplazo) => {
        props.updateReemplazo(reemplazo);
        
        let ruta = rutas.REEMPLAZO_MERCADERIA_VISUALIZAR;
        ruta += reemplazo.id;
        history.push(ruta);
    }

    let Reemplazos = []
    reemplazos.allIds.map(idReemplazo => {
        let reemplazo = reemplazos.byId.reemplazos[idReemplazo]
        if (reemplazo && reemplazo.id) {
            let operaciones = getOperacionesReemplazo(reemplazo)
            Reemplazos.push(
                <tr key={reemplazo.id}>
                    <td>{reemplazo.id_texto}</td>
                    <td>{reemplazo.fecha_texto}</td>
                    <td>
                        <span>{reemplazo.usuario_nombre}</span>
                        <br/>
                        <span className="texto-chico">{reemplazo.usuario_email}</span>
                    </td>
                    <td>
                        <span className={reemplazo.estado_clase}>{reemplazo.estado_texto}</span>
                        <span style={{ display: reemplazo.anulado ? "block" : "none" }} className="reemplazo-anulado">{reemplazo.fecha_anulado}</span>
                    </td>
                    <td>{operaciones}</td>
                </tr>
            )
        }
    })

    if (noHayReemplazos) {
        let placeholder = "Todavía no se han realizado reemplazos"
        if (!totalCero) {
            placeholder = "No hay reemplazos para los filtros aplicados"
        }
        Reemplazos = 
            <tr className="text-center">
                <td colSpan={5}>{placeholder}</td>
            </tr>
    }

    return (
        <div className="reemplazo-mercaderia-listado tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.GESTION} titulo={titulo} />
                <a href="#"
                    onClick={() => history.push(rutas.REEMPLAZO_MERCADERIA_ALTA + "?volverA=" + rutas.REEMPLAZO_MERCADERIA_LISTAR)}
                    data-toggle="tooltip" data-original-title="" title="">
                    <AddBoxIcon style={{ color: '#5cb860' }} />
                </a>
            </div>
            <Filtros
                {...props}
                filtrar={(e) => filtrarReemplazos(e)}
                onChangeBusqueda={(e) => onChangeBusqueda(e)}
            />
            <table className="table tabla-listado">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Estado</th>
                        <th>Operaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {buscando ? <tr><td colSpan={5}><Loader display={true} /></td></tr> : Reemplazos}
                </tbody>
            </table>
            {
                buscando || totalCero ?
                    ''
                    :
                    <Paginacion
                        activePage={filtros.paginaActual}
                        itemsCountPerPage={filtros.registrosPorPagina}
                        totalItemsCount={registros}
                        pageRangeDisplayed={5}
                        onChange={(e) => cambiarDePagina(e)}
                    />
            }
        </div>
    )

}

function mapStateToProps(state) {
    return {
        reemplazos: state.reemplazos
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        },
        fetchReemplazos: () => {
            dispatch(fetchReemplazos())
        },
        updateReemplazo: (reemplazo) => {
            dispatch(updateReemplazo(reemplazo))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado))
