import c from "../constants/constants";
require('isomorphic-fetch');

var reemplazoMercaderia = {

    saveCreate(reemplazo) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(reemplazo)
        };

        return fetch(c.BASE_URL + '/producto/reemplazos//', defaultOptions);
    },

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
        return fetch(c.BASE_URL + '/producto/reemplazos//' + query, defaultOptions);
    },

    getReemplazo(id) {

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/producto/reemplazos//' + id, defaultOptions);
    },

    anularReemplazo(id) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            dataType: 'json',
        };

        return fetch(c.BASE_URL + '/producto/reemplazos//' + id + '/anular/', defaultOptions);
    },
    

};

export default reemplazoMercaderia;