import { useEffect } from "react";

import { BareMuxConnection } from "@mercuryworkshop/bare-mux"
import { useSettingsStore } from "../stores";
declare global {
  interface Window { Connection: BareMuxConnection }
}

const useSw = (path: string) => {
  const settingsStore = useSettingsStore();
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        const connection = new BareMuxConnection("/baremux/worker.js")
        window.Connection = connection
        connection.setTransport(settingsStore.transport.path,[ {
          wisp: `${location.port == "443" ? "wss://" : "ws://"}${
            location.host
          }/w/`
        }]);
      })
      navigator.serviceWorker
        .register(path)
        .then(
          function (registration) {
            console.log(
              `[sw] ${path} successfuly registered with a scope of ${registration.scope}`
            );
          },
          function (err) {
            console.log(
              `%c[sw] ${path} failed to register, error: `,
              "color:red;",
              err
            );
          }
        );
    }
  }, [path]);
};

export default useSw;
