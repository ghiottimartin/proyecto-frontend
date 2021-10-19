import { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Actions
import { resetMovimientos, fetchMovimientos, updateFiltros } from "../../../../../actions/MovimientosStockActions"

//Constants
import * as rutas from "../../../../../constants/rutas"

//Components
import Titulo from "../../../../elementos/Titulo"
import Loader from "../../../../elementos/Loader"
import Filtros from "./Filtros"
import Paginacion from '../../../../elementos/Paginacion'
import AddBoxIcon from "@material-ui/icons/AddBox"

//CSS
import "../../../../../assets/css/Productos/Movimientos.css"

//Librerias
import history from '../../../../../history'

function Listado(props) {
    const total = props.movimientos.byId.total
    const filtros = props.movimientos.byId.filtros
    const buscando = props.movimientos.byId.isFetching
    const totalCero = parseInt(total) == 0
    const registros = props.movimientos.byId.registros

    let titulo = "Stock de productos"
    let producto = {}
    props.productos.allIds.map(idProducto => {
        let actual = props.productos.byId.productos[idProducto]
        if (actual && actual.id && parseInt(actual.id) === parseInt(props.match.params.id)) {
            producto = actual
        }
    })
    
    if (producto && producto.nombre) {
        titulo = "Movimientos de stock de '" + producto.nombre + "'"
    }


    const [paginaUno, setPaginaUno] = useState(false)

    useEffect(() => {
        buscarMovimientos()
    }, [filtros.paginaActual])

    /**
     * Busca los movimientos de stock según los filtros aplicados.
     */
    const buscarMovimientos = () => {
        const id = props.match.params.id
        if (isNaN(id)) {
            history.push(rutas.PRODUCTOS_LISTAR_ADMIN)
        }

        props.resetMovimientos()
        props.fetchMovimientos(id)
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

    return (
        <section className="movimiento-listado tarjeta-body">
            <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.PRODUCTOS_LISTAR_ADMIN} titulo={titulo} />
            </div>
            <Filtros
                {...props}
                filtrar={(e) => filtrarMovimientos(e)}
                onChangeBusqueda={(e) => onChangeBusqueda(e)}
            />
            <table className="table">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Observaciones</th>
                        <th className="text-right pr-5">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {buscando ? <tr><td colSpan={5}><Loader display={true} /></td></tr> : Movimientos}
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
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetMovimientos: () => {
            dispatch(resetMovimientos())
        },
        fetchMovimientos: (idProducto) => {
            dispatch(fetchMovimientos(idProducto))
        },
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));