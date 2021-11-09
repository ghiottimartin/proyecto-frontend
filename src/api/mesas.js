import c from "../constants/constants";
require('isomorphic-fetch');

var mesas = {

    getAll(filtros) {
        var esc = encodeURIComponent;
        var query = "?";
        if (filtros)
            query += Object.keys(filtros)
                .map(k => esc(k) + '=' + esc(filtros[k]))
                .join('&');
        
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };
        return fetch(c.BASE_URL + '/mesas/' + query, defaultOptions);
    },
    
    saveCreate(mesa) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(mesa)
        };

        return fetch(c.BASE_URL + '/mesas/mesa/', defaultOptions);
    },

    saveUpdate(mesa) {
        let defaultOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(mesa)
        };

        return fetch(c.BASE_URL + '/mesas/mesa/' + mesa.id + "/", defaultOptions);
    },

    getMesa(id) {
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/mesas/mesa/' + id, defaultOptions);
    },

};

export default mesas;