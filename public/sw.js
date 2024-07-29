/* eslint-disable */

importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.sw.js");
importScripts("/uv/uv.config.js");
importScripts("/libcurl/index.js");
// importScripts("/localforage/localforage.min.js");

uv = new UVServiceWorker();

// self.onmessage((ev) => {
//   console.log(ev);
// });

self.addEventListener("message", (event) => {
  // console.log(`Message received: ${event.data}`);
  const list = JSON.parse(event.data);
  console.log(list);
  self.__uv$config.inject = [];
  list.map((plug) => {
    self.__uv$config.inject.push({
      host: plug.host,
      html: plug.data,
      injectTo: plug.where,
    });
  });
  console.log(self.__uv$config);
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});
