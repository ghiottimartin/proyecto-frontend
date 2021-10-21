import { combineReducers } from 'redux';
import authentication from "./authentication";
import usuarios from './usuarios';
import productos from './productos';
import categorias from './categorias';
import pedidos from './pedidos';
import ingresos from './ingresos';
import movimientos from './movimientos';
import reemplazos from './reemplazos';

const appReducers = combineReducers({
    authentication,
    usuarios,
	productos,
    categorias,
    pedidos,
    ingresos,
    movimientos,
    reemplazos
});

export default appReducers;