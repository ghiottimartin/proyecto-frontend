import c from "../constants/constants";
require('isomorphic-fetch');

var categorias = {

    getAll() {
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
        };

        return fetch(c.BASE_PUBLIC + 'producto/categorias//', defaultOptions);
    },

    saveCreate(categoria) {
        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            },
            body: JSON.stringify(categoria)
        };

        return fetch(c.BASE_PUBLIC + 'producto/abm/categorias//', defaultOptions);
    },
    getCategoria(id) {

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_PUBLIC + 'producto/abm/categorias//' + id, defaultOptions);
    },
};

export default categorias;