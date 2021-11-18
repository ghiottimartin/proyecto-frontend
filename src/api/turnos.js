import c from "../constants/constants";
require('isomorphic-fetch');

var turnos = {

    saveCreate(id, nombreMozo) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify({'id_mesa': id, 'first_name': nombreMozo})
        };

        return fetch(c.BASE_URL + '/mesas/turno/', defaultOptions);
    },

    saveUpdate(turno) {
        delete turno.mesa

        let defaultOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(turno)
        };

        return fetch(c.BASE_URL + '/mesas/turno/' + turno.id + "/", defaultOptions);
    },

};

export default turnos;