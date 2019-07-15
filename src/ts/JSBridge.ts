import Result from "./dto/Result";

let global = <any>window;

global.QuickitsHybrid = {};
global.QuickitsHybrid.invoke = function(params: string) {
  console.log(params);
  console.log("invoke");
  let result: Result = JSON.parse(params);
  console.log(result);

  if (result.res_sn) {
    global.resultCallbacks[result.res_sn](result.value ? result.value : "");
    delete global.resultCallbacks[result.res_sn];
  }
};

global.resultCallbacks = {};

class JSBridge {
  private requestCounter: number = 0;

  constructor() {}

  protected request(url: string, callback?: Function) {
    if (callback !== undefined) {
      let req_sn = "sm_" + this.requestCounter++;
      url += "&req_sn=" + req_sn;
      global.resultCallbacks[req_sn] = callback;
    }

    let iframe: HTMLElement = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.setAttribute("src", url);
    document.body.appendChild(iframe);

    // auto remove request ui handle
    setTimeout(function() {
      iframe.parentNode.removeChild(iframe);
    }, 99);
  }

  public invokeApi(api: string, args?: any, callback?: any) {
    let fullUrl = api + "?";

    fullUrl += "param=" + encodeURIComponent(JSON.stringify(args));
    this.request(fullUrl, callback);
  }
}

export = JSBridge;
