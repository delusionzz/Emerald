/* eslint-disable prefer-const */
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createBareClient } from '@tomphttp/bare-client';
import * as localForage from 'localforage';

localForage.config({
  driver: localForage.INDEXEDDB,
  name: "Emerald",
  version: 1.0,
  storeName: "e_config",
  description: "IDB config storage",
});
export type Suggestion = {
  phrase: string,
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DuckSuggest = async (input: string): Promise<Suggestion[]> => {
  const bare = await localForage.getItem('bare')
  const client = await createBareClient(`${bare}`);

  const res = await client.fetch(`https://duckduckgo.com/ac/?q=${input}&format=list`);
  const json = await res.json()
  return json
}


const Xor = {
  encode(str: string) {
      if (!str) return str;
      return encodeURIComponent(
          str
              .toString()
              .split('')
              .map((char, ind) =>
                  ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
              )
              .join('')
      );
  },
  decode(str: string) {
      if (!str) return str;
      let [input, ...search] = str.split('?');
      return (
          decodeURIComponent(input)
              .split('')
              .map((char, ind) =>
                  ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
              )
              .join('') + (search.length ? '?' + search.join('?') : '')
      );
  },
};


const isValidUrl = (urlString: string) => {
  try { 
    return Boolean(new URL(urlString)); 
  }
  catch(e){ 
    return false; 
  }
}

const ProxySearch = (search: string, term: string): string => {
  // term = !/^http(s?):\/\//.test(term)? `https://${term}` : term
  if (isValidUrl(term)) {
    return Xor.encode(term)
  } else {
    return /\.[a-zA-Z]{2,}$/.test(term) ? Xor.encode(`https://${term}`) : Xor.encode(search + term)
  }
  // return isValidUrl(term) ? Xor.encode(term) : Xor.encode(search + encodeURIComponent(term))
}



export {
  DuckSuggest,
  Xor,
  ProxySearch
}