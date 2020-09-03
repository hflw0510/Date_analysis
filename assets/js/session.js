import hosts from '~/assets/config/hosts'
import request from '~/assets/js/request'
import rpc, { updateToken, resetToken, getApiToken } from '~/assets/js/rpc'
let session = {};

function logon(r, e) {
    var t = request("t"),
        p = request("p");

    if (t && p) {
        resetToken();
        rpc(hosts.subscribeHost + "/auth.asp", "Logon.Passport", t, p, function(d) {
            if (d.error)
                return e ? e(d) : undefined;
            if (d.result.GlobalToken)
                updateToken(d.result.GlobalToken);
            session = d.result.Session;
            if (r)
                r(session["Logon"]);
        });
        return;
    }

    if (getApiToken() != "")
        return sync(r, function(d) {
            resetToken();
            if (e)
                e(d);
        });
    if (e)
        e({
            error: {
                code: 10086,
                msg: "logonrequire"
            }
        });
}

function sync(r, e) {
    rpc(hosts.subscribeHost + "/auth.asp", "Logon.Sync", function(d) {
        if (d.error)
            return e(d);
        session = d.result.Session;
        if (d.result.GlobalToken)
            updateToken(d.result.GlobalToken);
        r(session["Logon"]);
    })
}

function logoff(url) {
    rpc(hosts.subscribeHost + "/auth.asp", "Logon.Logoff");
    resetToken();
    setTimeout(function() {
        passport.logoff(url);
    }, 100);
}

var passport = {
    logon: function(url) {
        window.location = hosts.logonHost + "/api/logon.asp?id=1&ru=" + encodeURI(url ? url : window.location) + "&tw=1800&sm=0&lc=2052";
    },
    register: function(url) {
        window.location = config.logonHost + "/api/logon.asp?id=1&ru=" + encodeURI(url ? url : window.location) + "&tw=1800&sm=0&lc=2052&fun=register";
    },
    logoff: function(url) {
        window.location = config.logonHost + "/api/logoff.asp?id=1&ru=" + encodeURI(url ? url : location.protocol + "//" + location.host);
    }
};

export default {
    logon,
    logoff,
    passport,
    get (k) {
        return session[k];
    },
    set (k, v) {
        session[k] = v;
        return session;
    },
    isLogon () {
        return session.hasOwnProperty("Logon");
    }
};