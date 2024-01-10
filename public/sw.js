/* eslint-disable */

importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");
importScripts("/localforage/localforage.min.js");

// Credit to MotorTruck1221 <@818995901791207454> for the bare switcher code

localforage.config({
  driver: localforage.INDEXEDDB,
  name: "Emerald",
  version: 1.0,
  storeName: "e_config",
  description: "IDB config storage",
});

const uvPromise = new Promise(async (resolve) => {
  try {
    const bare =
      (await localforage.getItem("bare")) || location.origin + "/bare/";

    self.__uv$config.bare = bare;
    self.uv = new UVServiceWorker(self.__uv$config);
  } catch (error) {
    console.log(error);
  }
  resolve();
});

const sw = new UVServiceWorker();
self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(location.origin + self.__uv$config.prefix)) {
    console.log(self.__uv$config.bare);
    event.respondWith(
      (async function () {
        try {
          await uvPromise;
        } catch (error) {}
        return await self.uv.fetch(event);
      })()
    );
  }
});
