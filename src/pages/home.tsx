import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/ui/navbar";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { DuckSuggest, ProxySearch } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Suggestion } from "@/lib/utils";
import { useSettingsStore, useProxiedStore } from "@/components/stores";
const Home = () => {
  const settings = useSettingsStore();
  const proxiedStore = useProxiedStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 0) {
        const terms = await DuckSuggest(searchTerm);
        setSuggestions(terms);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  useEffect(() => {
    console.log("toast here");
  }, []);
  // toast.success("Want more links? Join our discord server for BYOD links!", {
  //   action: {
  //     label: "Join Server",
  //     onClick: () =>
  //       window.open("https://discord.com/invite/p8w8neURBb", "_blank"),
  //   },

  // });
  return (
    <>
      {proxiedStore.proxyString.length > 0 && proxiedStore.isProxied ? (
        <div className="flex flex-col h-screen w-full">
          <Navbar />

          <iframe
            src={`/~/${settings.proxy}/${proxiedStore.proxyString}`}
            className="border-none w-full h-full"
          ></iframe>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
          <Navbar />

          <div className="flex  w-4/12 flex-col space-y-4">
            {/* put text here in the future so it doesnt look as dull */}
            <div className="flex space-x-4 w-full">
              <div className="flex flex-col relative h-0 space-y-4 w-full">
                <Input
                  placeholder={`Search with ${settings.proxy}`}
                  className="text-gray-200"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowSuggestions(false);
                    }, 100);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      proxiedStore.setIsProxied(true);
                      proxiedStore.setProxyString(
                        ProxySearch(settings.search, searchTerm)
                      );
                    }
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="flex flex-col border border-primary/60 rounded-md">
                    {suggestions.map(
                      (suggestion: Suggestion, index: number) => {
                        return (
                          <button
                            key={index}
                            className="flex space-x-2 text-gray-200 p-2 hover:bg-secondary/30 cursor-pointer transition-all border border-secondary/35"
                            onClick={() => {
                              proxiedStore.setIsProxied(true);
                              proxiedStore.setProxyString(
                                ProxySearch(settings.search, suggestion.phrase)
                              );
                            }}
                          >
                            <span>{suggestion.phrase}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
                <p className="text-center text-card-foreground/75">
                  Want more links? Join our{" "}
                  <a
                    className="text-primary"
                    href="https://discord.com/invite/p8w8neURBb"
                    target="_blank"
                  >
                    discord
                  </a>{" "}
                  server for community links
                </p>
              </div>
              <motion.button
                whileTap={{
                  scale: 0.9,
                }}
                onClick={() => {
                  console.log(searchTerm);
                  if (searchTerm.length < 0 || searchTerm.length === 0) {
                    return toast("Invalid search", {
                      description:
                        "Empty search terms are not allowed, please try again",
                    });
                  }
                  proxiedStore.setIsProxied(true);
                  proxiedStore.setProxyString(
                    ProxySearch(settings.search, searchTerm)
                  );
                }}
              >
                <Button className="flex space-x-1 shadow-lg hover:shadow-primary-foreground transition-all">
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Search</span>
                </Button>
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
