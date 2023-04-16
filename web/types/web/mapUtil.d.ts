type MapKey<T> = T extends Map<infer K, any> ? K : T extends AugmentedMap<infer K, any> ? K : never;
type MapValue<T> = T extends Map<any, infer V> ? V : T extends AugmentedMap<any, infer V> ? V : never;
declare class AugmentedMap<K, V> {
    #private;
    toMap(): Map<K, V>;
    toArray(): V[];
    get size(): number;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    constructor();
    get(key: K): V | undefined;
    set(key: K, value: V): boolean;
    swap(keyA: K, keyB: K, allowEmptySlots?: boolean): boolean;
    delete(key: K): boolean;
    clear(): void;
    forEach<T>(callbackfn: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => void, thisArg: T): undefined;
    forEach<T>(callbackfn: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => void): undefined;
    map<U, T>(callbackfn: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => U): AugmentedMap<K, U>;
    map<U, T>(callbackfn: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => U, thisArg: T): AugmentedMap<K, U>;
    filter<T, S extends V>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => value is S, thisArg?: T): AugmentedMap<K, S>;
    filter<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): AugmentedMap<K, V>;
    filter<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): AugmentedMap<K, V>;
    sort(compareFn: (a: V, b: V) => number): V[];
    findEntry<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): readonly [K, V] | undefined;
    findEntry<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): readonly [K, V] | undefined;
    find<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): V | undefined;
    find<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): V | undefined;
    some<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): boolean;
    some<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): boolean;
    every<T>(predicate: (this: undefined, value: V, key: K, collection: AugmentedMap<K, V>) => unknown): boolean;
    every<T>(predicate: (this: T, value: V, key: K, collection: AugmentedMap<K, V>) => unknown, thisArg: T): boolean;
    has(key: K): boolean;
    includes(value: V): boolean;
    reduce<U = V>(callbackfn: (accumulator: U, currentValue: V, currentKey: K, collection: AugmentedMap<K, V>) => U, initialValue?: U): U;
    concat(...items: (readonly [K, V] | [K, V])[]): boolean[];
    entries(): IterableIterator<[K, V]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
}
declare const EventMap: {
    new <K, V>(): {
        "__#12@#internal": Map<K, V>;
        readonly size: number;
        get(key: K): V | undefined;
        set(key: K, value: V): any;
        delete(key: K): boolean;
        clear(): void;
        forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
        has(key: K): boolean;
        entries(): IterableIterator<[K, V]>;
        keys(): IterableIterator<K>;
        values(): IterableIterator<V>;
        [Symbol.iterator](): IterableIterator<[K, V]>;
        [Symbol.toStringTag]: string;
        "__#39@#listenerCount": number;
        readonly listenerCount: number;
        "__#39@#listeners": Listener<{
            get: [K];
            set: [K, V];
            delete: [K, V | undefined];
            clear: [];
        }, "set" | "clear" | "get" | "delete">[];
        readonly listeners: Listener<{
            get: [K];
            set: [K, V];
            delete: [K, V | undefined];
            clear: [];
        }, "set" | "clear" | "get" | "delete">[];
        on<K_1 extends "set" | "clear" | "get" | "delete">(event: K_1, callback: (event: Event, ...args: {
            get: [K];
            set: [K, V];
            delete: [K, V | undefined];
            clear: [];
        }[K_1]) => void): any;
        once<K_2 extends "set" | "clear" | "get" | "delete">(event: K_2, callback: (event: Event, ...args: {
            get: [K];
            set: [K, V];
            delete: [K, V | undefined];
            clear: [];
        }[K_2 & ("set" | "clear" | "get" | "delete") & string]) => void): any;
        removeListener<K_3 extends "set" | "clear" | "get" | "delete">(event: K_3, selector: string | ((event: Event, ...args: {
            get: [K];
            set: [K, V];
            delete: [K, V | undefined];
            clear: [];
        }[K_3]) => void)): boolean;
        addEventListener<K_4 extends "set" | "clear" | "get" | "delete">(event: K_4, callback: (event: Event, ...args: {
            get: [K];
            set: [K, V];
            delete: [K, V | undefined];
            clear: [];
        }[K_4]) => void, options?: {
            once: boolean;
        }): any;
        removeListenersByType(event: "set" | "clear" | "get" | "delete"): void;
        removeAllListeners(): void;
        dispatchEvent<K_5 extends "set" | "clear" | "get" | "delete">(event: K_5, ...args: {
            get: [K];
            set: [K, V];
            delete: [K, V | undefined];
            clear: [];
        }[K_5]): boolean;
    };
};
type EventMap<K, V> = InstanceType<typeof EventMap<K, V>>;
declare class ReducibleMap<K, V, R = V> implements Map<K, V> {
    #private;
    get reduced(): NonNullable<R>;
    get size(): number;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    [Symbol.toStringTag]: string;
    constructor(reducer: (accumulator: R, currentValue: V, currentKey: K, map: ReducibleMap<K, V, R>) => R, defaultValue?: R);
    clear(): void;
    delete(key: K): boolean;
    set(key: K, value: V): this;
    get(key: K): V | undefined;
    has(key: K): boolean;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    entries(): IterableIterator<[K, V]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
}
declare class AugmentedEventMap<K, V> extends AugmentedMap<K, V> {
    #private;
    get(key: K): V | undefined;
    set(key: K, value: V): boolean;
    delete(key: K): boolean;
    clear(): void;
    get listenerCount(): number;
    get listeners(): Listener<{
        get: [K];
        set: [K, V];
        delete: [K, V | undefined];
        clear: [];
    }, "set" | "clear" | "get" | "delete">[];
    addEventListener<J extends keyof ExtractEvents<EventMap<K, V>>>(event: J, callback: (event: Event, ...args: ExtractEvents<EventMap<K, V>>[J]) => void): this;
    on<J extends keyof ExtractEvents<EventMap<K, V>>>(event: J, callback: (event: Event, ...args: ExtractEvents<EventMap<K, V>>[J]) => void): this;
    once<J extends keyof ExtractEvents<EventMap<K, V>>>(event: J, callback: (event: Event, ...args: ExtractEvents<EventMap<K, V>>[J]) => void): this;
    removeListener<J extends keyof ExtractEvents<EventMap<K, V>>>(event: J, callback: (event: Event, ...args: ExtractEvents<EventMap<K, V>>[J]) => void): boolean;
    removeListenersByType<J extends keyof ExtractEvents<EventMap<K, V>>>(event: J): void;
    removeAllListeners(): void;
    dispatchEvent<J extends keyof ExtractEvents<EventMap<K, V>>>(event: J, ...args: ExtractEvents<EventMap<K, V>>[J]): boolean;
}
