import JSBridge from "./JSBridge";

var bridge = new JSBridge();

var btn: HTMLElement = document.getElementById("test");

btn.addEventListener("click", function() {
  bridge.invokeApi(
    "qhybrid://cn.quickits.hybrid.api.EnvApi/testParam",
    { ss: "123", a: 1 },
    function(args: any) {
      console.log("Result:" + args);
    }
  );
});
