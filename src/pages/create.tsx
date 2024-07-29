import Navbar from "@/components/ui/navbar";
import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePluginStore } from "@/components/stores";
import { toast } from "sonner";

const Create = () => {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"script" | "style">("script");
  const [where, setWhere] = useState<"head" | "body">("head");
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [description, setDescription] = useState("");
  const pluginStore = usePluginStore();

  const createId = () => {
    // is not good at all, change later
    return Math.floor(Math.random() * 1000000);
  };

  const handleInstall = useCallback(() => {
    toast("Installing...");
    try {
      if (!name || !description || !target || !code || !type) {
        throw new Error("All fields are required");
      }
      pluginStore.addPlugin({
        id: createId(),
        name: name,
        description: description,
        type: type,
        data: `${
          type === "script"
            ? `<script>${code}</script>`
            : `<style>${code}</style>`
        }`,
        target: target,
        where: where,
      });
      toast.success("Installed!");
    } catch (error) {
      toast.error("Failed to install!\n" + error);
    }
  }, [code, type, where, name, description]);

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center">
      <Navbar />
      <div className="w-9/12 min-h-full flex flex-col justify-center space-y-5">
        <div className="flex space-x-4 items-center">
          <h1 className="text-foreground text-3xl">Create</h1>
          <Select
            onValueChange={(x) => setType(x === "script" ? "script" : "style")}
          >
            <SelectTrigger className="w-[180px] text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="border-none">
              <SelectItem value="script">Script</SelectItem>
              <SelectItem value="style">Style</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(x) => setWhere(x === "head" ? "head" : "body")}
          >
            <SelectTrigger className="w-[180px] text-white">
              <SelectValue placeholder="head" />
            </SelectTrigger>
            <SelectContent className="border-none">
              <SelectItem value="head">head</SelectItem>
              <SelectItem value="body">body</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="max-w-64 text-white"
            placeholder="Give your plugin a name"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="max-w-80  text-white"
            placeholder="Describe your plugin does"
          />
          <Input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
            className="max-w-80  text-white"
            placeholder="What websites should your plugin run on? (can be regex)"
          />
        </div>
        <CodeMirror
          value={code}
          height="500px"
          theme={tokyoNight}
          extensions={[type === "script" ? javascript() : css()]}
          onChange={(value) => setCode(value)}
        />

        <div className="w-full flex space-x-5">
          <Button onClick={handleInstall}>Install</Button>
          <Button>Export</Button>
        </div>
      </div>
    </div>
  );
};

export default Create;
