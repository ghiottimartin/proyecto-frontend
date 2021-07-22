//History
import history from "../../history";

//Constantes
import * as rutas from "../../constants/rutas";

//Images
import imgVolver from "../../assets/img/arrow.png";

function volverA(ruta) {
    if (ruta === null) {
        return;
    }
    history.push(ruta);
}

export default function Titulo(props) {
    let ruta = props.ruta;
    const rutaValida = rutas.validarRuta(props.ruta);
    if (!rutaValida) {
        ruta = null;
    }
    const style = {
        width: '20px',
        cursor: 'pointer',
        marginRight: '10px',
        marginBottom: '5px'
    }
    const botonStyle = {
        border: 'none',
        borderRadius: '6px',
        fontSize: '15px',
        height: '24px',
        marginLeft: '15px'
    }
    let clase = props.clase ? props.clase : "";
    let texto = "Volver a página anterior";
    let flecha = <img style={style} onClick={() => volverA(ruta)} src={imgVolver} alt="Icono volver" title={texto}/>;
    if (ruta === null) {
        flecha = "";
    }
    let operaciones = props.operaciones ? props.operaciones : [];
    let botones     = operaciones.map(op => {
        return (
            <button key={op.texto} style={botonStyle} onClick={() => history.push(op.ruta)} className={op.clase}>
                {op.texto}
            </button>
        )
    })
    return (
        <h4 className={clase} >
            {flecha}
            {props.titulo}
            {botones}
        </h4>
    )
}