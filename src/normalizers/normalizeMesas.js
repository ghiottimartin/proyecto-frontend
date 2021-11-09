import { normalize, schema } from 'normalizr';

export function normalizeDato(myData){
	const mesa  = new schema.Entity('mesa', {}, {idAttribute: "id"});

    const mySchema = mesa;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const mesas  = new schema.Entity('mesas', {}, {idAttribute: "id"});

    const mySchemas = [mesas];

    return normalize(myData, mySchemas);
}


