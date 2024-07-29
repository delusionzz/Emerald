import Navbar from "@/components/ui/navbar";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { usePluginStore, type Plugin } from "@/components/stores";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Trash2 } from "lucide-react";
const PluginPage = () => {
  const pluginStore = usePluginStore();
  const plugins = useQuery<{
    ok: boolean;
    plugin_list: Plugin[];
  }>({
    queryKey: ["plugins"],
    queryFn: () => fetch("/api/list").then((res) => res.json()),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <Navbar />
      <div className="w-9/12 min-h-full flex flex-col justify-center space-y-5">
        <div className="flex space-x-4">
          <h1 className="text-foreground text-3xl">Plugins</h1>
          <a href="/plugins/create">
            <Button className="font-semibold text-xl">
              <Plus />
            </Button>
          </a>
        </div>
        <div className="flex flex-wrap w-full space-x-5">
          {plugins.isLoading ? (
            <h2>Loading...</h2>
          ) : plugins.data?.plugin_list &&
            plugins.data?.plugin_list.length > 0 ? (
            plugins.data?.plugin_list.map((plugin, i) => {
              return (
                <Card className="max-w-72 min-w-72 border-none" key={i}>
                  <CardHeader>
                    <CardTitle>{plugin.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Please be careful when downloading and installing user
                      generated plugins!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {plugin.description ?? "No description provided"}
                  </CardContent>
                  <CardFooter className="space-x-2">
                    <Button
                      disabled={pluginStore.plugins.some(
                        (p) => p.name === plugin.name
                      )}
                      onClick={() => pluginStore.addPlugin(plugin)}
                      className="font-semibold text-background disabled:bg-current/40"
                    >
                      {pluginStore.plugins.some((p) => p.name === plugin.name)
                        ? "installed"
                        : "install"}
                    </Button>
                    {pluginStore.plugins.some((p) => p.name === plugin.name) ? (
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          pluginStore.removePlugin(plugin.id);
                          location.reload();
                        }}
                      >
                        <Trash2 size={24} />
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <h2 className="text-foreground/35 text-xl">No plugins found...</h2>
          )}
        </div>
        <div className="w-full flex-col flex space-y-3">
          <h1 className="text-foreground text-3xl">Installed Plugins</h1>
          <div className="flex flex-wrap w-full space-x-5">
            {pluginStore.plugins.map((plugin, i) => {
              return (
                <Card className="max-w-72 min-w-72 border-none" key={i}>
                  <CardHeader>
                    <CardTitle>{plugin.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {plugin.description ?? "No description provided"}
                  </CardContent>
                  <CardFooter className="space-x-2">
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        pluginStore.removePlugin(plugin.id);
                        location.reload();
                      }}
                    >
                      <Trash size={24} />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginPage;
