import { normalize, schema } from 'normalizr';

export function normalizeDato(myData){
	const venta  = new schema.Entity('venta', {}, {idAttribute: "id"});

    const mySchema = venta;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const ventas  = new schema.Entity('ventas', {}, {idAttribute: "id"});

    const mySchemas = [ventas];

    return normalize(myData, mySchemas);
}


