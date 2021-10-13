import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchIngresos, updateFiltros } from "../../../../actions/IngresoActions"

//CSS
import "../../../../assets/css/Gestion/Ingreso.css"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Loader from "../../../elementos/Loader"
import Titulo from "../../../elementos/Titulo"
import Filtros from "./Filtros"
import Paginacion from "../../../elementos/Paginacion"
import AddBoxIcon from "@material-ui/icons/AddBox"

//Librerías
import history from "../../../../history";

function IngresoListado(props) {
    const titulo = "Listado de ingresos"
    const ingresos = props.ingresos
    const buscando = ingresos.byId.isFetching
    
    //Filtros 
    const filtros = ingresos.byId.filtros
    const registros = ingresos.byId.registros
    const total = ingresos.byId.total;
    const totalCero = parseInt(total) === 0;
    const [paginaUno, setPaginaUno] = useState(false)
    const [noHayIngresos, setNoHayIngresos] = useState(false)

    useEffect(() => {
        props.fetchIngresos()
    }, [filtros.paginaActual])

    useEffect(() => {
        let noHayIngresos = false
        if (props.ingresos.allIds.length === 0) {
            noHayIngresos = true
        }
        setNoHayIngresos(noHayIngresos)      
    }, [props.ingresos.allIds])

    /**
     * Devuelve una array de elementos html con las operaciones del ingreso.
     * 
     * @returns {Array}
     */
    const getOperacionesIngreso = () => {
        return <div></div>
    }

    /**
     * Filtra los ingresos.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const filtrarIngresos = (e) => {
        e.preventDefault();
        if (paginaUno) {
            var cambio = {
                target: {
                    id: 'paginaActual',
                    value: 1
                }
            };
            onChangeBusqueda(cambio);
        }
        props.fetchIngresos();
    }

    /**
     * Cambia los filtros a aplicar, si cambia un filtro que no sea la paginación
     * vuelve a la página inicial.
     * 
     * @param {SyntheticBaseEvent} e 
     */
    const onChangeBusqueda = (e) => {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        if (e.target.id !== "paginaActual") {
            setPaginaUno(true)
        } else {
            setPaginaUno(false)
        }
        props.updateFiltros(cambio);
    }

    /**
     * Cambia la página del filtro de paginación.
     * 
     * @param {Number} pagina 
     * @returns 
     */
    const cambiarDePagina = (pagina) => {
        if (isNaN(pagina)) {
            return;
        }

        let cambio = {};
        cambio['paginaActual'] = pagina;
        props.updateFiltros(cambio);
    }

    let Ingresos = []
    ingresos.allIds.map(idIngreso => {
        let ingreso = ingresos.byId.ingresos[idIngreso];
        if (ingreso && ingreso.id) {
            let operaciones = getOperacionesIngreso(ingreso);
            Ingresos.push(
                <tr key={ingreso.id}>
                    <td>{ingreso.id_texto}</td>
                    <td>{ingreso.fecha_texto}</td>
                    <td>
                            <span>{ingreso.usuario_nombre}</span>
                            <br/>
                            <span className="texto-chico">{ingreso.usuario_email}</span>
                        </td>
                    <td className="font-weight-bold text-right px-5">
                        {ingreso.total_texto}
                    </td>
                    <td>{operaciones}</td>
                </tr>
            );
        }
    });

    if (noHayIngresos) {
        let placeholder = "Todavía no se han realizado ingresos"
        if (!totalCero) {
            placeholder = "No hay ingresos para los filtros aplicados";
        }
        Ingresos = 
            <tr className="text-center">
                <td colSpan={5}>{placeholder}</td>
            </tr>;
    }
    return (
        <div className="ingreso-listado tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.GESTION} titulo={titulo} />
                <a href="#"
                    onClick={() => history.push(rutas.INGRESO_MERCADERIA_ALTA + "?volverA=" + rutas.INGRESO_MERCADERIA)}
                    data-toggle="tooltip" data-original-title="" title="">
                    <AddBoxIcon style={{ color:  '#5cb860'}}/>
                </a>
            </div>
            <Filtros
                {...props}
                filtrar={(e) => filtrarIngresos(e)}
                onChangeBusqueda={(e) => onChangeBusqueda(e)}
            />
            <table className="table">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th className="text-right px-5">Total</th>
                        <th>Operaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {buscando ? <tr><td colSpan={5}><Loader display={true} /></td></tr> : Ingresos}
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
        ingresos: state.ingresos
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchIngresos: () => {
            dispatch(fetchIngresos())
        },
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        }
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IngresoListado))