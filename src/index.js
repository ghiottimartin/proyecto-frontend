import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

//Components
import App from './App';
import MensajeError from "./components/elementos/MensajeError";
import MensajeCorrecto from "./components/elementos/MensajeCorrecto";

//CSS
import './index.css';

//Router
import {BrowserRouter, Router} from "react-router-dom";

//Redux
import appReducers from './reducers/index';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

//Librerias
import history from "./history";

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
var createStoreWithMiddleware = null;
if (process.env.NODE_ENV !== 'production') {
    const loggerMiddleware = createLogger();
    createStoreWithMiddleware = applyMiddleware(thunk, loggerMiddleware)(createStore);
}
else {
    createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

    //Quita todos los los en produccion
    (function () {
        var method;
        var noop = function noop() { };
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];
            console[method] = noop;
        }
    }());
}

//JQuery
window.$ = window.jQuery = require( "jquery" )( window );

const store = createStoreWithMiddleware(appReducers);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Router history={history}>
                    <App />
                    <MensajeError />
                    <MensajeCorrecto />
            </Router>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();