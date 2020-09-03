import hosts from '~/assets/config/hosts'
import jsCookie from 'js-cookie'
import urlParse from 'url-parse'
import axios from 'axios'

var tokens = {},
    apiToken='',
    apiTimeout = 0,
    ident = 1;

function rpc(url, method) {
    let r, host, subhost, token,
        d = {
            jsonrpc: "2.0",
            method: method,
            params: [],
            id: ident++
        };

    if (arguments.length < 2)
        throw ("Argments Error");

    if (arguments.length > 2)
        r = arguments[arguments.length - 1];

    if (arguments.length > 3)
        d.params = Array.prototype.slice.call(arguments, 2, arguments.length - 1)

    let u = new urlParse(url);
    host = u.hostname;

    u = new urlParse(hosts.subscribeHost);
    subhost = u.hostname;

    if (host != subhost) {
        if (new Date().valueOf() > apiTimeout) {
            apiTimeout = parseInt(cookieGet('apiTO'));
            apiToken = cookieGet('apiToken');
        }
        token = apiToken;
    } else if (tokens.hasOwnProperty(host))
        token = tokens[host];
    else if (cookieGet(host))
        token = tokens[host] = cookieGet(host);

    url += (token ? ((u.query ? '&' : '?') + 'Token=' + token) : '');

    axios.post(url, JSON.stringify(d), {
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            'request.preventCache': new Date().valueOf()
        },
    })
    .then(function (response) {
        if (response.data ? response.data.hasOwnProperty('Token') : false)
            if (host == subhost)
                tokens[host] = cookieSet(host, response.data['Token']);
        if (r)
            r(response.data);
    })
    .catch(function (error) {
        if (error.response.data ? error.response.data.hasOwnProperty('Token') : false)
            if (host == subhost)
                tokens[host] = cookieSet(host, error.response.data['Token']);

        if (r)
            r(error.response.data ? error.response.data : {
                jsonrpc: "2.0",
                error: {
                    code: error.response.status ? (0 - error.response.status) : -1,
                    message: error.message,
                    data: error
                },
                id: null
            });
    });
}

function updateToken(token) {
    apiTimeout = cookieSet('apiTO', new Date().valueOf() + 29 * 60 * 1000);
    apiToken = cookieSet('apiToken', token);
}

function resetToken() {
    apiTimeout = cookieSet('apiTO', 0);
    apiToken = cookieSet('apiToken', '');
}

function getApiToken() {
    if (new Date().valueOf() > apiTimeout) {
        apiTimeout = parseInt(cookieGet('apiTO'));
        apiToken = cookieGet('apiToken');
    }
    return apiToken;
};

function cookieGet(key){
    let cToken = {};
    if (jsCookie.get('token'))
        cToken = jsCookie.getJSON('token');
    return cToken.hasOwnProperty(key)?cToken[key]:'';
}

function cookieSet(key, value){
    let cToken = {};
    if (jsCookie.get('token'))
        cToken = jsCookie.getJSON('token');
    cToken[key] = value;
    jsCookie.set('token', cToken);
    return value;
}

export {updateToken, resetToken, getApiToken};

export default rpc;