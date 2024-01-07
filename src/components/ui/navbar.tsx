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

import { Separator } from "@/components/ui/separator";
import { useProxiedStore, useSettingsStore } from "@/components/stores";
import { Input } from "./input";
import { ProxySearch } from "@/lib/utils";
import { useEffect, useState } from "react";
import apps from "@/apps.json";
import { Button } from "./button";
const Navbar = () => {
  const proxiedStore = useProxiedStore();
  const settingsStore = useSettingsStore();
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
                    {apps.map((app) => {
                      return (
                        <Card className="max-w-[20rem] m-2 p-2 border-none w-full">
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
