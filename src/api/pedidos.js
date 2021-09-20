import c from "../constants/constants";
require('isomorphic-fetch');

var pedidos = {

    getAll(idUsuario) {

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
        };

        return fetch(c.BASE_PUBLIC + 'gastronomia/pedido/?usuario=' + idUsuario, defaultOptions);
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

        return fetch(c.BASE_PUBLIC + 'gastronomia/pedido/', defaultOptions);
    },

    borrarPedido(id) {
        let defaultOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_PUBLIC + 'gastronomia/pedido/' + id, defaultOptions);
    },

    cerrarPedido(idPedido) {
        let defaultOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
        };

        return fetch(c.BASE_PUBLIC + 'gastronomia/pedido/' + idPedido + "/", defaultOptions);
    },

    getPedido(id) {

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_PUBLIC + 'gastronomia/pedido/' + id, defaultOptions);
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

        return fetch(c.BASE_PUBLIC + 'gastronomia/pedido/abierto', defaultOptions);
    },

    recibirPedido(id) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
        };

        return fetch(c.BASE_PUBLIC + 'gastronomia/pedido/' + id + '/recibir/', defaultOptions);
    },

    cancelarPedido(id) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            dataType: 'json',
        };

        return fetch(c.BASE_PUBLIC + 'gastronomia/pedido/' + id + '/cancelar/', defaultOptions);
    },
    

};

export default pedidos;