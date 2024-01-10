/* eslint-disable react-hooks/exhaustive-deps */
import { Cog } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { useProxiedStore, useSettingsStore } from "@/components/stores";
import { useIDB } from "../hooks";
import { Input } from "./input";
import { ProxySearch } from "@/lib/utils";
import { useEffect, useState } from "react";
import apps from "@/apps.json";
import { Button } from "./button";
const Navbar = () => {
  const idb = useIDB();
  const proxiedStore = useProxiedStore();
  const settingsStore = useSettingsStore();
  // const idbStore = useIDBStore();
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [bare, setBare] = useState("");
  // const handleBare = () => {};
  // console.log(idbStore.bare);

  useEffect(() => {
    window.document.title =
      settingsStore.title.length > 0 ? settingsStore.title : "Emerald";
    window.document
      .querySelector("link[rel='icon']")
      ?.setAttribute(
        "href",
        settingsStore.icon.length > 0
          ? `https://www.google.com/s2/favicons?domain=${settingsStore.icon}`
          : "/emerald.png"
      );
  }, [settingsStore.title, settingsStore.icon]);

  useEffect(() => {
    (async () => {
      const bare = await idb.get("bare");
      if (!bare) {
        await idb.set("bare", "/bare/");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setBare(((await idb.get("bare")) as string) ?? "");
      console.log("SETTING BARE EFFECT", bare);
    })();
  }, []);

  const handleBare = () => {
    toast("Testing Bare connection", {
      description: "Testing the bare server connection",
    });
    try {
      (async () => {
        const bareUrl = new URL(bare, location.href);
        console.log("BARE URL", bareUrl.href);
        const manifest = await fetch(`${bareUrl.href}`);
        const mJson = await manifest.json();
        if (!(mJson.versions as string[]).includes("v3")) {
          return toast("Bare server connection failed", {
            description:
              "The bare manifest did not include v3 which is essential for this verson of ultraviolet to work",
          });
        }

        const testGet = await fetch(`${bareUrl.href}v3/`, {
          headers: {
            "x-bare-url": "https://www.google.com",
            "X-Bare-Headers": `{"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"}`,
          },
        });
        if (testGet.status === 200 || testGet.status === 302) {
          console.log("SETTING BARE", bareUrl.href);
          await idb.set("bare", bareUrl.href);

          navigator.serviceWorker
            .getRegistrations()
            .then(function (registrations) {
              for (const registration of registrations) {
                registration.unregister();
                console.log("Service Worker Unregistered");
              }
            });
          location.reload();
          toast("Bare server connection successful", {
            description: "All checks passed. Your ready to use emerald",
          });
        } else {
          toast("Bare server connection failed", {
            description: "The bare server did not respond as expected",
          });
        }
      })();
    } catch (error) {
      if (error instanceof Error) {
        toast("Bare server connection failed", {
          description: `Please check your Bare server address. Error: ${error.name}`,
        });
      }
    }
  };

  return (
    <header
      className={`${
        proxiedStore.isProxied ? "relative" : "fixed top-0"
      } border-b border-secondary/35 w-full`}
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href={`/`}>
            <img className="h-6 w-6" alt="Emerald" src="/emerald.png" />
            <span className="text-card-foreground">Emerald</span>
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a
              href="/games"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Games
            </a>
            <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
              <SheetTrigger>
                {" "}
                <a className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Apps
                </a>
              </SheetTrigger>
              <SheetContent className="border-none w-full overflow-y-auto">
                <div className="space-y-8 flex flex-col">
                  <SheetHeader className="flex justify-center items-center">
                    <SheetTitle>
                      <h1 className="text-3xl">Apps</h1>
                    </SheetTitle>
                    <SheetDescription>
                      A collection of apps that allow quick access to certain
                      sites
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-wrap ">
                    {apps.map((app, i: number) => {
                      return (
                        <Card
                          className="max-w-[20rem] m-2 p-2 border-none w-full"
                          key={i}
                        >
                          <div className="flex items-center justify-between">
                            <CardHeader>
                              <CardTitle>{app.title}</CardTitle>
                              <CardDescription className="flex flex-wrap">
                                {app.desc}
                              </CardDescription>
                            </CardHeader>
                            <div className="flex flex-col">
                              <CardContent>
                                <img
                                  src={app.icon}
                                  className="h-24 w-52 object-contain"
                                />
                              </CardContent>
                              <Button
                                className="text-card shadow-lg hover:shadow-primary-foreground transition-all max-w-full w-full"
                                onClick={() => {
                                  setIsOpen(false);
                                  proxiedStore.setIsProxied(true);
                                  proxiedStore.setProxyString(
                                    ProxySearch(
                                      settingsStore.search,
                                      app.source
                                    )
                                  );
                                }}
                              >
                                Go to site
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <a
              href="https://discord.gg/KGBHgamMgY"
              target="_blank"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Discord
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          {proxiedStore.isProxied ? (
            <Input
              className="max-w-[25rem] text-gray-200"
              placeholder={`Search with ${settingsStore.proxy}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  proxiedStore.setProxyString(
                    ProxySearch(settingsStore.search, value)
                  );
                }
              }}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : null}
          <Dialog>
            <DialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button className="bg-card p-2 rounded-md transition-colors hover:text-foreground/80 text-foreground/60 shadow-lg hover:shadow-card ">
                      <Cog />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="border-none ">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="border-none">
              <div className="space-y-4 flex flex-col">
                <DialogHeader>
                  <DialogTitle>
                    <h1 className="text-card-foreground">Settings</h1>
                  </DialogTitle>
                  <DialogDescription>
                    Settings to change the behavior of Emerald.
                  </DialogDescription>
                </DialogHeader>
                <Separator />
                {/* Settings body */}
                <div className="space-y-4 flex flex-col">
                  <div className="flex flex-col space-y-2">
                    <h1 className="text-card-foreground text-2xl">
                      Tab settings
                    </h1>
                    <div className="flex items-center justify-between">
                      <h2 className="text-card-foreground">Cloak</h2>
                      <Select
                        defaultValue={settingsStore.cloak}
                        onValueChange={(cloak: "none" | "aboutBlank") =>
                          settingsStore.setCloak(cloak)
                        }
                      >
                        <SelectTrigger className="max-w-[20rem] text-card-foreground">
                          <SelectValue className="placeholder:text-card-foreground/55 " />
                        </SelectTrigger>
                        <SelectContent className="text-card-foreground border-none">
                          <SelectItem value="none" className="cursor-pointer">
                            none
                          </SelectItem>
                          <SelectItem
                            value="aboutBlank"
                            className="cursor-pointer"
                          >
                            About Blank
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-card-foreground">Title</h2>
                      <Input
                        className="max-w-[20rem] text-card-foreground placeholder:text-card-foreground/55"
                        placeholder="Page Title"
                        value={settingsStore.title}
                        onChange={(e) => settingsStore.setTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-card-foreground">Icon</h2>
                      <Input
                        className="max-w-[20rem] text-card-foreground placeholder:text-card-foreground/55"
                        placeholder="Page Icon (eg https://google.com)"
                        value={settingsStore.icon}
                        onChange={(e) => settingsStore.setIcon(e.target.value)}
                      />
                    </div>
                  </div>
                  <Separator />
                  {/* settings for bare */}
                  <div className="flex flex-col space-y-2">
                    <h1 className="text-card-foreground text-2xl">Misc.</h1>
                    <div className="flex items-center justify-between">
                      <h2 className="text-card-foreground">Bare</h2>
                      <Input
                        className="max-w-[20rem] text-card-foreground placeholder:text-card-foreground/55"
                        placeholder="Change bare server"
                        value={bare}
                        onChange={(e) => setBare(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (
                              (e.target as HTMLInputElement).value.length > 0
                            ) {
                              setBare("/bare/");
                            } else {
                              setBare((e.target as HTMLInputElement).value);
                            }
                            handleBare();
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
