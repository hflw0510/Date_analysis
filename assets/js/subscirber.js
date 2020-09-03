import rpc from '~/assets/js/rpc'
import hosts from '~/assets/config/hosts'

let subMan = new SubscriberManager();

function SubscriberManager() {
    var channels = {},
        pos = 0,
        subscriberId,
        bStart = false;

    this.on = function(channel, cb) {
        if (!channels.hasOwnProperty(channel)) {
            channels[channel] = [];
            queue_add(channel);
        }
        let a = channels[channel];
        for (let i = 0; i < a.length; i++) {
            if (a[i] === cb)
                return cb;
        }
        a.push(cb);
        return cb;
    };

    this.off = function(channel, cb) {
        if (!channels.hasOwnProperty(channel))
            return false;
        let a = channels[channel];
        for (let i = 0; i < a.length; i++)
            if (a[i] === cb) {
                a.splice(i, 1);
                if (a.length == 0) {
                    delete channels[channel];
                    queue_sub(channel);
                }
                return true;

            }
        return false;
    };

    function trigger(channel, message) {
        if (channels[channel]) {
            let a = channels[channel];
            for (let i = 0; i < a.length; i++) {
                try {
                    a[i](message);
                } catch (e) {}
            }
        }
    };

    var queue = {},
        pending = false;

    function queue_proc() {
        if (pending)
            return;
        pending = true;
        setTimeout(function() {
            let a = [],
                b = [];
            for (channel in queue)
                if (queue[channel])
                    a.push(channel);
                else
                    b.push(channel);
            if (a.length)
                subscrib(a);
            if (b.length)
                unsubscrib(b);
            pending = false;
            queue = {};
        }, 0);
    }

    function queue_add(channel) {
        if (queue.hasOwnProperty(channel))
            delete queue[channel];
        else
            queue[channel] = true;
        queue_proc();
    }

    function queue_sub(channel) {
        if (queue.hasOwnProperty(channel))
            delete queue[channel];
        else
            queue[channel] = false;
        queue_proc();
    }

    function subscrib(channel, cb) {
        rpc(hosts.subscribeHost + "/subscribe.asp", "CSubscriber.Subscribe", subscriberId, channel, function(data) {
            if (cb)
                cb();
        });
    }

    function unsubscrib(channel, cb) {
        rpc(hosts.subscribeHost + "/subscribe.asp", "CSubscriber.UnSubscribe", subscriberId, channel, function(data) {
            if (cb)
                cb();
        });
    }

    function notifyResult(data) {
        if (data.result) {
            if (data.result.GlobalToken) rpc.updateToken(data.result.GlobalToken);
            msgs = data.result['q'];
            pos = data.result['p'];
            for (let i in msgs) {
                trigger(msgs[i].n, msgs[i].m);
            }
            notify();
        } else {
            switch (data.error.msg) {
                case "notlogon":
                    bStart = false;
                    trigger("online", "notlogon");
                    return;
            }
            setTimeout(notify, 5000);
        }
    }

    function notify() {
        rpc(hosts.subscribeHost + "/subscribe.asp", "CSubscriber.Notify", subscriberId, pos, notifyResult);
    }

    this.init = function(r, e) {
        if (bStart)
            return;
        bStart = true;
        pos = 0;
        subscriberId = uuid();
        rpc(hosts.subscribeHost + "/subscribe.asp", "CSubscriber.Init", subscriberId, function(data) {
            if (data.result) {
                let a = [];
                for (let i in channels)
                    a.push(i);
                if (a.length)
                    subscrib(a, function() {
                        notify();
                    });
                else
                    notify();
                if (r)
                    return r(data.result);
            } else {
                bStart = false;
                trigger("online", "notlogon");
                if (e)
                    return e(data);
            }
        });
    }

}

export default {
    on (channel, cb) {
        return subMan.on(channel, cb);
    },
    off (channel, cb) {
        return subMan.off(channel, cb);
    },
    start (r, e) {
        subMan.init(r, e);
    }
}