import c from "../constants/constants";
import history from "../history";
// import {changeUser, sendingRequest} from "../actions/AuthenticationActions";
// require('es6-promise').polyfill();
require('isomorphic-fetch');


/**
 * Authentication lib
 * @type {Object}
 */
var auth = {
    /**
     * Logs a user in
     * @param  {Object}   usuario The username of the user
     * @param  {Function} callback Called after a user was logged in on the remote server
     */
    login(usuario, callback) {
        // If there is a token in the localStorage, the user already is
        // authenticated
        if (this.loggedIn()) {
            callback(true);
            return;
        }
        usuario.username = usuario.email;
        fetch(c.BASE_PUBLIC + '/auth/', {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario)
        }).then(function(response) {
            if (response.status >= 400) {
                return Promise.reject(response);
            } else {
                return response.json();
            }
        }).then(function (data) {
            localStorage.token = data.token;
            localStorage.idUsuario = data.idUsuario;
            localStorage.nombre = data.nombre;
            callback(true);
        }).catch(function (error) {
            callback(false, error);
        });
    },
    /**
     * Logs the current user out
     */
    logout(callback) {
        localStorage.removeItem('token');
        callback(true);
        /*request.post('/logout', {}, () => {
         callback(true);
         });*/
    },
    addToken(headers) {
        for (var pair of headers.entries()) {
            if (pair[0] === "authorization") {
                localStorage.token = pair[1].split(" ")[1];
            }
        }
    },
    /**
     * Checks if anybody is logged in
     * @return {boolean} True if there is a logged in user, false if there isn't
     */
    loggedIn() {
        return !!localStorage.token;
    },

    logueado() {
        return localStorage.idUsuario && localStorage.nombre
    },

    rol() {
        if (localStorage.rol)
            return localStorage.rol;
    },
    nombreUsuario() {
        if (localStorage.nombre)
            return localStorage.nombre;
    },
    idUsuario() {
        if (localStorage.idUsuario) {
            return localStorage.idUsuario;
        }
    },
    olvideMiPassword(usuario, callback) {
        // If there is a token in the localStorage, the user already is
        // authenticated
        if (this.loggedIn()) {
            callback({message: "Ya se encuentra logueado."});
            return;
        }

        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({email: usuario.email}),
            dataType: 'json',
        };
        fetch(c.BASE_URL + '/olvido-password/', defaultOptions)
            .then(function (response) {
                if (response.status >= 400) {
                    //callback(false, response);
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(function (data) {
                callback(data);
            })
            .catch(function (error) {
                callback(false, error);
            });
    },
    resetPassword(usuario, callback) {
        // If there is a token in the localStorage, the user already is
        // authenticated
        if (this.loggedIn()) {
            callback({message: "Ya se encuentra logueado."});
            return;
        }

        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(usuario)
        };
        fetch(c.BASE_URL + '/cambiar-password/', defaultOptions)
            .then(function (response) {
                if (response.status >= 400) {
                    //callback(false, response);
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(function(data) {
                callback(data);
            })
            .catch(function (error) {
                callback(false, error);
            });
    },
    validarToken(tipoToken, token, callback) {
        // If there is a token in the localStorage, the user already is
        // authenticated
        if (this.loggedIn()) {
            callback(true);
            return;
        }

        let defaultOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
        };
        let ruta = tipoToken === 'reset' ? '/validar-token/' : '/validar-email/';
        fetch(c.BASE_URL + ruta + token, defaultOptions)
            .then(function (response) {
                if (response.status >= 400) {
                    //callback(false, response);
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(function (data) {
                if (data.token) {
                    localStorage.token = data.token;
                    localStorage.idUsuario = data.idUsuario;
                    localStorage.nombre = data.nombre;
                }
                callback(true);
            })
            .catch(function (error) {
                callback(false, error);
            });
    },
};

export default auth;
