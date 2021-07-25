/**
 * Created by martingh15 on 21/04/2020.
 */
let develop = false;
let BASE_URL = "https://ancient-oasis-22601.herokuapp.com/api";
let BASE_PUBLIC = "https://ancient-oasis-22601.herokuapp.com/";
if (develop) {
    BASE_URL = "http://localhost:8000/api";
    BASE_PUBLIC = "http://localhost:8000/";
}

export default {
    BASE_URL: BASE_URL,
    BASE_PUBLIC: BASE_PUBLIC,
    DEBUG: '?XDEBUG_SESSION_START=PHPSTORM',
    RANDOM: Math.random() * 1000
}