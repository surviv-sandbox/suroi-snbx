class manager {
    #cache: JSONObject = {};
    get cache() {
        return clone(this.#cache) as Readonly<JSONObject>;
    }

    #length = 0;
    get length() {
        return this.#length;
    }

    static #initialized: boolean = false;

    constructor() {
        if (manager.#initialized) {
            throw new Error(`'manager' already initialized.`);
        }
        manager.#initialized = true;
        this.#initialize();
    }

    /**
     * Sets the value of a key located at the end of a path
     */
    setItem(path: string | string[], value: JSONContent, fillEmptyKeys?: boolean) {
        if (!path.length) {
            throw new Error(`No path given for cache assignment.`);
        }

        path = Array.isArray(path) ? path : [path];

        const key = path.pop() as string;
        let o = this.#cache;

        path.forEach((p, i) => {
            let preemptive = o[p] as JSONObject;

            if (typeof preemptive != "object" || preemptive === void 0) {
                if (fillEmptyKeys) {
                    o = (o[p] = Number.isNaN(+path[i]) ? {} : [] as JSONArray) as any;
                } else {
                    throw new Error(`Cache path '${(path as string[]).join(".")}' led to ${o !== void 0 ? "a non-object value" : "undefined"}, and key ${key} awas remaining.`);
                }
            } else {
                o = preemptive;
            }
        });

        if (o[key] === void 0) { this.#length++; }

        o[key] = value;
        this.#pushToLocalStorage();

        return this;
    }

    /**
     * Returns a COPY of the value located at a key located at the end of a path
     */
    getItem<T extends "string" | "number" | "boolean" | "none">(path: string | string[], coerce?: T) {
        if (!path.length) {
            throw new Error(`No path given for cache fetch.`);
        }

        coerce ??= "none" as any;

        path = Array.isArray(path) ? path : [path];

        const key = path.pop() as string;
        let o = this.#cache;

        for (const p of path) {
            o = o[p] as JSONObject;

            if (typeof o != "object" || o === void 0) { return; }
        }

        const v = clone(o[key]);

        return ({ string: String, number: Number, boolean: (x: unknown) => typeof x == "string" ? x != "false" : Boolean(x), none: <T>(x: T) => x })[coerce as badCodeDesign](v) as { string: string, number: number, boolean: boolean, none: JSONContent; }[T];
    }

    /**
     * Returns a boolean indicating whether or not a given key exists
     */
    has(path: string | string[]) {
        if (!path.length) {
            throw new Error(`No path given for cache fetch.`);
        }

        path = Array.isArray(path) ? path : [path];

        let o = this.#cache;

        for (const p of path) {
            o = o[p] as JSONObject;

            if (typeof o != "object" || o === void 0) { return false; }
        }

        return true;
    }

    /**
     * Returns the cache key at the provided index, or null if it doesn't exist
     */
    key(index: number): string | null {
        return Object.keys(this.#cache)[index] ?? null;
    }

    /** 
     * Removes a key from the cache at the end of a path
     */
    deleteItem(path: string | string[]): void {
        if (!path.length) {
            throw new Error(`No path given for cache fetch.`);
        }

        path = Array.isArray(path) ? path : [path];

        const key = path.pop() as string;
        let o = this.#cache;

        for (const p of path) {
            if (typeof o != "object" || o === void 0) {
                throw new Error(`Cache path '${path.concat(key).join(".")}' led to ${o !== void 0 ? "a non-object value" : "undefined"}.`);
            }

            o = o[p] as JSONObject;
        }

        if (o[key] !== void 0) { this.#length--; }
        this.#pushToLocalStorage();

        delete o[key];
    }

    /**
     * Clears the entire cache
     */
    clear() {
        this.#length = 0;
        this.#cache = {};
    }

    #initialize() {
        const s = localStorage.getItem("surviv_sandbox") ?? "";

        try {
            this.#cache = JSON.parse(s) ?? {};
        } catch (e) {
            console.warn(`Failed to initialize cache from localStorage value; JSON.parse failed with the following error:`);
            console.log(e);
        }

        if (this.#cache.version != gamespace.version) {
            localStorage.clear();

            this.setItem("version", gamespace.version);
        }
    }

    #pushToLocalStorage() {
        try {
            localStorage.setItem("surviv_sandbox", JSON.stringify(this.#cache));
        } catch (e) {
            console.error(`Failed to push cache to localStorage; JSON.stringify failed with the following error:`);
            console.log(e);
        }
    }
}

const memoryManager = new manager();