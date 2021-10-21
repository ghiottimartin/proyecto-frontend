import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Constants
import * as rutas from "../../../../constants/rutas"

//Components
import Titulo from "../../../elementos/Titulo"

//CSS
import "../../../../assets/css/Gestion/ReemplazoMercaderia.css"

//Librerias
import AddBoxIcon from "@material-ui/icons/AddBox"
import history from '../../../../history'

function Listado(props) {
    const titulo = "Listado de reemplazos de mercaderías"

    useEffect(() => {
    }, [])

    return (
        <div className="reemplazo-mercaderia-listado tarjeta-body">
             <div className="d-flex justify-content-between">
                <Titulo ruta={rutas.GESTION} titulo={titulo} />
                <a href="#"
                    onClick={() => history.push(rutas.REEMPLAZO_MERCADERIA_ALTA + "?volverA=" + rutas.REEMPLAZO_MERCADERIA_LISTAR)}
                    data-toggle="tooltip" data-original-title="" title="">
                    <AddBoxIcon style={{ color:  '#5cb860'}}/>
                </a>
            </div>
        </div>
    );

}

function mapStateToProps(state) {
    return {
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Listado));
