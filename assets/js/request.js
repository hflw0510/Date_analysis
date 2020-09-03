let b = {};
if (typeof window !== 'undefined') {
    let a = window.location.search.substr(1).split("&");
    a.forEach(v => {
        let c = v.split("=");
        if (c.length == 2)
            b[decodeURIComponent(c[0])] = decodeURIComponent(c[1] || "");
    });
}

export default function(key) {
    return b[key];
};



/*export default (query) => {
    let r = {};
    query = query.split('&');
    query.forEach(v => {
        let c = v.split("=");
        if (c.length == 2)
            r[decodeURIComponent(c[0])] = decodeURIComponent(c[1] || "");
    });

    return r;
};*/