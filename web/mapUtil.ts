/**
 * Extracts the key type from a `Map` type
 * @template T The map from which to extract keys
 */
type MapKey<T> = T extends Map<infer K, any> ? K : T extends AugmentedMap<infer K, any> ? K : never;

/**
 * Extracts the value type from a `Map` type
 * @template T The map from which to extract values
 */
type MapValue<T> = T extends Map<any, infer V> ? V : T extends AugmentedMap<any, infer V> ? V : never;

/**
 * A three-way mix between a `Map`, `Set` and `Array`
 *
 * In essence, it's a Map that disallows duplicate values and provides
 * Array-style methods for operating over the collection
 *
 * @template K The type of the keys used in this collection
 * @template V The type of the values used in this collection
 */
class AugmentedMap<K, V> {
    /**
     * An internal map, used for get/set operations
     */
    #internalMap = new Map<K, V>();
    /**
     * Effectively a getter for this collection's internal map,
     * returns a normal map version of this collection
     */
    toMap() {
        return this.#internalMap;
    }

    /**
     * An internal array, used to implement array methods
     */
    #internalArray = [] as V[];
    /**
     * Effectively a getter for this collection's internal array,
     * returns a normal array version of this collection
     */
    toArray() {
        return this.#internalArray;
    }

    /**
     * Establishes a mapping between keys and the indices in the array they map to
     */
    #internalHash = new Map<K, number>();

