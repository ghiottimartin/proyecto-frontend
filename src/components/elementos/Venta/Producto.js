//Constants
import c from "../../../constants/constants";

//CSS
import "../../../assets/css/Producto.css";

//Images
import productoVacio from "../../../assets/img/emptyImg.jpg";

//Utils
import { formatearMoneda } from "../../../utils/formateador"

function Producto(props) {
    const cantidad = parseInt(props.cantidad)
    const producto = props.producto
    const entregas = props.entregas ? props.entregas : 0
    const ocultarDescipcion = props.ocultarDescipcion ? props.ocultarDescipcion : false;
    let path = productoVacio;
    if (producto.imagen) {
        try {
            path = c.BASE_PUBLIC + producto.imagen;
        } catch (e) {
        }
    }

    const mostrarStock = props.mostrarStock ? props.mostrarStock : false
    const stock = props.stock !== undefined ? props.stock : null
    return (
        <article key={producto.id} className="producto no-cerrar-carrito  position-relative">
            <span className="producto-entregas mt-2" style={{display: !isNaN(cantidad) ? "block" : "none"}}>
                <i className="fas fa-concierge-bell mr-2"></i>
                {entregas}/{cantidad}
            </span>
            <span style={{display: mostrarStock ? "block" : "none"}} className="producto-stock badge badge-primary badge-pill float-right" title={`Stock del producto ${producto.nombre}`}>
                {stock}
            </span>
            <div className="producto-izquierda">
                <img src={path} onError={(e) => e.target.src = productoVacio} alt="Imagen de producto" />
            </div>
            <div className="producto-derecha">
                <div className="producto-derecha-titulos">
                    <h2>{producto.nombre}</h2>
                    <h3 style={{display: ocultarDescipcion ? 'none' : 'block'}}>{producto.descripcion}</h3>
                </div>
                <div className="producto-derecha-carrito d-flex flex-column">
                    <p className="producto-derecha-precio font-weight-bold text-right pr-2 m-0 text-nowrap font-weight-bold">
                        <b>P:</b> {formatearMoneda(producto.precio_vigente)}
                    </p>
                    <p className="producto-derecha-precio font-weight-bold text-right pr-2 m-0 text-nowrap font-weight-bold">
                        <b>ST:</b> {formatearMoneda(props.subtotal)}
                    </p>
                    <div className="producto-derecha-carrito-cantidad-gestion">
                        <button
                            className="mr-2"
                            style={{ display: cantidad > 1 ? "inline-block" : "none" }}
                            onClick={() => props.agregarCantidad(producto, -1)}>
                            -
                        </button>
                        <span style={{ marginLeft: cantidad > 1 ? "" : "28px" }}>{cantidad}</span>
                        <button
                            className="ml-2"
                            onClick={() => props.agregarCantidad(producto, 1)}>
                            +
                        </button>
                    </div>
                </div>
            </div>
            <button className="boton-icono-quitar boton-icono-quitar-responsive" data-id={producto.id} onClick={(e) => props.quitarProducto(e)}>
                <i data-id={producto.id} className="fa fa-times"></i>
            </button>
        </article>
    )
}

export default Producto;
