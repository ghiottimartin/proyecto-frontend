import { normalize, schema } from 'normalizr';

export function normalizeDato(myData){
	const ingreso  = new schema.Entity('ingreso', {}, {idAttribute: "id"});

    const mySchema = ingreso;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const ingresos  = new schema.Entity('ingresos', {}, {idAttribute: "id"});

    const mySchemas = [ingresos];

    return normalize(myData, mySchemas);
}


