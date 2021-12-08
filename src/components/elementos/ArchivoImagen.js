import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//CSS
import "../../assets/css/ArchivoImagen.css";

//Images
import addPhoto from "../../assets/img/add_photo_alternate.svg";

class ArchivoImagen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const props = this.props;
        return (
            <div className="seccion-archivo">
                <div className="contenedor-input-file">
                    <input
                        id={props.id}
                        className="input-file"
                        type={"file"}
                        name="file"
                        onChange={(e) => props.changeImagen(e)}
                        accept="image/*"
                        lang="es"
                    />
                    <div className="contenedor-input-trucho">
                        <p className="texto-archivo" style={{color: props.texto ? "black" : "grey"}}>
                            {props.texto ? props.texto : "Carga una imagen..."}
                        </p>
                        <label htmlFor="file">
                            {props.texto ? "Editar" : "Elegir"}
                            <img className="imgAddPhoto" alt="Agregar imagen" title="Agregar imagen" src={addPhoto}/>
                        </label>
                    </div>
                </div>
                {props.imagen !== null ?
                    <img
                        className="img-responsive imagen-vacía"
                        ref="imagenPrincipal"
                        src={props.imagen}
                        onError={(e) => e.target.src = props.imgError}
                        alt="Imagen principal animal"
                    />
                    : ""
                }

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {

    };
}

const mapDispatchToProps = (dispatch) => {
    return {}
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArchivoImagen));
