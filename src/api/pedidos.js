import c from "../constants/constants";
require('isomorphic-fetch');

var pedidos = {

    getAll(idUsuario, filtros) {
        var esc = encodeURIComponent;
        var query = "&";
        if (filtros)
            query += Object.keys(filtros)
                .map(k => esc(k) + '=' + esc(filtros[k]))
                .join('&');
        
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/?usuario=' + idUsuario +  query, defaultOptions);
    },

    getPedidosVendedor(filtros) {
        var esc = encodeURIComponent;
        var query = "&";
        if (filtros)
            query += Object.keys(filtros)
                .map(k => esc(k) + '=' + esc(filtros[k]))
                .join('&');

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/listado_vendedor/?' + query, defaultOptions);
    },

    saveCreate(pedido) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(pedido)
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/', defaultOptions);
    },

    borrarPedido(id) {
        let defaultOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/' + id, defaultOptions);
    },

    cerrarPedido(idPedido, campos) {
        var esc = encodeURIComponent;
        var query = "?";
        if (campos)
            query += Object.keys(campos)
                .map(k => esc(k) + '=' + esc(campos[k]))
                .join('&');

        let defaultOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/' + idPedido + "/" + query, defaultOptions);
    },

    getPedido(id) {

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/' + id, defaultOptions);
    },

    getPedidoAbierto() {
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            dataType: 'json',
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/abierto', defaultOptions);
    },

    entregarPedido(id) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/' + id + '/entregar/', defaultOptions);
    },

    anularPedido(id, motivo) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            dataType: 'json',
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/' + id + '/anular/' + "?motivo=" + motivo, defaultOptions);
    },

    pedidoDisponible(id) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            dataType: 'json',
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/' + id + '/disponible/', defaultOptions);
    },

    comanda(id) {
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/pdf",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/gastronomia/pedido/' + id + '/comanda/', defaultOptions);
    },
    

};

export default pedidos;