module.exports = (username_, password_, target_ip_) => {
    const sha1 = require('./sha1');
    const md5 = require('./md5');
    const base64 = require("./base64")();
    const http = require("http");
    // const debuging = true;
    const debuging = false;
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0";
    const host = '10.248.98.2';
    const url_ = `http://${host}`;
    const urlEncode = (url, data) => {
        if (!data) return url;
        res = "";
        for (k in data) res += k + '=' + encodeURIComponent(data[k]) + "&";
        res = res.slice(0, -1);
        if (res.length > 0) url += "?" + res;
        return url;
    };
    function byteToString(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        var str = '',
            _arr = arr;
        for (var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }
    const paramEncode = (data) => {
        res = "";
        for (k in data) res += k + '=' + encodeURIComponent(data[k]) + "&";
        res = res.slice(0, -1);
        if (res.length > 0) res = '?' + res;
        return res;
    };
    const requestIt = (path, data, callback) => {
        const deJson = (data) => data;
        const deCode = callback;
        if (!callback) callback = 'deJson';
        else callback = 'deCode';
        data.callback = callback;
        if (debuging) console.log("path", path, 'data', data);
        path = path + paramEncode(data);
        if (debuging) console.log('encoder', path);
        return (async (deJson, deCode) => {
            const text = await (new Promise((resolve, reject) => {
                const req = http.request({
                    hostname: host,
                    port: 80,
                    path: path,
                    method: 'GET',
                    headers: {
                        'User-Agent': userAgent
                    }
                }, res => {
                    // if (debuging) console.log('res', res);
                    if (debuging) console.log(`状态码: ${res.statusCode}`);
                    res.on('data', data => {
                        const d = byteToString(data);
                        if (debuging) console.log('got data', d)
                        resolve(d);
                    });
                });
                req.end();
            }));
            if (debuging) console.log('text', text);
            return eval(text);
        })(deJson, deCode);
    };
    var enc = "s" + "run" + "_bx1", n = 200, type = 1;

    function xEncode(str, key) {
        if (str == "") {
            return "";
        }
        var v = s(str, true),
            k = s(key, false);
        if (k.length < 4) {
            k.length = 4;
        }
        var n = v.length - 1,
            z = v[n],
            y = v[0],
            c = 0x86014019 | 0x183639A0,
            m,
            e,
            p,
            q = Math.floor(6 + 52 / (n + 1)),
            d = 0;
        while (0 < q--) {
            d = d + c & (0x8CE0D9BF | 0x731F2640);
            e = d >>> 2 & 3;
            for (p = 0; p < n; p++) {
                y = v[p + 1];
                m = z >>> 5 ^ y << 2;
                m += (y >>> 3 ^ z << 4) ^ (d ^ y);
                m += k[(p & 3) ^ e] ^ z;
                z = v[p] = v[p] + m & (0xEFB8D130 | 0x10472ECF);
            }
            y = v[0];
            m = z >>> 5 ^ y << 2;
            m += (y >>> 3 ^ z << 4) ^ (d ^ y);
            m += k[(p & 3) ^ e] ^ z;
            z = v[n] = v[n] + m & (0xBB390742 | 0x44C6F8BD);
        }
        return l(v, false);
    }

    function s(a, b) {
        var c = a.length, v = [];
        for (var i = 0; i < c; i += 4) {
            v[i >> 2] = a.charCodeAt(i) | a.charCodeAt(i + 1) << 8 | a.charCodeAt(i + 2) << 16 | a.charCodeAt(i + 3) << 24;
        }
        if (b) {
            v[v.length] = c;
        }
        return v;
    }

    function l(a, b) {
        var d = a.length, c = (d - 1) << 2;
        if (b) {
            var m = a[d - 1];
            if ((m < c - 3) || (m > c))
                return null;
            c = m;
        }
        for (var i = 0; i < d; i++) {
            a[i] = String.fromCharCode(a[i] & 0xff, a[i] >>> 8 & 0xff, a[i] >>> 16 & 0xff, a[i] >>> 24 & 0xff);
        }
        if (b) {
            return a.join('').substring(0, c);
        } else {
            return a.join('');
        }
    }

    const getChallenge = (url, data, callback) => {
        requestIt("/cgi-bin/get_challenge", data, callback);
    }

    function json(d) {
        return JSON.stringify(d);
    }

    function info(d, k) {
        return "{SRBX1}" + base64.encode(xEncode(json(d), k));
    }

    const pwd = (d, k) => {
        return md5(d, k);
    }

    function chksum(d) {
        return sha1(d);
    }

    /*
     * SRUN Portal Auth CGI
     */
    function srunPortal(url, data, callback) {
        requestIt("/cgi-bin/srun_portal", data, callback);
    }

    /*
     * OS
     */
    const getOS = () => {
        return {
            device: "Windows 10",
            platform: "Windows"
        }
    }

    /*
     * Format Error
     */
    function formatError(error) {
        var str = "";
        str = error.replace(/(_|, | |^)\S/g, function (s) {
            s = s.replace(/(_|, | )/, "");
            return s.toUpperCase();
        });
        return str.replace(/\./g, "");
    }

    /*
     * GET Error
     */
    function error(code, error, msg) {
        if (typeof (code) == "number" || code == "") {
            if (typeof msg != "undefined" && msg != "") {
                return formatError(msg); //Format Error
            }
            return formatError(error); //Format Error
        }
        if (code == "E2901") {
            return msg;
        }
        return code;
    }

    const login = function (url, data, callback) {
        var username = data.username + (data.domain || "");
        var challengeCallback = function (response) {
            if (response.error != "ok") {
                //Process Error Message
                var message = error(response.ecode, response.error);
                return callback({
                    error: "fail",
                    message: message
                });
            }
            var token = response.challenge,
                i = info({
                    username: username,
                    password: data.password,
                    ip: (data.ip || response.client_ip),
                    acid: data.ac_id,
                    enc_ver: enc
                }, token),
                hmd5 = pwd(data.password, token);
            var chkstr = token + username;
            chkstr += token + hmd5;
            chkstr += token + data.ac_id;
            chkstr += token + (data.ip || response.client_ip);
            chkstr += token + n;
            chkstr += token + type;
            chkstr += token + i;
            var os = getOS();

            if (data.otp) {
                data.password = "{OTP}" + data.password;
            } else {
                data.password = "{MD5}" + hmd5;
            }
            var params = {
                action: "login",
                username: username,
                password: data.password,
                ac_id: data.ac_id,
                ip: data.ip || response.client_ip,
                chksum: chksum(chkstr),
                info: i,
                n: n,
                type: type,
                os: os.device,
                name: os.platform,
                double_stack: data.double_stack
            };
            var authCallback = function (resp) {
                if (resp.error == "ok") {
                    var ploy_msg = "";
                    if (resp.ploy_msg !== undefined) {
                        ploy_msg = resp.ploy_msg;
                        if (ploy_msg.indexOf("E0000") == 0) {
                            ploy_msg = "";
                        }
                    }

                    return callback({
                        error: "ok",
                        message: ploy_msg
                    });
                }
                //Process Error Message
                var message = error(resp.ecode, resp.error, resp.error_msg);
                if (typeof resp.ploy_msg != "undefined") {
                    message = resp.ploy_msg;
                }
                return callback({
                    error: "fail",
                    message: message
                });
            };
            srunPortal(url, params, authCallback);
        };
        var params = {
            username: username,
            ip: (data.ip || "")
        };
        getChallenge(url, params, challengeCallback);
    };

    return new Promise((resolve, reject) => {
        getChallenge(url_, { username: username_ }, (resp) => {
            // console.log('getChallenge', resp);
            var params = {
                username: username_,
                domain: "",
                password: password_,
                ac_id: 1,
                ip: target_ip_ || resp.client_ip,
                // ip: "10.249.32.185",
                double_stack: 0
            };
            login(url_, params, (data) => {
                if (data.error === 'ok' || data.message.includes("AuthenticationSuccess,Welcome!")) resolve(true);
                else {
                    console.error(data);
                    resolve(false);
                }
            })
        });
    })
};
