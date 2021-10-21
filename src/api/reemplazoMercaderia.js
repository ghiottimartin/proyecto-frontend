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
    

};

export default reemplazoMercaderia;