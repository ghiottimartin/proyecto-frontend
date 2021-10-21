import c from "../constants/constants";
import $ from "jquery";
require('isomorphic-fetch');

var productos = {

    getAll(filtros) {
        var esc = encodeURIComponent;
        var query = "";
        if (filtros) {
            query = "?"
            query += Object.keys(filtros)
                .map(k => esc(k) + '=' + esc(filtros[k]))
                .join('&')
        }

        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        };

        return fetch(c.BASE_URL + '/producto/' + query, defaultOptions);
    },

    saveCreate(producto) {
        let formData = this.getFormDataProducto(producto);

        return $.ajax({
            url: c.BASE_URL + '/producto/abm//',
            data: formData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Token " + localStorage.token);
            },
            type: 'POST',
            contentType: false,
            processData: false,
            enctype: 'multipart/form-data',
        });
    },

    borrarProducto(id) {
        let defaultOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Token " + localStorage.token
            }
        };

        return fetch(c.BASE_URL + '/producto/abm//' + id + '/', defaultOptions);
    },

    saveUpdate(producto) {
        let formData = this.getFormDataProducto(producto);

        return $.ajax({
            url: c.BASE_URL + '/producto/abm//' + producto.id + '/',
            data: formData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Token " + localStorage.token);
            },
            type: 'PUT',
            contentType: false,
            processData: false,
            enctype: 'multipart/form-data',
        });
    },

    getProducto(id) {
        let defaultOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        };

        return fetch(c.BASE_URL + '/producto/' + id, defaultOptions);
    },

    getFormDataProducto(producto) {
        let formData = new FormData();
        formData.append("nombre", producto.nombre);
        formData.append("categoria", parseInt(producto.categoria));
        formData.append("habilitado", 1);
        formData.append("descripcion", producto.descripcion);
        formData.append("precio_vigente", parseFloat(producto.precio_vigente));
        formData.append("costo_vigente", parseFloat(producto.costo_vigente));
        formData.append("compra_directa", producto.compra_directa);
        formData.append("venta_directa", producto.venta_directa);
        formData.append("stock", producto.stock);
        formData.append("stock_seguridad", producto.stock_seguridad);

        if (producto && producto.imagen && producto.imagen.name) {
            formData.append("imagen", producto.imagen);
            formData.append("imagen_nombre", producto.imagen_nombre);
        }
        return formData;
    }
};

export default productos;