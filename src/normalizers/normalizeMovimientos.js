import { normalize, schema } from 'normalizr';

export function normalizeDato(myData){
	const movimiento  = new schema.Entity('movimiento', {}, {idAttribute: "id"});

    const mySchema = movimiento;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const movimientos  = new schema.Entity('movimientos', {}, {idAttribute: "id"});

    const mySchemas = [movimientos];

    return normalize(myData, mySchemas);
}


