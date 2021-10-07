import c from "../constants/constants";
require('isomorphic-fetch');

var ingresos = {


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
    

};

export default ingresos;