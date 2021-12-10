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
        return fetch(c.BASE_URL + '/mesas/mesa/' + query, defaultOptions);
    },
    
    saveCreate(mesa) {
        let ultimo_turno = mesa.ultimo_turno ? mesa.ultimo_turno : null;
        let mesa_turno = ultimo_turno !== null && !isNaN(ultimo_turno.id) ? ultimo_turno.mesa : null;
        if (mesa_turno !== null && !isNaN(mesa_turno.id)) {
            mesa.ultimo_turno.mesa = mesa_turno.id;
        }
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
        let ultimo_turno = mesa.ultimo_turno ? mesa.ultimo_turno : null;
        let mesa_turno = ultimo_turno !== null && !isNaN(ultimo_turno.id) ? ultimo_turno.mesa : null;
        if (mesa_turno !== null && !isNaN(mesa_turno.id)) {
            mesa.ultimo_turno.mesa = mesa_turno.id;
        }
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

    borrarMesa(id) {
        let defaultOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/mesas/mesa/' + id, defaultOptions);
    },

};

export default mesas;