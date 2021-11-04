import c from "../constants/constants";
require('isomorphic-fetch');

var ventas = {

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
        return fetch(c.BASE_URL + '/gastronomia/venta//' + query, defaultOptions);
    },


    saveCreate(venta) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(venta)
        };

        return fetch(c.BASE_URL + '/gastronomia/venta//', defaultOptions);
    },

    getVenta(id) {

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/gastronomia/venta//' + id, defaultOptions);
    },

    anularVenta(id) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            dataType: 'json',
        };

        return fetch(c.BASE_URL + '/gastronomia/venta//' + id + '/anular/', defaultOptions);
    },

    pdf(id) {
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/pdf",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/gastronomia/venta//' + id + '/pdf/', defaultOptions);
    }
    

};

export default ventas;