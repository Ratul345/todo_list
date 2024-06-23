// app.js

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (registration) {
        console.log(
          "Service Worker registration successful with scope: ",
          registration.scope
        );
      })
      .catch(function (err) {
        console.error("Service Worker registration failed: ", err);
      });
  });
}
