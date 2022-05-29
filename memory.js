class manager {
    #cache = {};
    get cache() {
        return clone(this.#cache);
    }
    #length = 0;
    get length() {
        return this.#length;
    }
    static #initialized = false;
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
    setItem(path, value, fillEmptyKeys) {
        if (!path.length) {
            throw new Error(`No path given for cache assignment.`);
        }
        path = Array.isArray(path) ? path : [path];
        const key = path.pop();
        let o = this.#cache;
        path.forEach((p, i) => {
            let preemptive = o[p];
            if (typeof preemptive != "object" || preemptive === void 0) {
                if (fillEmptyKeys) {
                    o = (o[p] = Number.isNaN(+path[i]) ? {} : []);
                }
                else {
                    throw new Error(`Cache path '${path.join(".")}' led to ${o !== void 0 ? "a non-object value" : "undefined"}, and key ${key} awas remaining.`);
                }
            }
            else {
                o = preemptive;
            }
        });
        if (o[key] === void 0) {
            this.#length++;
        }
        o[key] = value;
        this.#pushToLocalStorage();
        return this;
    }
    /**
     * Returns a COPY of the value located at a key located at the end of a path
     */
    getItem(path, coerce) {
        if (!path.length) {
            throw new Error(`No path given for cache fetch.`);
        }
        coerce ??= "none";
        path = Array.isArray(path) ? path : [path];
        const key = path.pop();
        let o = this.#cache;
        for (const p of path) {
            o = o[p];
            if (typeof o != "object" || o === void 0) {
                return;
            }
        }
        const v = clone(o[key]);
        return ({ string: String, number: Number, boolean: (x) => typeof x == "string" ? x != "false" : Boolean(x), none: (x) => x })[coerce](v);
    }
    /**
     * Returns a boolean indicating whether or not a given key exists
     */
    has(path) {
        if (!path.length) {
            throw new Error(`No path given for cache fetch.`);
        }
        path = Array.isArray(path) ? path : [path];
        let o = this.#cache;
        for (const p of path) {
            o = o[p];
            if (typeof o != "object" || o === void 0) {
                return false;
            }
        }
        return true;
    }
    /**
     * Returns the cache key at the provided index, or null if it doesn't exist
     */
    key(index) {
        return Object.keys(this.#cache)[index] ?? null;
    }
    /**
     * Removes a key from the cache at the end of a path
     */
    deleteItem(path) {
        if (!path.length) {
            throw new Error(`No path given for cache fetch.`);
        }
        path = Array.isArray(path) ? path : [path];
        const key = path.pop();
        let o = this.#cache;
        for (const p of path) {
            if (typeof o != "object" || o === void 0) {
                throw new Error(`Cache path '${path.concat(key).join(".")}' led to ${o !== void 0 ? "a non-object value" : "undefined"}.`);
            }
            o = o[p];
        }
        if (o[key] !== void 0) {
            this.#length--;
        }
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
        const s = localStorage.getItem("surviv_sandbox");
        try {
            this.#cache = JSON.parse(s) ?? {};
        }
        catch (e) {
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
        }
        catch (e) {
            console.error(`Failed to push cache to localStorage; JSON.stringify failed with the following error:`);
            console.log(e);
        }
    }
}
const memoryManager = new manager();
