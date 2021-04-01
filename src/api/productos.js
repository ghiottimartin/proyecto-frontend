import c from "../constants/constants";
require('isomorphic-fetch');

var productos = {

    getAll() {

        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8"
            },
            // cache: false,
            dataType: 'json'
        };

        return fetch(c.BASE_URL + '/productos', defaultOptions);
    },
};

export default productos;