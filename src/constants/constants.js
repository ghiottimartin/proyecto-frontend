/**
 * Created by martingh15 on 21/04/2020.
 */

//localhost
let BASE_URL = "";
let BASE_PUBLIC = "";
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_ENVI) {
    BASE_URL = "http://localhost:8000/api";
    BASE_PUBLIC = "http://localhost:8000/";
}


//testing
if (process.env.REACT_APP_ENVI === 'develop') {
    BASE_URL = "https://ancient-oasis-22601.herokuapp.com/api";
    BASE_PUBLIC = "https://ancient-oasis-22601.herokuapp.com/";
}


//Produccion
if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_ENVI) {
    BASE_URL = "https://ancient-oasis-22601.herokuapp.com/api";
    BASE_PUBLIC = "https://ancient-oasis-22601.herokuapp.com/";
}

export default {
    BASE_URL: BASE_URL,
    BASE_PUBLIC: BASE_PUBLIC,
    DEBUG: '?XDEBUG_SESSION_START=PHPSTORM',
    RANDOM: Math.random() * 1000
}