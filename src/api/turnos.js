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

    anular(id) {
        let defaultOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/mesas/turno/' + id + "/anular/", defaultOptions);
    },

    cerrar(turno) {        
        delete turno.mesa

        let defaultOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(turno)
        };

        const id = turno.id
        return fetch(c.BASE_URL + '/mesas/turno/' + id + "/cerrar/", defaultOptions);
    },

    getAll(idMesa, filtros) {
        var esc = encodeURIComponent;
        var query = `?idMesa=${idMesa}&`;
        if (filtros) {
            query += Object.keys(filtros)
                .map(k => esc(k) + '=' + esc(filtros[k]))
                .join('&');
        }
        
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };
        return fetch(c.BASE_URL + '/mesas/turno/turnos/' + query, defaultOptions);
    },

    comanda(id) {
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/pdf",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/mesas/turno/' + id + '/comanda/', defaultOptions);
    },

};

export default turnos;