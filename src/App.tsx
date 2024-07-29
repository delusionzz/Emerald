import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "./components/ui/button";
import { Home as HomeIcon } from "lucide-react";
import { useSettingsStore } from "./components/stores";
import { useSw } from "@/components/hooks";
import Navbar from "./components/ui/navbar";
import { useEffect, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Home = lazy(() => import("./pages/home"));
const PluginPage = lazy(() => import("./pages/plugins"));
const Create = lazy(() => import("./pages/create"));

export default function App() {
  useSw("/sw.js");
  const settingsStore = useSettingsStore();

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

  // window.postMessage("Test FROM CLIENT");
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plugins" element={<PluginPage />} />
          <Route path="/plugins/create" element={<Create />} />
          {/* <Route path="/games" element={<Games />} /> */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </QueryClientProvider>
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
