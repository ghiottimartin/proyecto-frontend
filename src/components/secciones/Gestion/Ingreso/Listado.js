import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchIngresos, updateFiltros, updateIngreso, anularIngreso } from "../../../../actions/IngresoActions"

//CSS
import "../../../../assets/css/Gestion/Ingreso.css"

//Constants
import * as rutas from "../../../../constants/rutas"
import * as colores from "../../../../constants/colores"

//Components
import Loader from "../../../elementos/Loader"
import Titulo from "../../../elementos/Titulo"
import Filtros from "./Filtros"
import Paginacion from "../../../elementos/Paginacion"
import AddBoxIcon from "@material-ui/icons/AddBox"

//Librerías
import Swal from 'sweetalert2';
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
     * Rediriga a la ruta de movimientos de stock.
     * 
     * @param {Object} producto 
     */
     const redirigirMovimientos = (ingreso) => {
        let ruta = rutas.MOVIMIENTOS_STOCK_INGRESO
        ruta += ingreso.id
        history.push(ruta)
    }

    /**
     * Devuelve una array de elementos html con las operaciones del ingreso.
     * 
     * @returns {Array}
     */
    const getOperacionesIngreso = (ingreso) => {
        let operaciones = [];
        ingreso.operaciones.forEach(operacion => {
            let accion = operacion.accion;            
            operaciones.push(
                <div key={operacion.key} title={operacion.title} onClick={() => ejecutarOperacion(ingreso, accion)} className={operacion.clase + " operacion"} >
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

    /**
     * Ejecuta la operación del listado de ingresos según el caso.
     * 
     * @param {Object} ingreso 
     * @param {String} accion 
     */
    const ejecutarOperacion = (ingreso, accion)  => {
        switch (accion) {
            case 'visualizar':
                visualizarIngreso(ingreso);
                break;
            
            case 'anular':
                anularIngreso(ingreso);
                break;
            
            case 'stock':
                redirigirMovimientos(ingreso)
                break;
            
        }
    }

    /**
     * Redirige a la visualización del ingreso.
     * 
     * @param {Object} ingreso 
     */
    const visualizarIngreso = (ingreso) => {
        props.updateIngreso(ingreso);
        
        let ruta = rutas.INGRESO_MERCADERIA_VISUALIZAR;
        ruta += ingreso.id;
        history.push(ruta);
    }

    
    /**
     * Anula el ingreso.
     * 
     * @param {Object} ingreso 
     */
    const anularIngreso = (ingreso) => {
        Swal.fire({
            title: `¿Está seguro de anular el Ingreso ${ingreso.id_texto}? `,
            icon: 'question',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Cancelar',
            confirmButtonColor: colores.COLOR_ROJO,
            cancelButtonColor: '#bfbfbf',
            cancelButtonText: 'Continuar'
        }).then((result) => {
            if (result.isConfirmed) {
                props.anularIngreso(ingreso.id);
            }
        });
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
                    <td>
                        <span className={ingreso.estado_clase}>{ingreso.estado_texto}</span>
                        <span style={{ display: ingreso.anulado ? "block" : "none" }} className="ingreso-anulado">{ingreso.fecha_anulado}</span>
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
                <td colSpan={6}>{placeholder}</td>
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
            <table className="table tabla-listado">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Estado</th>
                        <th className="text-right px-5">Total</th>
                        <th>Operaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {buscando ? <tr><td colSpan={6}><Loader display={true} /></td></tr> : Ingresos}
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
        },
        updateIngreso: (ingreso) => {
            dispatch(updateIngreso(ingreso))
        },
        anularIngreso: (idIngreso) => {
            dispatch(anularIngreso(idIngreso))
        },
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IngresoListado))