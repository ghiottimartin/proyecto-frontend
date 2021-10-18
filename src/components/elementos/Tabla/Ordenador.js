import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Images
import arrowUp from '../../../assets/icon/up-arrow.svg';
import arrowDown from '../../../assets/icon/down-arrow.svg';

function Ordenador(props) {
    const estilosImagen = {
        width: "20px",
        display: props.orden === props.id ? "table-cell" : "none",
        marginLeft: "10px"
    };

    const estilosTexto = {
        marginRight: props.orden !== props.id ? "30px" : ""
    };

    let clase = "d-flex cursor-pointer "
    if (props.clase) {
        clase += props.clase
    }

    return (
        <th id={props.id} onClick={props.changeDireccion}>
            <div id={props.id} className={clase}>
                <span id={props.id} className="user-select-none" style={estilosTexto}>{props.texto}</span>
                <img
                    id={props.id}
                    src={props.direccion === "ASC" ? arrowDown : arrowUp}
                    style={estilosImagen}
                    alt="arrow"
                />
            </div>
        </th>
    )

}

function mapStateToProps(state) {
    return {
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Ordenador));