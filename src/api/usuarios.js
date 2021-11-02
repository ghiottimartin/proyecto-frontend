import c from "../constants/constants";
require('isomorphic-fetch');

var usuarios = {

    saveCreate(usuario, admin) {
        usuario.username = usuario.email.substring(0, usuario.email.lastIndexOf("@"));
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(usuario)
        };

        let url = "/registro/";
        if (admin) {
            url = "/usuarios/";
            defaultOptions.headers = {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        }

        return fetch(c.BASE_URL + url, defaultOptions);
    },

    getLogueado() {
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Authorization": "Token " + localStorage.token
            }
        };
        return fetch(c.BASE_URL + '/usuarios/' + localStorage.idUsuario + "/", defaultOptions);
    },

    saveUpdate(usuario, habilitar) {

        let defaultOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(usuario)
        };

        let query = ""
        if (habilitar) {
            query = "?habilitado=true"
        }

        return fetch(c.BASE_URL + '/usuarios/' + usuario.id + "/" + query, defaultOptions);
    },

    getUsuarios(filtros) {
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

        return fetch(c.BASE_URL + '/usuarios/' + query, defaultOptions);
    },

    getUsuario(id) {

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/usuarios/' + id + '/', defaultOptions);
    },

    borrarUsuario(id, motivo) {

        let defaultOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };
        if (!motivo) {
            motivo = ""
        }
        return fetch(c.BASE_URL + '/usuarios/' + id + '/' + "?motivo=" + motivo, defaultOptions);
    },
};

export default usuarios;