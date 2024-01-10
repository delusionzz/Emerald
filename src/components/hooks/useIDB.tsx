/* eslint-disable @typescript-eslint/no-explicit-any */
import * as localForage from "localforage";

const useIDB = () => {
  localForage.config({
    driver: localForage.INDEXEDDB,
    name: "Emerald",
    version: 1.0,
    storeName: "e_config",
    description: "IDB config storage",
  });

  const get = async (key: string) => {
    return await localForage.getItem(key);
  };

  const set = async (key: string, value: any) => {
    return await localForage.setItem(key, value);
  };

  const remove = async (key: string) => {
    return await localForage.removeItem(key);
  };

  return { get, set, remove };
};

export default useIDB;
