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
            case roles.ROL_ADMIN:
                return "white";
            
            default:
                return "black";
        }
    }

    getTextoRoles() {
        let roles = [];
        let usuario    = this.props.usuarios.update.logueado;
        let rolesArray = usuario && usuario.rolesArray ? usuario.rolesArray : [];
        this.props.roles.map(rol => {
            const key        = this.props.roles.indexOf(rol) + 1;
            const color      = this.getColorRol(rol);
            const colorTexto = this.getColorTextoRol(rol);
            const tieneRol = rolesArray.includes(rol);
            if (tieneRol) {
                roles.push(
                    <span key={key} className="text-capitalize rol" style={{backgroundColor: color, color: colorTexto}}>{rol}</span>
                )
            }
        })
        return roles
    }

    render() {
        const props = this.props;
        const rolesTexto = this.getTextoRoles();
        const margenLeftImg = this.props.margenLeftImg;
        return (
            <button onClick={() => history.push(props.ruta)} key={props.key} className="tarjeta-menu">
                <div className={"tarjeta hvr-grow"} onClick={props.click}>
                    <div className="roles text-capítalize">
                        {rolesTexto}
                    </div>
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
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TarjetaMenu));