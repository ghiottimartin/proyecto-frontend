import c from "../constants/constants";
require('isomorphic-fetch');

var ingresos = {

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
        return fetch(c.BASE_URL + '/producto/ingreso//' + query, defaultOptions);
    },


    saveCreate(ingreso) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(ingreso)
        };

        return fetch(c.BASE_URL + '/producto/ingreso//', defaultOptions);
    },

    getIngreso(id) {

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/producto/ingreso//' + id, defaultOptions);
    },
    

};

export default ingresos;