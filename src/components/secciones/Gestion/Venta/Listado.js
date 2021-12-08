import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

//Actions
import { fetchVentas, updateFiltros, updateVenta, anularVenta, pdfVenta, comandaVenta } from "../../../../actions/VentaActions"

//CSS
import "../../../../assets/css/Gestion/VentaAlmacen.css"

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
import history from "../../../../history";
import Swal from 'sweetalert2';

function Listado(props) {
    const titulo = "Listado de ventas"
    const ventas = props.ventas
    const isDownloading = ventas.byId.isDownloading
    const buscando = ventas.byId.isFetching || isDownloading

    //Filtros 
    const filtros = ventas.byId.filtros
    const registros = ventas.byId.registros
    const total = ventas.byId.total;
    const totalCero = parseInt(total) === 0;
    const [paginaUno, setPaginaUno] = useState(false)
    const [noHayVentas, setNoHayVentas] = useState(false)

    useEffect(() => {
        props.fetchVentas()
    }, [filtros.paginaActual])

    useEffect(() => {
        let noHayVentas = false
        if (props.ventas.allIds.length === 0) {
            noHayVentas = true
        }
        setNoHayVentas(noHayVentas)
    }, [props.ventas.allIds])

    /**
    * Filtra las ventas.
    * 
    * @param {SyntheticBaseEvent} e 
    */
    const filtrarVentas = (e) => {
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
        props.fetchVentas();
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
     * Devuelve una array de elementos html con las operaciones de la venta.
     * 
     * @returns {Array}
     */
     const getOperacionesVenta = (venta) => {
        let operaciones = [];
        venta.operaciones.forEach(operacion => {
            let accion = operacion.accion;            
            operaciones.push(
                <div id={operacion.key} key={operacion.key} title={operacion.title} onClick={() => ejecutarOperacion(venta, accion)} className={operacion.clase + " operacion"} >
                    <i className={operacion.icono} aria-hidden="true"></i> {operacion.texto}
                </div>
            );
        })
        return (
            <div className="fila-operaciones text-nowrap flex-wrap">
                {operaciones}
            </div>
        );
    }

     /**
     * Ejecuta la operación del listado de ventas según el caso.
     * 
     * @param {Object} venta 
     * @param {String} accion 
     */
      const ejecutarOperacion = (venta, accion)  => {
        switch (accion) {
            case 'visualizar':
                visualizarVenta(venta);
                break;
            
            case 'anular':
                anularVenta(venta);
                break;
            
            case 'pdf':
                pdfVenta(venta);
                break;

            case 'comanda':
                comandaVenta(venta);
                break;
            
        }
    }

    /**
     * Redirige a la visualización de la venta.
     * 
     * @param {Object} venta 
     */
     const visualizarVenta = (venta) => {
        props.updateVenta(venta);
        
        let ruta = rutas.VENTA_VISUALIZAR;
        ruta += venta.id;
        history.push(ruta);
    }

    
    /**
     * Anula la venta.
     * 
     * @param {Object} venta 
     */
    const anularVenta = (venta) => {
        Swal.fire({
            title: `¿Está seguro de anular la Venta ${venta.id_texto}? `,
            icon: 'question',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Anular',
            confirmButtonColor: colores.COLOR_ROJO,
            cancelButtonColor: '#bfbfbf',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                props.anularVenta(venta.id);
            }
        });
    }

    /**
     * Descarga el ticket de venta en pdf.
     */
    const pdfVenta = (venta) => {
        props.pdfVenta(venta.id)
    }

    /**
     * Descarga la comanda de la venta en pdf.
     */
    const comandaVenta = (venta) => {
        props.comandaVenta(venta.id)
    }

    let Ventas = []
    ventas.allIds.map(idVenta => {
        let venta = ventas.byId.ventas[idVenta];
        if (venta && venta.id) {
            let operaciones = getOperacionesVenta(venta);
            let tipo_venta = venta.tipo_venta_online
            if (tipo_venta !== "") {
                tipo_venta = `(${tipo_venta})`
            }
            Ventas.push(
                <tr key={venta.id} className={venta.clase_venta_impresa} style={{color: 'black'}}>
                    <td>{venta.id_texto}</td>
                    <td>{venta.fecha_texto}</td>
                    <td>
                        {venta.tipo_venta}
                        <br/>
                        <span className="text-muted">{tipo_venta}</span>
                    </td>
                    <td>
                        <span>{venta.usuario_nombre}</span>
                        <br/>
                        <span className="texto-chico">{venta.usuario_email}</span>
                    </td>
                    <td>
                        <span className={venta.estado_clase}>{venta.estado_texto}</span>
                        <span style={{ display: venta.anulada ? "block" : "none" }} className="venta-anulada">{venta.fecha_anulada}</span>
                    </td>
                    <td className="font-weight-bold text-right px-5">
                        {venta.total_texto}
                    </td>
                    <td>{operaciones}</td>
                </tr>
            );
        }
    });

    if (noHayVentas) {
        let placeholder = "Todavía no se han realizado ventas"
        if (!totalCero) {
            placeholder = "No hay ventas para los filtros aplicados";
        }
        Ventas = 
            <tr className="text-center">
                <td colSpan={7}>{placeholder}</td>
            </tr>;
    }

    return (
        <div className="venta-almacen tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.GESTION} titulo={titulo} />
                <a href="#"
                    onClick={() => history.push(rutas.VENTA_ALTA + "?volverA=" + rutas.VENTA_LISTADO)}
                    data-toggle="tooltip" data-original-title="" title="">
                    <AddBoxIcon style={{ color: '#5cb860' }} />
                </a>
            </div>
            <Filtros
                {...props}
                filtrar={(e) => filtrarVentas(e)}
                onChangeBusqueda={(e) => onChangeBusqueda(e)}
            />
            <table className="table tabla-listado">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Usuario</th>
                        <th>Estado</th>
                        <th className="text-right px-5">Total</th>
                        <th>Operaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {buscando ? <tr><td colSpan={7}><Loader display={true} /></td></tr> : Ventas}
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
        ventas: state.ventas,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchVentas: () => {
            dispatch(fetchVentas())
        },
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        },
        updateVenta: (venta) => {
            dispatch(updateVenta(venta))
        },
        anularVenta: (idVenta) => {
            dispatch(anularVenta(idVenta))
        },
        pdfVenta: (idVenta) => {
            dispatch(pdfVenta(idVenta))
        },
        comandaVenta: (idVenta) => {
            dispatch(comandaVenta(idVenta))
        },
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado))