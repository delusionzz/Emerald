/* eslint-disable */

importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.sw.js");
importScripts("/uv/uv.config.js");
importScripts("/libcurl/index.js");
// Credit to MotorTruck1221 <@818995901791207454> for the bare switcher code

uv = new UVServiceWorker();

self.addEventListener('fetch', event => {
  event.respondWith(
      (async ()=>{
          if(event.request.url.startsWith(location.origin + __uv$config.prefix)) {
              return await uv.fetch(event);
          }
          return await fetch(event.request);
      })()
  );
});