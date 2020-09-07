import hosts from '~/assets/config/hosts'
import request from '~/assets/js/request'
import rpc, { updateToken, resetToken, getApiToken } from '~/assets/js/rpc'
let session = {};

function logon(user, pwd, r, e) {
    if (user && pwd) {
        rpc(hosts.subscribeHost + "/auth.asp", "Auth.User_Logon", user, pwd, function(d) {
            if (d.error)
                return e ? e(d) : undefined;
            if (r)
                r(d.result.userid);
        });
        return;
    }

    return sync(r, function(d) {
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
    rpc(hosts.subscribeHost + "/auth.asp", "Auth.Sync", function(d) {
        if (d.error)
            return e(d);
        if (r)
            r(d);
    })
}

function logoff(url) {
    rpc(hosts.subscribeHost + "/auth.asp", "Auth.Logout");
    passport.logon();
}

var passport = {
    logon: function(url) {
        //window.location = hosts.logonHost + "/api/logon.asp?id=1&ru=" + encodeURI(url ? url : window.location) + "&tw=1800&sm=0&lc=2052";
        window.location = "/logon";
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