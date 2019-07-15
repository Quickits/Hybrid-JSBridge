"use strict";
var global = window;
global.QuickitsHybrid = {};
global.QuickitsHybrid.invoke = function (params) {
    console.log(params);
    console.log("invoke");
    var result = JSON.parse(params);
    console.log(result);
    if (result.res_sn) {
        global.resultCallbacks[result.res_sn](result.value ? result.value : "");
        delete global.resultCallbacks[result.res_sn];
    }
};
global.resultCallbacks = {};
var JSBridge = /** @class */ (function () {
    function JSBridge() {
        this.requestCounter = 0;
    }
    JSBridge.prototype.request = function (url, callback) {
        if (callback !== undefined) {
            var req_sn = "sm_" + this.requestCounter++;
            url += "&req_sn=" + req_sn;
            global.resultCallbacks[req_sn] = callback;
        }
        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.setAttribute("src", url);
        document.body.appendChild(iframe);
        // auto remove request ui handle
        setTimeout(function () {
            iframe.parentNode.removeChild(iframe);
        }, 99);
    };
    JSBridge.prototype.invokeApi = function (api, args, callback) {
        var fullUrl = api + "?";
        fullUrl += "param=" + encodeURIComponent(JSON.stringify(args));
        this.request(fullUrl, callback);
    };
    return JSBridge;
}());
module.exports = JSBridge;
