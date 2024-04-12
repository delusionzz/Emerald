import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "./components/ui/button";
import { Home as HomeIcon } from "lucide-react";
import { useSettingsStore } from "./components/stores";
import { useSw } from "@/components/hooks";
import Navbar from "./components/ui/navbar";
import Home from "./pages/home";
import Games from "./pages/games";
import { useEffect } from "react";
// @ts-expect-error no types
import { SetTransport } from "@mercuryworkshop/bare-mux";
export default function App() {
  useSw("/sw.js", "/~/");
  console.log("app");
  const settingsStore = useSettingsStore();

  useEffect(() => {
    if (typeof window != "undefined") {
      // @ts-expect-error
      window.SetTransport = SetTransport;
      setTimeout(() => {
        SetTransport("CurlMod.LibcurlClient", {
          wisp: `${location.port == "443" ? "wss://" : "ws://"}${
            location.host
          }/w/`,
          wasm: "/cdn/files/libcurl.wasm",
        });
        console.log(
          `TRANSPORT SET TO: ${location.port == "443" ? "wss://" : "ws://"}${
            location.host
          }/w/`
        );
      });
    }
  }, []);

  useEffect(() => {
    // console.log(window.location === window.parent.location);
    if (
      settingsStore.cloak === "aboutBlank" &&
      window.location === window.parent.location
    ) {
      const page = window.open();
      page!.document.body.innerHTML =
        `<iframe style="height:100%; width: 100%; border: none; position: fixed; top: 0; right: 0; left: 0; bottom: 0; border: none"  src="` +
        window.location.href +
        `"></iframe>`;
      window.location.replace("https://google.com");
    }
  }, [settingsStore.cloak]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
      <Toaster />
    </>
  );
}

const NoMatch = () => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <div className="w-full min-h-screen space-y-4 flex flex-col items-center justify-center">
        <h1 className="text-xl text-card-foreground">404 Page not found</h1>
        <p className="w-[25rem] text-center text-card-foreground/55 flex-wrap">
          The page you were looking for is either{" "}
          <span className="text-primary">in progress of being built</span> or{" "}
          <span className="text-primary">no page exists for this path</span>
        </p>
        <a href="/">
          <Button className="flex items-center justify-center space-x-2 text-secondary shadow-lg hover:shadow-primary-foreground transition-all">
            <HomeIcon className="" />
            <span>Home</span>
          </Button>
        </a>
      </div>
    </div>
  );
};
