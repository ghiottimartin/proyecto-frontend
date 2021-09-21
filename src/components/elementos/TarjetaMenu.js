import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import history from "../../history";

//CSS
import "../../assets/css/TarjetaMenu.css";
import * as roles from "../../constants/roles.js";

class TarjetaMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    getColorRol() {
        let rol = this.props.rol;
        switch (rol) {
            case roles.ROL_ADMIN:
                return "red";
            
            case roles.ROL_VENDEDOR:
                return "orange";
            
            default:
                return "black";
        }
    }

    getColorTextoRol() {
        let rol = this.props.rol;
        switch (rol) {
            case roles.ROL_ADMIN:
                return "white";
            
            default:
                return "black";
        }
    }

    render() {
        const props      = this.props;
        const color      = this.getColorRol();
        const colorTexto = this.getColorTextoRol();
        const margenLeftImg = this.props.margenLeftImg;
        return (
            <button onClick={() => history.push(props.ruta)} key={props.key} className="tarjeta-menu">
                <div className={"tarjeta hvr-grow"} onClick={props.click}>
                    <span className="text-capitalize rol" style={{backgroundColor: color, color: colorTexto}}>{props.rol}</span>
                    <h2>{props.titulo}</h2>
                    <img src={props.img} alt={props.alt} title={props.title} style={{marginLeft: margenLeftImg}}/>
                    <p>{props.descripcion}</p>
                </div>
            </button>
        )
    }
}

function mapStateToProps(state) {
    return {
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TarjetaMenu));