    /**
     * Returns this collection's size
     */
    get size() { return this.#internalMap.size; }

    [Symbol.iterator]() { return this.#internalMap[Symbol.iterator](); }

    /**
     * `* It's a constructor. It constructs.`
     *
     * Creates a new empty `AugmentedMap`
     */
    constructor() { }

    /**
     * @param key The key to fetch
     * Fetches an element at a certain key. Identical to the normal `Map.get`.
     * @returns The object at that key, or `undefined` if none exist
     */
    get(key: K) {
        return this.#internalMap.get(key);
    }
    /**
     * Sets a value at a certain key within this map
     *
     * If a value is already there, nothing happens
     * @param key The key at which to insert this value
     * @param value The value to put there
     * @returns A boolean value: if `true`, the collection was modified;
     * if `false`, the element was already in the set.
     */
    set(key: K, value: V) {
        const alreadyPresent = this.#internalArray.includes(value);

        if (!alreadyPresent) {
            // If there's already a value at this key, we need to replace it with the new one
            if (this.#internalMap.has(key)) {
                this.#internalArray[this.#internalHash.get(key)!] = value;
            } else {
                // Otherwise push
                this.#internalArray.push(value);
                this.#internalHash.set(key, this.#internalArray.length - 1);
            }

            this.#internalMap.set(key, value);
        }

        return !alreadyPresent;
    }

    /**
     * Swaps the positions of two elements in this collection
     * @param keyA The key of the first element
     * @param keyB The key of the second element
     * @param allowEmptySlots Whether the swapping operation should be aborted if one or both
     * of the two keys isn't in the collection. If, for example, `keyA` doesn't exist within this
     * collection but `keyB` does, then after the swap, `keyA` will have the element that used to be
     * in `keyB`, and `keyB` will be empty.
     * @returns `true` if the swap was carried out, and `false` if it wasn't
     */
    swap(keyA: K, keyB: K, allowEmptySlots = false) {
        const hasA = this.#internalMap.has(keyA),
            hasB = this.#internalMap.has(keyB);

        if ((!hasA || !hasB) && !allowEmptySlots)
            return false;

        if (hasA || hasB) {
            const [
                valueA, valueB,
                hashA, hashB,
            ] = [
                    this.#internalMap.get(keyA), this.#internalMap.get(keyB),
                    this.#internalHash.get(keyA), this.#internalHash.get(keyB),
                ];

            const setOrDelete = <K, V>(map: Map<K, V>, key: K, value: V | undefined) => {
                if (value) {
                    map.set(key, value);
                } else {
                    map.delete(key);
                }
            };

            setOrDelete(this.#internalMap, keyA, valueB);
            setOrDelete(this.#internalMap, keyB, valueA);

            setOrDelete(this.#internalHash, keyA, hashB);
            setOrDelete(this.#internalHash, keyB, hashA);
        }

        return true;
    }

    /**
     * Deletes an element at a certain key, if it exists
     * @param key The key to delete from
     * @returns `true` if an element existed at that key and was
     * removed, and `false` otherwise.
     */
    delete(key: K) {
        const exists = this.#internalMap.has(key);

        if (exists) {
            this.#internalMap.delete(key);

            const index = this.#internalHash.get(key)!;
            this.#internalArray.splice(index, 1);
            this.#internalHash.delete(key);

            // refresh hashes
            for (const [key, mappedIndex] of this.#internalHash) {
                if (mappedIndex <= index) continue;
                this.#internalHash.set(key, mappedIndex - 1);
            }
        }

        return exists;
    }

    /**
     * Clears this collection
     */
    clear() {
        this.#internalArray.length = 0;
        this.#internalMap.clear();
        this.#internalHash.clear();
    }

    /**
     * Executes a specified callback for each value in this collection
     * @template T The type of the `this` value
     * @param callbackfn A function that takes 4 arguments: the current value, the current key,
     * the current index and the `AugmentedMap` being iterated through
     * @param thisArg Optionally specify a value that will be used as `this` in the callback
     */
    forEach<T>(callbackfn: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => void, thisArg: T): undefined;
    forEach<T>(callbackfn: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => void): undefined;
    forEach<T>(
        callbackfn: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => void,
        thisArg?: T
    ) {
        for (const [key, value] of this.#internalMap)
            callbackfn.call(thisArg!, value, key, this);
    }

    /**
     * Calls a supplied function on each entry in this collection, returning a new
     * `AugmentedMap` with the results
     * @template T The type of the `this` value
     * @template U The return type of the callback
     * @param callbackfn A function that takes 3 arguments: the current value, the current
     * key and the collection being iterated through
     * @param thisArg Optionally specify a value that will be used as the callback's `this` value
     * @returns A new `AugmentedMap` with the same keys as the old, but whose values will be the
     * results of the callback
     */
    map<U, T>(callbackfn: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => U): AugmentedMap<K, U>;
    map<U, T>(callbackfn: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => U, thisArg: T): AugmentedMap<K, U>;
    map<U, T>(
        callbackfn: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => U,
        thisArg?: T
    ) {
        const result = new AugmentedMap<K, U>();

        for (const [key, value] of this.#internalMap)
            result.set(key, callbackfn.call(thisArg!, value, key, this));

        return result;
    }

    /**
     * Returns the elements of this collection that meet a certain criteria specified in a callback function
     * @param T The type of the `this` value
     * @param predicate A function taking four arguments: the current value, the current key, the current index
     * and the `AugmentedMap` being filtered
     * @param thisArg Optionally specify a value that will be used as the callback's `this` value
     */
    filter<T, S extends V>(
        predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => value is S,
        thisArg?: T
    ): AugmentedMap<K, S>;
    filter<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): AugmentedMap<K, V>;
    filter<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): AugmentedMap<K, V>;
    filter<T>(
        predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown,
        thisArg?: T
    ) {
        const result = new AugmentedMap<K, V>();

        for (const [key, value] of this.#internalMap)
            if (predicate.call(thisArg!, value, key, this))
                result.set(key, value);

        return result;
    }

    /**
     * Sorts the elements within this collection, returning an array with the results
     * @param compareFn A function receiving two arguments, those being two values to compare.
     * If the first is smaller than the second, `compareFn` should return a negative value.
     * If the first is larger than the second, `compareFn` should return a positive value.
     * If the two are to be considered equal, `compareFn` should return 0.
     */
    sort(compareFn: (a: V, b: V) => number) {
        return [...this.#internalArray].sort(compareFn);
    }

    /**
     * Attempts to find an entry in this collection that satisfies the given predicate
     * @template T The type of the callback's `this` value
     * @param predicate A predicate that will be called on every entry in the collection until
     * one returns `true` or the end of the collection
     * @param thisArg Optionally specify a value that will be used as `this` in the callback function
     * @returns The first entry to satisfy the predicate, or `undefined` if none did
     */
    findEntry<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): readonly [K, V] | undefined;
    findEntry<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): readonly [K, V] | undefined;
    findEntry<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg?: T) {
        for (const [key, value] of this.#internalMap)
            if (predicate.call(thisArg!, value, key, this))
                return [key, value] as const;
    }

    /**
     * Attempts to find a value in this collection that satisfies the given predicate
     * @template T The type of the callback's `this` value
     * @param predicate A predicate that will be called on every entry in the collection until
     * one returns `true` or the end of the collection
     * @param thisArg Optionally specify a value that will be used as `this` in the callback function
     * @returns The first value to satisfy the predicate, or `undefined` if none did
     */
    find<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): V | undefined;
    find<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): V | undefined;
    find<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg?: T): V | undefined {
        return this.findEntry(predicate, thisArg!)?.[1];
    }

    /**
     * Calls a given predicate on every entry in this collection, returning `true` if
     * any of the invocations return `true`
     * @template T The type of the callback's `this` value
     * @param predicate A function receiving 3 arguments: the current value, the current key
     * and the `AugmentMap` being iterated through
     * @param thisArg Optionally specify a value that will be used as the callback's `this` value
     */
    some<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): boolean;
    some<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): boolean;
    some<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg?: T) {
        for (const [key, value] of this.#internalMap)
            if (predicate.call(thisArg!, value, key, this))
                return true;

        return false;
    }

    /**
     * Calls a given predicate on every entry in this collection, returning `false` if
     * any of the invocations return `false`
     * @template T The type of the callback's `this` value
     * @param predicate A function receiving 3 arguments: the current value, the current key
     * and the `AugmentMap` being iterated through
     * @param thisArg Optionally specify a value that will be used as the callback's `this` value
     */
    every<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): boolean;
    every<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): boolean;
    every<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg?: T) {
        for (const [key, value] of this.#internalMap)
            if (!predicate.call(thisArg!, value, key, this))
                return false;

        return true;
    }

    /**
     * Checks to see if a certain key exists in this collection.
     * To check for a value's existence, use `includes`.
     * @param key The key to search for
     * @returns `true` if the key exists, `false` otherwise
     */
    has(key: K) {
        return this.#internalMap.has(key);
    }

    /**
     * Checks to see if a certain value exists in this collection.
     * To check for a key's existence, use `has`.
     * @param value The value to search for
     * @returns `true` if the value exists, `false` otherwise
     */
    includes(value: V) {
        return this.#internalArray.includes(value);
    }

    /**
     * Reduces this collection to a single value by calling the specified callback for every element.
     * The returned result, known as the "accumulator", is passed to the next invocation.
     *
     * If this method is likely to be called often, consider looking into the `ReducibleMap` class.
     * @param callbackfn A callback that will receive 4 arguments: the accumulator, the current value,
     * the current key and the `AugmentedMap` being reduced
     * @param initialValue Specify a value that will be used as the accumulator's initial value. If the collection
     * is empty, this is returned if it is specified. **If no initial value is specified and the collection is empty,
     * an error is thrown**
     */
    reduce<U = V>(callbackfn: (accumulator: U, currentValue: V, currentKey: K, collection: AugmentedMap<K, V>) => U, initialValue?: U) {
        if (initialValue === void 0 && this.#internalMap.size == 0)
            throw new srvsdbx_Errors.IllegalOperation("Attempted to perform a reduction on an empty AugmentedMap with no initial value");

        let accumulator = initialValue as U;

        for (const [key, value] of this.#internalMap) {
            if (accumulator === void 0) {
                accumulator = value as unknown as U;
                continue;
            }

            accumulator = callbackfn(accumulator, value, key, this);
        }

        return accumulator;
    }

    /**
     * Essentially a bulk version of `get`, appends multiple entries
     * to this collection
     * @param items The items to be added
     * @returns An array of `boolean`s, each one indicting if the corresponding
     * entry was added successfully
     */
    concat(...items: (readonly [K, V] | [K, V])[]) {
        return items.map(item => this.set(item[0], item[1]));
    }

    /**
     * Returns an iterable iterator of (key, value) pairs for this collection
     */
    entries() { return this.#internalMap.entries(); }

    /**
     * Returns an iterable iterator of keys for this collection
     */
    keys() { return this.#internalMap.keys(); }

    /**
     * Returns an iterable iterator of values pairs for this collection
     */
    values() { return this.#internalMap.values(); }
}

/**
 * A class that allows one to listen to the operations performed on a map
 */
const EventMap = (() => {
    /**
     * A purely cosmetic decorator, meant to convey that a method can be cancelled
     */
    // const Cancellable = generateCosmeticDecorator();

    /**
     * @template K The type of the keys this map uses
     * @template V The type of the values stored in this map
     */
    return class EventMap<K, V> extends SandboxEventTarget<
        {
            /**
             * Emitted when an element is accessed
             */
            get: [K],
            /**
             * Emitted when an element is set
             *
             * Can be cancelled
             */
            set: [K, V];
            /**
             * Emitted when an element is deleted
             *
             * Can be cancelled
             */
            delete: [K, V | undefined];
            /**
             * Emitted when the map is cleared
             */
            clear: [];
        }
    > implements Map<K, V> {
        /**
         * The internal map
         */
        #internal = new Map<K, V>;

        /**
         * The internal map's size
         */
        get size() { return this.#internal.size; }

        /**
         * `* It's a constructor. It constructs.`
         */
        constructor() {
            super();
        }

        /**
         * Returns the iterator of the internal map
        */
        [Symbol.iterator]() { return this.#internal[Symbol.iterator](); }

        /**
         * Returns the toStringTag of the internal map
         */
        [Symbol.toStringTag] = this.#internal[Symbol.toStringTag];

        /**
         * Calls any listeners attached to the `get` event, before calling the original method\
         * This event cannot be cancelled
         * @param key The key to search the map for
         */
        get(key: K) {
            this.dispatchEvent("get", key);

            return this.#internal.get(key);
        }

        /**
         * Calls any listeners attached to the `set` event, before calling the original method
         * @param key The key at which to insert the value
         * @param value The value to insert there
         *
         * - `@Cancellable`: Calling `Event.preventDefault()` will prevent the set operation
         */
        //! @Cancellable
        set(key: K, value: V) {
            if (!this.dispatchEvent("set", key, value)) {
                this.#internal.set(key, value);
            }

            return this;
        }

        /**
         * Calls any listeners attached to the `delete` event, before calling the original method
         * @param key The key to delete
         *
         * - `@Cancellable`: Calling `Event.preventDefault()` will prevent the set operation
         */
        //! @Cancellable
        delete(key: K) {
            if (!this.dispatchEvent("delete", key, this.#internal.get(key))) {
                return this.#internal.delete(key);
            }

            return false;
        }

        /**
         * Calls any listeners attached to the `clear` event, before calling the original method
         *
         * - `@Cancellable`: Calling `Event.preventDefault()` will prevent the set operation
         */
        //! @Cancellable
        clear() {
            if (!this.dispatchEvent("clear")) {
                this.#internal.clear();
            }
        }

        /**
         * Directly calls the equivalent method on the internal map
         * @param callbackfn A function to execute for each key/value pair in the map
         * @param thisArg The `this` argument to invoke each callback with
         */
        forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) {
            return this.#internal.forEach(callbackfn, thisArg);
        }

        /**
         * Directly calls the internal map's `has` method
         * @param key The key to check for
         */
        has(key: K) {
            return this.#internal.has(key);
        }

        /**
         * Directly calls the internal map's `entries` method
         */
        entries() {
            return this.#internal.entries();
        }

        /**
         * Directly calls the internal map's `keys` method
         */
        keys() {
            return this.#internal.keys();
        }

        /**
         * Directly calls the internal map's `values` method
         */
        values() {
            return this.#internal.values();
        }
    };
})();
type EventMap<K, V> = InstanceType<typeof EventMap<K, V>>;

/**
 * A lot of maps are used in the place of regular values in the goal of
 * separating sources from one another—for example, velocities: an object
 * only has one velocity, but it can be made up of many others; maybe the
 * wind is acting on it, and so is a water current, or another object.
 *
 * It's best to keep these sources separate so they can manage themselves
 * and not step on each other's toes, but in order to do any physics, we
 * must reduce them down to a single, "net" value. This is done by calling
 * `[...map.values()].reduce`, and doing whatever reduction operation (adding,
 * multiplying, etc)
 *
 * This calculation can be quite expensive, and is quite unnecessary if the map
 * doesn't change. This class serves to alleviate that problem by caching the
 * result, only recalculating it when the map is mutated
 *
 * @template K The type of the keys used in this map
 * @template V The type of the values used in this map
 * @template R The type of the reduction used in this map. `V` by default
 */
class ReducibleMap<K, V, R = V> implements Map<K, V> {
    /**
     * An internal `Map`, whose operations will trigger recalculations
     */
    readonly #internal = new Map<K, V>();

    /**
     * A function that will be called on each element of the map in order to
     * accumulate the map's values into a single result
     *
     * @param accumulator The value of the accumulated result. If a default value is provided, it'll be that.
     * If not, the first entry's value is used. If the map is empty and there is no default value, an error is thrown.
     * After all the elements have been queried, the value of `accumulator` is returned.
     * @param currentValue The current value; if there is no default value, the first call will have the second value
     * here and the first value already in `accumulator`
     * @param currentKey The current key; if there is no default value, the first call will have the second key
     * here
     * @param map The map currently being iterated through
     */
    #reducer: (accumulator: R, currentValue: V, currentKey: K, map: ReducibleMap<K, V, R>) => R;

    /**
     * A value the accumulator should start at. If the map is empty, this is returned. If the map is empty and
     * there is no default value, an error is thrown.
     */
    readonly #defaultValue: R | undefined;

    /**
     * A cached result of the reduction operation. Invalidated (and then recalculated) whenever the map is mutated
     */
    #cachedValue: R | undefined;
    /**
     * The result of the reduction operation applied over this map's contents
     * @throws {srvsdbx_Errors.IllegalOperation} If the map is empty and no default value was specified
     */
    //! @Throws(srvsdbx_Errors.IllegalOperation)
    get reduced() {
        this.#cachedValue ?? this.#performReduction();

        return this.#cachedValue!;
    }

    get size() { return this.#internal.size; }

    [Symbol.iterator]() { return this.#internal[Symbol.iterator](); }
    [Symbol.toStringTag] = this.#internal[Symbol.toStringTag];

    /**
     * `It's a constructor. It constructs`
     * @param reducer The function that will be used to reduce this map; identical in role to `Array.prototype.reduce`
     * @param defaultValue Optionally specify a value that will start as the accumulated value; if the map is empty
     * and no default value specified, an error is thrown
     */
    constructor(
        reducer: (accumulator: R, currentValue: V, currentKey: K, map: ReducibleMap<K, V, R>) => R,
        defaultValue?: R
    ) {
        this.#reducer = reducer;
        this.#defaultValue = defaultValue;

        this.#cachedValue = void 0;
    }

    /**
     * Performs the actual reduction operation
     *
     * @throws {srvsdbx_Errors.IllegalOperation} If the map is empty and no default value has been specified
     */
    //! @Throws(srvsdbx_Errors.IllegalOperation)
    #performReduction() {
        if (this.size) {
            const entries = [...this.entries()];

            if (this.#defaultValue !== void 0) {
                this.#cachedValue = entries.reduce<R>(
                    (acc, cur) => this.#reducer(acc, cur[1], cur[0], this),
                    this.#defaultValue
                );
            } else {
                // R = V, therefore, any cast between the two is safe
                this.#cachedValue = entries.slice(1).reduce<V>(
                    (acc, cur) => this.#reducer(acc as unknown as R, cur[1], cur[0], this) as unknown as V,
                    entries[0][1]
                ) as unknown as R;
            }
        } else {
            if (this.#defaultValue !== void 0)
                this.#cachedValue = this.#defaultValue!;
            else {
                this.#cachedValue = void 0;
                throw new srvsdbx_Errors.IllegalOperation("Reduction on an empty map with no default value");
            }
        }
    }

    /**
     * Clears the internal map
     */
    clear() {
        this.#internal.clear();

        this.#cachedValue = void 0;
    }

    delete(key: K) {
        this.#cachedValue = void 0;

        return this.#internal.delete(key);
    }

    /**
     * Adds a new element with a specified key and value to the Map.
     * If an element with the same key already exists, the element will be updated.
     * @param key The key to insert the element at
     * @param value The value to insert at the specified key
     * @returns This `ReducibleMap` instance
     */
    set(key: K, value: V) {
        this.#internal.set(key, value);

        this.#cachedValue = void 0;
        return this;
    }

    get(key: K) { return this.#internal.get(key); }
    has(key: K) { return this.#internal.has(key); }
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) { this.#internal.forEach(callbackfn, thisArg); }
    entries() { return this.#internal.entries(); }
    keys() { return this.#internal.keys(); }
    values() { return this.#internal.values(); }
}

/**
 * Essentially a mixin of `AugmentedMap` and `EventMap`
 */
class AugmentedEventMap<K, V> extends AugmentedMap<K, V> {
    // AugmentedMap overrides

    override get(key: K) {
        this.#events.dispatchEvent("get", key);
        return super.get(key);
    }

    override set(key: K, value: V) {
        if (!this.#events.dispatchEvent("set", key, value)) {
            return super.set(key, value);
        }

        return false;
    }

    override delete(key: K) {
        if (!this.#events.dispatchEvent("delete", key, super.get(key))) {
            return super.delete(key);
        }

        return false;
    }

    override clear() {
        if (!this.#events.dispatchEvent("clear")) {
            super.clear();
        }
    }

    // EventMap stuff

    #events = new SandboxEventTarget<ExtractEvents<EventMap<K, V>>>();

    get listenerCount() {
        return this.#events.listenerCount;
    }

    get listeners() {
        return this.#events.listeners;
    }

    addEventListener<J extends keyof ExtractEvents<EventMap<K, V>>>(
        event: J,
        callback: (
            event: Event,
            ...args: ExtractEvents<EventMap<K, V>>[J]
        ) => void
    ) {
        return this.on(event, callback);
    }

    on<J extends keyof ExtractEvents<EventMap<K, V>>>(
        event: J,
        callback: (
            event: Event,
            ...args: ExtractEvents<EventMap<K, V>>[J]
        ) => void
    ) {
        this.#events.on(event, callback);
        return this;
    }

    once<J extends keyof ExtractEvents<EventMap<K, V>>>(
        event: J,
        callback: (
            event: Event,
            ...args: ExtractEvents<EventMap<K, V>>[J]
        ) => void
    ) {
        this.#events.once(event, callback);
        return this;
    }

    removeListener<J extends keyof ExtractEvents<EventMap<K, V>>>(
        event: J,
        callback: (
            event: Event,
            ...args: ExtractEvents<EventMap<K, V>>[J]
        ) => void
    ) {
        return this.#events.removeListener(event, callback);
    }

    removeListenersByType<J extends keyof ExtractEvents<EventMap<K, V>>>(
        event: J
    ) {
        this.#events.removeListenersByType(event);
    }

    removeAllListeners() {
        this.#events.removeAllListeners();
    }

    dispatchEvent<J extends keyof ExtractEvents<EventMap<K, V>>>(
        event: J,
        ...args: ExtractEvents<EventMap<K, V>>[J]
    ) {
        return this.#events.dispatchEvent(event, ...args);
    }
}