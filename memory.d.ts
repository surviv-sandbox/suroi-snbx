declare class manager {
    #private;
    get cache(): Readonly<JSONObject>;
    get length(): number;
    constructor();
    /**
     * Sets the value of a key located at the end of a path
     */
    setItem(path: string | string[], value: JSONContent, fillEmptyKeys?: boolean): this;
    /**
     * Returns a COPY of the value located at a key located at the end of a path
     */
    getItem<T extends "string" | "number" | "boolean" | "none">(path: string | string[], coerce?: T): {
        string: string;
        number: number;
        boolean: boolean;
        none: JSONContent;
    }[T];
    /**
     * Returns a boolean indicating whether or not a given key exists
     */
    has(path: string | string[]): boolean;
    /**
     * Returns the cache key at the provided index, or null if it doesn't exist
     */
    key(index: number): string | null;
    /**
     * Removes a key from the cache at the end of a path
     */
    deleteItem(path: string | string[]): void;
    /**
     * Clears the entire cache
     */
    clear(): void;
}
declare const memoryManager: manager;
