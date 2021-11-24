import { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import { resetMovimientos, fetchMovimientos, updateFiltros } from "../../../../actions/MovimientosStockActions"
import { fetchIngresoById } from "../../../../actions/IngresoActions"
import { fetchProductos } from '../../../../actions/ProductoActions'

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Titulo from "../../../elementos/Titulo"
import Loader from "../../../elementos/Loader"
import Filtros from "./Filtros"
import Paginacion from '../../../elementos/Paginacion'

//CSS
import "../../../../assets/css/Productos/Movimientos.css"

//Librerias
import history from '../../../../history'

function Listado(props) {
    const total = props.movimientos.byId.total
    const filtros = props.movimientos.byId.filtros
    const buscando = props.movimientos.byId.isFetching
    const totalCero = parseInt(total) == 0
    const registros = props.movimientos.byId.registros
    const id_ingreso = props.match.params.id_ingreso    

    useEffect(() => {
        if (id_ingreso) {
            props.fetchIngresoById(id_ingreso)
        }
        props.fetchProductos(false)
    }, [])

    let titulo = "Stock de productos"
    
    let producto = {}
    props.productos.allIds.map(idProducto => {
        let actual = props.productos.byId.productos[idProducto]
        if (actual && actual.id && parseInt(actual.id) === parseInt(props.match.params.id)) {
            producto = actual
        }
    })
    
    if (producto && producto.nombre) {
        titulo = "Movimientos de stock de " + producto.nombre
    }

    let ingreso = {}
    props.ingresos.allIds.map(idIngreso => {
        let actual = props.ingresos.byId.ingresos[idIngreso]
        if (actual && actual.id && parseInt(actual.id) === parseInt(id_ingreso)) {
            ingreso = actual
        }
    })

    if (ingreso && ingreso.id) {
        titulo = "Movimientos de stock del Ingreso " + ingreso.id_texto
    }


    const [paginaUno, setPaginaUno] = useState(false)

    useEffect(() => {
        buscarMovimientos()
    }, [filtros.paginaActual])

    /**
     * Busca los movimientos de stock según los filtros aplicados.
     */
    const buscarMovimientos = () => {
        let id = props.match.params.id
        if (isNaN(id) && isNaN(id_ingreso)) {
            history.push(rutas.GESTION)
        }

        if (!isNaN(id)) {
            props.resetMovimientos()
            props.fetchMovimientos(id)
        } else if (!isNaN(id_ingreso)) {
            props.resetMovimientos()
            props.fetchMovimientos(null, id_ingreso)
        }
    }

    let Movimientos = []
    props.movimientos.allIds.map(idMovimiento => {
        const movimiento = props.movimientos.byId.movimientos[idMovimiento];
        if (movimiento && movimiento.id) {
            Movimientos.push(
                <tr key={movimiento.id}>
                    <td>{movimiento.id_texto}</td>
                    <td>{movimiento.fecha_texto}</td>
                    <td>{movimiento.producto.nombre}</td>
                    <td>
                        <span>{movimiento.usuario_nombre}</span>
                        <br/>
                        <span className="texto-chico">{movimiento.usuario_email}</span>
                    </td>
                    <td>{movimiento.descripcion}</td>
                    <td className="text-right pr-5">{movimiento.cantidad}</td>
                </tr>
            );
        }
    });

    /**
     * Filtra los productos.
     * 
     * @param {SyntheticBaseEvent} e 
     */
     const filtrarMovimientos = (e) => {
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
        buscarMovimientos()
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

    if (totalCero) {
        Movimientos =
            <tr className="text-center">
                <td colSpan={6}>No hay movimientos cargados</td>
            </tr>;
    }

    const listadoDesdeIngresos = !isNaN(id_ingreso)
    const volverA = listadoDesdeIngresos ? rutas.INGRESO_MERCADERIA : rutas.PRODUCTOS_LISTAR_ADMIN
    return (
        <section className="movimiento-listado tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={volverA} titulo={titulo} />
                <div className="producto-stock">
                    Stock:
                    <span class="badge badge-success">{producto.stock}</span>
                </div>
            </div>
            <Filtros
                {...props}
                usuarios={listadoDesdeIngresos}
                filtrar={(e) => filtrarMovimientos(e)}
                onChangeBusqueda={(e) => onChangeBusqueda(e)}
            />
            <table className="table">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Usuario</th>
                        <th>Observaciones</th>
                        <th className="text-right pr-5">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {buscando ? <tr><td colSpan={6}><Loader display={true} /></td></tr> : Movimientos}
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
        </section>
    )

}

function mapStateToProps(state) {
    return {
        movimientos: state.movimientos,
        productos: state.productos,
        ingresos: state.ingresos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetMovimientos: () => {
            dispatch(resetMovimientos())
        },
        fetchMovimientos: (idProducto, idIngreso) => {
            dispatch(fetchMovimientos(idProducto, idIngreso))
        },
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        },
        fetchIngresoById: (id) => {
            dispatch(fetchIngresoById(id))
        },
        fetchProductos: () => {
            dispatch(fetchProductos)
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));