import c from "../constants/constants";
require('isomorphic-fetch');

var turnos = {

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