import { normalize, schema } from 'normalizr';

export function normalizeDato(myData){
	const turno  = new schema.Entity('turno', {}, {idAttribute: "id"});

    const mySchema = turno;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const turnos  = new schema.Entity('turnos', {}, {idAttribute: "id"});

    const mySchemas = [turnos];

    return normalize(myData, mySchemas);
}


