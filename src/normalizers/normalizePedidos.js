import { normalize, schema } from 'normalizr';

export function normalizeDato(myData) {
    const lineas   = new schema.Entity('lineas', {}, {idAttribute: "id"});
    const pedido  = new schema.Entity('pedido', {lineas: [lineas]}, {idAttribute: "id"});

    const mySchema = pedido;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const pedidos  = new schema.Entity('pedidos', {}, {idAttribute: "id"});

    const mySchemas = [pedidos] ;

    return normalize(myData, mySchemas);
}


