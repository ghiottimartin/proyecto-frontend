import c from "../constants/constants";
import $ from "jquery";
require('isomorphic-fetch');

var pedidos = {

    getAll() {

        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token
            },
            dataType: 'json'
        };

        return fetch(c.BASE_URL + '/pedidos', defaultOptions);
    },

    saveCreate(pedido) {
        let defaultOptions = {
            url: '',
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token
            },
            dataType: 'json',
            body: JSON.stringify(pedido)
        };

        return fetch(c.BASE_URL + '/pedidos', defaultOptions);
    },

    borrarPedido(id) {
        let defaultOptions = {
            url: '',
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token
            },
            dataType: 'json',
        };

        return fetch(c.BASE_URL + '/pedidos/' + id, defaultOptions);
    },

    saveUpdate(pedido) {
        let defaultOptions = {
            url: '',
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token
            },
            dataType: 'json',
            body: JSON.stringify(pedido)
        };

        return fetch(c.BASE_URL + '/pedidos' + pedido.id, defaultOptions);
    },

    getPedido(id) {

        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token
            },
            dataType: 'json',
        };

        return fetch(c.BASE_URL + '/pedido/' + id, defaultOptions);
    },

    getPedidoAbierto() {
        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token
            },
            dataType: 'json',
        };

        return fetch(c.BASE_URL + '/pedidos', defaultOptions);
    }

};

export default pedidos;