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

//CSS
import "../../../../../assets/css/Productos/Movimientos.css"

//Librerias
import history from '../../../../../history'

function Listado(props) {
    const titulo = "Stock de productos"
    const buscando = props.movimientos.byId.isFetching
    const [paginaUno, setPaginaUno] = useState(false)

    useEffect(() => {
        buscarMovimientos()
    }, [])

    /**
     * Busca los movimientos de stock según los filtros aplicados.
     */
    const buscarMovimientos = () => {
        props.resetMovimientos()
        props.fetchMovimientos()
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
                        <th className="text-right pr-5">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {buscando ? <tr><td colSpan={6}><Loader display={true} /></td></tr> : Movimientos}
                </tbody>
            </table>
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
        fetchMovimientos: () => {
            dispatch(fetchMovimientos())
        },
        updateFiltros: (filtros) => {
            dispatch(updateFiltros(filtros))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));