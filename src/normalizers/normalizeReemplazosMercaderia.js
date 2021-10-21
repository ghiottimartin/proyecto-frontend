import { normalize, schema } from 'normalizr';

export function normalizeDato(myData){
	const reemplazo  = new schema.Entity('reemplazo', {}, {idAttribute: "id"});

    const mySchema = reemplazo;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const reemplazos  = new schema.Entity('reemplazos', {}, {idAttribute: "id"});

    const mySchemas = [reemplazos];

    return normalize(myData, mySchemas);
}


