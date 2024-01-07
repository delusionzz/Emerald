/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
    proxy: "uv";
    search: string;
    cloak: "none" | "aboutBlank";
    title: string;
    icon: string;
    setCloak: (str: "none" | "aboutBlank") => void;
    setTitle: (str: string) => void;
    setIcon: (str: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, _get) => ({
        proxy: "uv",
        search: "https://www.google.com/search?q=",
        cloak: "none",
        title: "Emerald",
        icon: "/emerald.png",
        setTitle: (str) => set(() => ({ title: str })),
        setIcon: (str) => set(() => ({ icon: str })),
        setCloak: (str) => set(() => ({ cloak: str })),
    }),
    {
      name: "settings", // name of item in the storage (must be unique)
    }
  )
);

export const useProxiedStore = create<{
  isProxied: boolean;
  setIsProxied: (bool: boolean) => void;
  proxyString: string;
  setProxyString: (str: string) => void;
}>((set) => ({
  isProxied: false,
  setIsProxied: (bool) => set(() => ({ isProxied: bool })),
  proxyString: "",
  setProxyString: (str) => set(() => ({ proxyString: str })),
}));
