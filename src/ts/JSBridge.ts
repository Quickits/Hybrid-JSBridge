import Result from "./dto/Result";

const global = window as any;

global.QuickitsHybrid = {};
global.QuickitsHybrid.invoke = (params: string) => {
  const result: Result = JSON.parse(params);

  if (result.res_sn) {
    global.resultCallbacks[result.res_sn](result.value ? result.value : "");
    delete global.resultCallbacks[result.res_sn];
  }
};

global.resultCallbacks = {};

class JSBridge {
  private requestCounter: number = 0;

  protected request(url: string, callback?: () => void) {
    if (callback !== undefined) {
      const req_sn = "sm_" + this.requestCounter++;
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
