import { useEffect } from "react";
// @ts-expect-error no types
import { SetTransport } from "@mercuryworkshop/bare-mux";

const useSw = (path: string) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        SetTransport("CurlMod.LibcurlClient", {
          wisp: `${location.port == "443" ? "wss://" : "ws://"}${
            location.host
          }/w/`
        });
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
