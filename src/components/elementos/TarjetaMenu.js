import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//CSS
import "../../assets/css/TarjetaMenu.css";
import * as roles from "../../constants/roles.js";

class TarjetaMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    getColorRol(rol) {
        switch (rol) {
            case roles.ROL_ADMIN:
                return "red";
            
            case roles.ROL_VENDEDOR:
                return "orange";
            
            default:
                return "black";
        }
    }

    getColorTextoRol(rol) {
        switch (rol) {            
            default:
                return "white";
        }
    }

    getTitularTexto(titular) {
        const color      = this.getColorRol(titular);
        const colorTexto = this.getColorTextoRol(titular);
        return(<span key={this.props.id} className="text-capitalize rol" style={{backgroundColor: color, color: colorTexto}}>{titular}</span>)
    }

    render() {
        const props = this.props
        const titular = props.titular;
        const rolTexto = this.getTitularTexto(titular);
        const margenLeftImg = this.props.margenLeftImg;
        return (
            <a href={props.ruta} key={props.id + "-tarjeta"} className="tarjeta-menu">
                <div className={"tarjeta hvr-grow"} onClick={props.click}>
                    <div className="roles text-capítalize">
                        {rolTexto}
                    </div>
                    <h2>{props.titulo}</h2>
                    <img src={props.img} alt={props.alt} title={props.title} style={{marginLeft: margenLeftImg}}/>
                    <p>{props.descripcion}</p>
                </div>
            </a>
        )
    }
}

function mapStateToProps(state) {
    return {
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TarjetaMenu));