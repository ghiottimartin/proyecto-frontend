/**
 * Created by martingh15 on 21/04/2020.
 */
let develop = false;
let BASE_URL = "https://pico-backend-kiosco.herokuapp.com/api";
let BASE_PUBLIC = "https://pico-backend-kiosco.herokuapp.com/";
let CAPTCHA_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
if (develop) {
    BASE_URL = "http://localhost:8000/api";
    BASE_PUBLIC = "http://localhost:8000";
}

export default {
    BASE_URL: BASE_URL,
    BASE_PUBLIC: BASE_PUBLIC,
    CAPTCHA_KEY: CAPTCHA_KEY,
    DEBUG: '?XDEBUG_SESSION_START=PHPSTORM',
    RANDOM: Math.random() * 1000
}