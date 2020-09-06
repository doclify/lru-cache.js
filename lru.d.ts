declare module "@doclify/lru-cache" {
  interface Options {
    max?: number,
    ttl?: number
  }

  export default class Lru<T = any> {
    constructor(options: Options);

    public has(key: string): boolean;
    public get(key: string): T | undefined;
    public set(key: string, value: T, ttl?: number): boolean;
    public clear(): void;
    public delete(key: string): boolean;
    public evict(): boolean;
    public keys(): string[];
  }
}
