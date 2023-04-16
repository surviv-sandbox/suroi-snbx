interface Math {
    // Inherits the JSDoc from the overriden member
    sign(x: number): -1 | 0 | 1;
    /**
     * Compares two numbers
     * @param a The first number to compare
     * @param b The second number to compare
     * @returns Whether the first is larger than the second (`1`), equal to it (`0`) or smaller (`-1`)
     */
    cmp(a: number, b: number): -1 | 0 | 1;
    /**
     * Clamps a value to within a certain range
     * @param value The value to be clamped
     * @param min The minimum value
     * @param max The maximum value
     * @returns A number guaranteed to lie within `[min, max]` if `min <= max`
     */
    clamp(value: number, min: number, max: number): number;
    /**
     * Returns the secant of a number
     * @param x A numeric expression that contains an angle measured in radians
     */
    sec(x: number): number;
    /**
     * Returns the cosecant of a number
     * @param x A numeric expression that contains an angle measured in radians
     */
    csc(x: number): number;
    /**
     * Returns the cotangent of a number
     * @param x A numeric expression that contains an angle measured in radians
     */
    cot(x: number): number;
    /**
     * Returns the arcsecant of a number
     * @param x A numeric expression
     */
    asec(x: number): number;
    /**
     * Returns the arccosecant of a number
     * @param x A numeric expression
     */
    acsc(x: number): number;
    /**
     * Returns the arctangent of a number
     * @param x A numeric expression
     */
    acot(x: number): number;
}

/**
 * ES2022 extensions to the Array interface that can safely be "forced in" because of the Chromium environment
 */
interface Array<T> {
    /**
     * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
     * @param predicate find calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;

    /**
     * Returns the value of the last element in the array where predicate is true, and `undefined` otherwise.
     * @param predicate `findLast` calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, `findLast`
     * immediately returns that element value. Otherwise, `findLast` returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, `undefined` is used instead.
     * @template S The type of value the `is` predicate will test for
     */
    findLast<S extends T>(predicate: (value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
}

/**
 * Allows type safety in export.ts files by removing the `namespace` and `includePath` fields normally required by the `SimpleImport` interface
 *
 * These fields are provided by the import script, and are therefore not required
 *
 * @template I The type of object to import
 */
type ExportInterface<I extends SimpleImport> = Omit<I, Exclude<keyof SimpleImport, "name" | "displayName" | "targetVersion">>;

/**
 * When specifying the dimensions of an object, the sandbox always allows the special string "auto"
 */
type Dimension = number | "auto";

/**
 * Converts a tuple type—such as `[1, 5, "s"]`—into a union of its members—`1 | 5 | "s"`
 * @template T The tuple to convert
 */
type TupleToUnion<T extends readonly any[]> = T extends readonly [infer U, ...infer V] ? V extends [infer W] ? U | W : U | TupleToUnion<V> : never;

/**
 * Extracts the key type from an object type
 * @template T The object from which to extract keys
 */
type ObjectKey<T extends object> = keyof T;

/**
 * Extracts the value type from an object type
 * @template T The object from which to extract values
*/
type ObjectValue<T extends object> = T[keyof T];
// type ObjectValue<T extends object> = T extends { [K in keyof T]: infer V } ? V : never;

/**
 * An extension of the `Partial` type provided natively by Typescript that recursively renders fields optional
 * @template T The object to render partial
 */
type DeepPartial<T extends object> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * An extension of the `Required` type provided natively by Typescript that recursively renders fields required
 * @template T The object to render required
 */
type DeepRequired<T extends object> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

/**
 * A simple function for generating unique, sequential IDs
 */
const generateId = (() => {
    let i = 0n;

    return () => i++;
})();

/**
 * Represents the ID of an object
 */
type ObjectId = ReturnType<typeof generateId>;

/**
 * A namespace containing types and functions related to a Rust-inspired error handling system
 */
namespace srvsdbx_ErrorHandling {
    /**
     * Represents the explicit abscence of a value
     */
    export const Nothing = null;

    /**
     * Represents the explicit abscence of a value
     */
    export type Nothing = typeof Nothing;

    /**
     * Represents a value that might exist
     * @template T The type of value that might exist
     */
    export type Maybe<T> = T | null;

    /**
     * Asserts that a value is not `null`
     * @template T The type of value
     * @param value The value to test
     * @returns `true` if the value is not `null` and `false` otherwise
    */
    export function assertIsPresent<T>(value: Maybe<T>): value is T {
        return value != Nothing;
    }

    /**
     * Returns the given value if a certain condition is true
     * @template T The type of value
     * @param condition The condition that will be evaluated
     * @param value The value to return if the condition is true. May be a function that generates it, in which
     * case said function will be called
     * @returns The value if the condition is `true`, and `null` otherwise
     */
    export function createIf<T, B extends boolean>(condition: B, value: MayBeFunctionWrapped<T>): B extends true ? T : Nothing {
        return condition ? extractValue(value) : Nothing as any;
    }

    /**
     * Represents a successful operation
     * @template T The type of the successful operation's result
    */
    export type ResultRes<T> = { res: T; };
    /**
     * Represents a failed operation
     * @template E The type of the failed operation's result
     */
    export type ResultErr<E> = { err: E; };
    /**
     * Represents a result whose state is unknown
     * @template T The type of the successful operation's result
     * @template E The type of the failed operation's result
     */
    export type Result<T, E> = ResultRes<T> | ResultErr<E>;

    /**
     * Utility function for handling success and failure
     * @template T The type of result to handle
     * @template E The type of error to handle
     * @template Sr The return type of the success callback
     * @template Fr The return type of the failure callback
     * @param val The value to evaluate
     * @param success A callback to be invoked if `val` is a `ResultRes` (no error)
     * @param error A callback to be invoked if `val` is a `ResultErr` (an error occurred)
     * @returns The result of whichever callback ends up being invoked
     */
    export function handleResult<T = never, E = never, Sr = unknown, Fr = unknown>(
        val: Result<T, E>,
        success: (value: T) => Sr,
        error: (error: E) => Fr
    ): ([T] extends [never] ? never : Sr) | ([E] extends [never] ? never : Fr) {
        return "res" in val ? success(val.res) : error(val.err) as any;
    }

    /**
     * Generates a new empty result
     */
    export function emptyResult(): ResultRes<undefined> { return { res: void 0 }; }

    /**
     * A function that returns its value. Useful for passing `ResultRes` values out of `handleResult`
     * @template T The type of the inputted value
     * @param x The value to return
     * @returns The inputted value
     */
    export function identity<T>(x: T) { return x; }

    /**
     * A wrapper for a common `handleResult` call, with the result as the first argument, `identity` as the second and `yeet` as the third.
     *
     * If the result is a `ResultRes`, said result is returned. Otherwise, the result is a `ResultErr`, and said error is thrown.
     * @template T The type of the success value
     * @template E The type of the error value
     * @param val The expression to evaluate
     * @returns The result of whichever callback ends up being invoked
     */
    export function passAlongOrThrow<T, E>(val: Result<T, E>) {
        return handleResult(
            val,
            identity,
            yeet
        );
    }

    /**
     * Throws an expression [with force](https://areweyeetyet.rs)
     * @template E The type of value to throw
     * @param e The expression to be thrown
     */
    export function yeet<E>(e: E): never {
        throw e;
    }
}

/**
 * Represents a value wrapped in a function that returns it
 * @template T The wrapper's return type
 * @template U The arguments passed to the wrapper
 */
type FunctionWrapper<T, U extends any[] = []> = (...args: U) => T;

/**
 * Represents a value that might be "as-is" or wrapped in a function
 * @template T The value's type
 * @template U The arguments that would be passed to the wrapper
 */
type MayBeFunctionWrapped<T, U extends any[] = []> = T | FunctionWrapper<T, U>;

/**
 * Extracts the wrapped value from a `MayBeFunctionWrapped` type
 * @template T The `MayBeFunctionWrapped` type from which to extract
*/
type ExtractWrapped<T> = T extends MayBeFunctionWrapped<infer U, any> ? U : never;

/**
 * Extracts the arguments from a `MayBeFunctionWrapped` type's function form
 * @template T The `MayBeFunctionWrapped` type from which to extract
 */
type ExtractArgs<T> = T extends MayBeFunctionWrapped<any, infer U> ? U : never;

/**
 * Extracts a value that may either be a "plain" value or one wrapped in a function
 * @template T The type of the value to extract
 * @template U The arguments to the wrapper function
 * @param val The expression to evaluate
 * @param args Arguments to be passed to the function, if the expression ends up being one
 * @returns Either the value if it's "as-is", or the result of the invoked function
 */
function extractValue<T, U extends any[] = []>(val: MayBeFunctionWrapped<T, U>, ...args: U) {
    if (typeof val == "function")
        return (val as FunctionWrapper<T, U>)(...args);

    return val;
}

/**
 * Represents a type that may be one or another, depending on a boolean
 * @template B The boolean that will decide the type
 * @template I The type to use if the predicate is true
 * @template E The type to use if the predicate is false
*/
type IfThenElse<B extends boolean, I, E> = B extends true ? I : E;

/**
 * Symbolically represents a pointer to a game object. Practically speaking, a `string`.
 * @template T The type of game object to point to
 */
type PrototypeReference<T extends keyof Gamespace["prototypes"]> = MapKey<Gamespace["prototypes"][T]>;

/**
 * Represents an event handler function for `Element.addEventListener`
 * @template T The type of element to which this listener is attached
 * @template K The type of event this listener listens for
*/
type SimpleListener<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap> = (this: HTMLElementTagNameMap[T], ev: HTMLElementEventMap[K]) => void;

/**
 * Represents a more complex listener where options—such as `passive` and `once`—have been specified.
 * @template T The type of element to which this listener is attached
 * @template K The type of event this listener listens for
 */
type OptionsListener<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap> = {
    /**
     * The callback to invoke when the corresponding event is fired
     */
    callback: SimpleListener<T, K>;
    /**
     * Identical to the third parameter of `EventTarget.addEventListener`
     */
    options?: boolean | AddEventListenerOptions;
};

/**
 * Creates an element, along with any properties, children and listeners one wishes to add
 * @template K The element's tag name
 * @param key The element's tag name
 * @param properties An object specifying the element's properties. All properties are optional
 * @param children Either a single string, a single Node, or an array of both. (`HTMLElement` extends `Node`)
 * @param listeners An object whose keys correspond to the event's name (same as the first argument to `HTMLElement.addEventListener`)
 * and whose values are either a single listener or an array of them, with each listener being one for the chosen event.
 * (same as the second argument to `HTMLElement.addEventListener`)
 * @returns The created element
 */
function makeElement<K extends keyof HTMLElementTagNameMap>(
    key: K,
    properties?: DeepPartial<HTMLElementTagNameMap[K]>,
    children?: string | Node | (string | Node)[],
    listeners?: {
        [key in keyof HTMLElementEventMap]?: SimpleListener<K, key> | OptionsListener<K, key> | (SimpleListener<K, key> | OptionsListener<K, key>)[];
    }
): HTMLElementTagNameMap[K] {
    type Element = HTMLElementTagNameMap[K];
    type ElementAttribute = Element[keyof Element];

    const element = document.createElement(key);

    for (const [key, value] of Object.entries(properties ?? {}) as [keyof Element, ElementAttribute][]) {
        if (typeof element[key] == "object")

            for (
                const [
                    objKey,
                    objVal
                ] of
                Object.entries(value as object) as [keyof ElementAttribute, ElementAttribute[keyof ElementAttribute]][]
            ) element[key][objKey] = objVal;
        else element[key] = value;
    }

    children && element.append(...[children].flat().filter(v => v !== void 0));

    for (const [event, lis] of Object.entries(listeners ?? {}))
        for (const li of [lis].flat())
            if (typeof li == "function")
                (element.addEventListener as any /* forgive me for I have sinned */)(event, li);
            else
                (element.addEventListener as any /* anyScript */)(event, li.callback, li.options);

    return element;
}

/**
 * A namespace containing types and functions to manage assets and work with p5's corresponding classes
 */
namespace srvsdbx_AssetManagement {
    /**
     * A utility types used to keep assets and their paths together
     * @template T The type of asset
     */
    export type AssetSrcPair<T> = {
        /**
         * The path at which this asset lies
         */
        readonly src: string,
        /**
         * The asset
         */
        readonly asset: T;
    };

    /**
     * A type that encapsulates a p5 Image and the address it came from
     *
     * Useful for interop with native `<image>` elements
     */
    export type ImageSrcPair = AssetSrcPair<import("p5").Image>;

    /**
     * A type that encapsulates a p5 Font and the address it came from
     *
     * Useful for interop with native CSS styling
     */
    export type FontSrcPair = AssetSrcPair<import("p5").Font>;

    /**
     * A collection of functions for loading assets into p5 objects
     */
    export const loadingFunctions = (() => {
        function promisify<T, R>(operation: (args: T, success: (args: R) => any, failure: (error: unknown) => any) => R, args: T) {
            return new Promise<R>((resolve, reject) => {
                operation.call(
                    { _decrementPreload() { } },
                    args,
                    resolve,
                    reject
                );
            });
        }

        function toAsync<R>(original: (path: string, success: (args: R) => any, failure: (error: unknown) => any) => R) {
            return async function(path: string): Promise<srvsdbx_ErrorHandling.Result<AssetSrcPair<R>, srvsdbx_Errors.SandboxError>> {
                try {
                    return {
                        res: {
                            src: path,
                            asset: await promisify(original, path)
                        }
                    };
                } catch (e) {
                    return { err: new srvsdbx_Errors.SandboxError(`Failed loading asset at path '${path}'`) };
                }
            };
        }

        return {
            /**
             * Attempts to construct a p5 `Image` object from a given path
             * @param path The path of the asset
             * @returns Either the created asset, or whatever error prevented its creation
             */
            loadImageAsync: toAsync((p5.prototype as import("p5")).loadImage),
            /**
             * Attempts to construct a p5 `Font` object from a given path
             * @param path The path of the asset
             * @returns Either the created asset, or whatever error prevented its creation
             */
            loadFontAsync: toAsync((p5.prototype as import("p5")).loadFont)
        };
    })();

    /**
     * Loads an array of images
     * @param paths An array containing the paths to the images
     * @param errors An array to which any errors will be pushed
     * @param prefix A string to prefix any paths with
     * @returns An array of images and `null`, where `null` is used for any images that failed to load
     */
    export async function loadImageArray(paths: string[], errors: unknown[], prefix = "") {
        const array: srvsdbx_ErrorHandling.Maybe<AssetSrcPair<import("p5").Image>>[] = [];

        for (const path of paths)
            array.push(
                srvsdbx_ErrorHandling.handleResult(
                    await loadingFunctions.loadImageAsync(`${prefix}${path}`),
                    srvsdbx_ErrorHandling.identity,
                    e => (errors.push(e), srvsdbx_ErrorHandling.Nothing)
                )
            );

        return array.filter(srvsdbx_ErrorHandling.assertIsPresent);
    }

    /**
     * Converts any properties named `image` to `ImageSrcPair`s and any properties named `images` to `ImageSrcPair[]`s
     * @template O The type of object to convert
     */
    export type ConvertPathsToImages<O extends object> = {
        // Amazing formatting makes this ternary spam even better
        [K in keyof O]: K extends "image"
        ? ImageSrcPair
        : K extends "images"
        ? O[K] extends string[]
        ? ImageSrcPair[]
        : O[K]
        : O[K] extends object
        ? ConvertPathsToImages<O[K]>
        : O[K] extends object | undefined
        ? ConvertPathsToImages<O[K] & {}> | undefined
        : O[K]
    };

    /**
     * Determines appropriate dimensions, given an image and a set of dimensions
     * @param image The image to size
     * @param dimensions A set of desired dimensions
     */
    export function determineImageDimensions(
        image: ImageSrcPair["asset"],
        dimensions: {
            width: Dimension,
            height: Dimension;
        }
    ) {
        const aspectRatio = image.width / image.height,
            dimWidth = dimensions.width,
            dimHeight = dimensions.height,
            widthIsAuto = dimWidth == "auto",
            heightIsAuto = dimHeight == "auto",
            width =
                widthIsAuto ?
                    heightIsAuto ?
                        image.width :
                        dimHeight * aspectRatio
                    : dimWidth,
            height =
                heightIsAuto ?
                    widthIsAuto ?
                        image.height :
                        dimWidth / aspectRatio
                    : dimHeight;

        return { width, height };
    }
}

/**
 * Picks a random element out of an array passed to it
 * @param array The array tp pick out of
 * @returns A random element
 */
function pickRandomInArray<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * A namespace encompassing a variety of geometrical objects and functions pertaining to the field
 */
namespace srvsdbx_Geometry {
    /**
     * A light-weight representation of a point in 2D space
     */
    export interface Point2D {
        /**
         * This point's x component
         */
        x: number;
        /**
         * This point's y component
         */
        y: number;
    }

    /**
     * Represents a point in 2D space expressed as a polar coordinate
     */
    export interface Polar2D {
        /**
         * The direction of this vector
         */
        direction: number;
        /**
         * The distance of this point from the origin
         */
        magnitude: number;
    }

    /**
     * A mix-in combining polar and Cartesian representations of a 2D point
     */
    export interface Hydrated2DPoint extends Point2D, Polar2D { }

    /**
     * A light-weight representation of a point in 3D space
    */
    export interface Point3D extends Point2D {
        /**
         * This point's z component
         */
        z: number;
    }

    /**
     * An extension of the `Point2D` interface that adds methods to treat the points as vectors and operate on them accordingly
     */
    export class Vector2D implements Point2D {
        /**
         * This vector's x component
         */
        #x: number;
        /**
         * This vector's x component
         *
         * - `get`: Retrieves this vector's x component
         * - `set`: Sets this vector's x component to the provided value if it is not `NaN`
         */
        get x() { return this.#x; }
        set x(v: number) {
            !Number.isNaN(v) && (this.#x = v);
        }

        /**
         * This vector's y component
         */
        #y: number;
        /**
         * This vector's y component
         *
         * - `get`: Retrieves this vector's y component
         * - `set`: Sets this vector's y component to the provided value if it is not `NaN`
         */
        get y() { return this.#y; }
        set y(v: number) {
            !Number.isNaN(v) && (this.#y = v);
        }

        /**
         * The length (or magnitude) of this vector, squared.
         */
        get squaredLength() { return this.#x * this.#x + this.#y * this.#y; };

        /**
         * The length (or magnitude) of this vector.
         *
         * - `get`: Calculates the length (or magnitude) of this vector. For repeated use, it might be worth storing this in a variable to avoid running the getter's code repeatedly
         * - `set`: Scales the vector's components so that its length matches the new length
         */
        get length() { return Math.sqrt(this.squaredLength); }
        set length(v: number) {
            if (!Number.isNaN(v)) {
                const length = this.length,
                    scaleFactor = v / length;

                if (length) {
                    this.#x *= scaleFactor;
                    this.#y *= scaleFactor;
                } else {
                    this.#x = v;
                }
            }
        }

        /**
         *  The direction of this vector with relation to the x-axis.
         *
         * - `get`: Returns the direction of this vector with relation to the x-axis. For repeated use, it might be worth storing this in a variable to avoid running the getter's code repeatedly
         * - `set`: Modifies this vector's components so that its direction matches
         */
        get direction() { return srvsdbx_Math.normalizeAngle(Math.atan2(this.#y, this.#x), "radians"); }
        set direction(v: number) {
            if (!Number.isNaN(v) && Number.isFinite(v)) {
                const length = this.length;

                this.#x = length * Math.cos(v);
                this.#y = length * Math.sin(v);
            }
        }

        /**
         * Simply returns a new zero vector
         * @returns A new zero vector
         */
        static zeroVector() { return new Vector2D(0, 0); }

        /**
         * Returns the origin
         * @returns The origin, (0, 0)
         */
        static zeroPoint() { return { x: 0, y: 0 } as Point2D; }

        /**
         * Given a `Point2D`, creates a new point with additional polar coordinate info
         * @param point The point to augment
         * @returns If the point is a `Vector2D`, a clone of that vector; otherwise, a new object with
         * the original's `x` and `y` components, along with the corresponding polar representation
         */
        static hydrate<T extends Point2D | Polar2D>(point: T): T extends Vector2D ? Vector2D : Hydrated2DPoint {
            if (point instanceof Vector2D) {
                return point.clone() as T extends Vector2D ? Vector2D : Hydrated2DPoint;
            }

            const cartesian = this.toCartesian(point),
                polar = this.toPolar(point);

            return {
                x: cartesian.x,
                y: cartesian.y,
                magnitude: polar.magnitude,
                direction: polar.direction
            } as T extends Vector2D ? Vector2D : Hydrated2DPoint;
        }

        /**
         * Transforms a `Vector3D` to a `Vector2D` by removing its `z` component
         * @param vector The vector to convert
         * @returns A new `Vector2D` object whose `x` and `y` components match those
         * of the `Vector3D` object passed in
         */
        static fromVector3D(vector: Vector3D) {
            return new Vector2D(vector.x, vector.y);
        }

        /**
         * Transforms a `Vector2D` to a `Vector3D` by setting its `z` component to 0
         * @param vector The vector to convert
         * @returns A new `Vector3D` object whose `x` and `y` components match those
         * of the `Vector2D` object passed in and whose `z` component is 0
         */
        static toVector3D(vector: Vector2D) {
            return new Vector3D(vector.x, vector.y, 0);
        }

        /**
         * Converts from polar coordinates to a `Point2D`
         * @param angle The angle of the point relative to the x-axis
         * @param magnitude The distance of the point from the origin
         * @returns A `Point2D` object corresponding to the given polar coordinate
         */
        static fromPolarToPt(angle: number, magnitude: number) {
            return {
                x: magnitude * Math.cos(angle),
                y: magnitude * Math.sin(angle)
            } as Point2D;
        }

        /**
         * Converts from polar coordinates to a `Vector2D`
         * @param angle The angle of the point relative to the x-axis
         * @param magnitude The distance of the point from the origin
         * @returns A `Vector2D` object corresponding to the given polar coordinate
         */
        static fromPolarToVec(angle: number, magnitude: number) {
            const vector = new Vector2D(magnitude * Math.cos(angle), magnitude * Math.sin(angle));

            vector.squaredLength != magnitude * magnitude && vector.squaredLength && (vector.length = Math.abs(magnitude));

            return vector;
        }

        /**
         * Gets the squared distance between a point and the origin
         * @param point The point to be measured
         * @returns The squared distance between the given point and the origin
         */
        static squaredDist(point: Point2D) {
            return point.x * point.x + point.y * point.y;
        }

        /**
         * Returns the distance between a point and the origin
         * @param point The point to be measured
         * @returns The distance between the given point and the origin
         */
        static dist(point: Point2D) {
            return Math.sqrt(this.squaredDist(point));
        }

        /**
         * Gets the squared distance between two points
         * @param pointA The first point
         * @param ptB The second point
         * @returns The squared distance between the two points
         */
        static squaredDistanceBetweenPts(pointA: Point2D, ptB: Point2D) {
            const dx = pointA.x - ptB.x,
                dy = pointA.y - ptB.y;

            return dx * dx + dy * dy;
        }

        /**
         * Returns the distance between two points
         * @param pointA The first point
         * @param ptB The second point
         * @returns The distance between the two points
         */
        static distanceBetweenPts(pointA: Point2D, ptB: Point2D) {
            return Math.sqrt(this.squaredDistanceBetweenPts(pointA, ptB));
        }

        /**
         * Returns a new point whose distance from the origin is 1, and whose direction is the same as the original
         * @param pt The point to take the direction from
         * @returns A point whose distance from the origin is 1, and whose direction is the same as the original point
         */
        static unit(pt: Point2D) {
            const length = this.dist(pt),
                vector = new Vector2D(pt.x / length, pt.y / length);

            (vector.squaredLength != 1 && vector.squaredLength) && (vector.length = 1); // Just to be sure

            return vector.toPoint2D();
        }

        /**
         * Returns whether or not two points have the same components
         * @param pointA The first point to compare
         * @param ptB The second point to compare
         * @returns Whether or not the two points have the same components
         */
        static equals(pointA: Point2D, ptB: Point2D) {
            return pointA.x == ptB.x && pointA.y == ptB.y;
        }

        /**
         * Adds the components of two points together, either modifying the first one or returning a new point.
         * @param pointA The first point to add. If `mutate` is set to `true`, this point's components will be changed.
         * @param pointB The second point. Will never change.
         * @param mutate Whether or not the result should overwrite `pointA` or if it should be returned as a new point.
         * @returns Either a completely new point, or `pointA` if `mutate` was set to `true`.
         */
        static plus(pointA: Point2D, pointB: Point2D, mutate?: boolean) {
            if (mutate) {
                pointA.x += pointB.x;
                pointA.y += pointB.y;
                return pointA;
            }

            return this.hydrate({ x: pointA.x + pointB.x, y: pointA.y + pointB.y });
        }

        /**
         * Subtracts the components of the second point from the first one, either modifying the first one or returning a new point.
         * @param pointA The first point to be subtracted from. If `mutate` is set to `true`, this point's components will be changed.
         * @param pointB The second point. Will never change.
         * @param mutate Whether or not the result should overwrite `pointA` or if it should be returned as a new point.
         * @returns Either a completely new point, or `pointA` if `mutate` was set to `true`.
         */
        static minus(pointA: Point2D, pointB: Point2D, mutate?: boolean) {
            if (mutate) {
                pointA.x -= pointB.x;
                pointA.y -= pointB.y;
                return pointA;
            }

            return this.hydrate({ x: pointA.x - pointB.x, y: pointA.y - pointB.y });
        }

        /**
         * Creates a clone of a Point2D or Vector2D object
         * @template T The type of object passed in
         * @param point The point to clone
         * @returns A clone of the given object
         */
        static clone<T extends Point2D | Vector2D>(point: T) {
            return point instanceof Vector2D ? point.clone() as T : { x: point.x, y: point.y };
        }

        /**
         * Multiplies the given point's components by a scalar, either modifying the original point or returning a new one
         * @param point The point to be scaled
         * @param scale The scale factor
         * @param mutate Whether the original point should be modified or if the result should be returned in a new point
         * @returns The result of scaling the input point's components by the scalar
         */
        static scale(point: Point2D, scale: number, mutate?: boolean) {
            return mutate ? (point.x *= scale, point.y = scale, point) : this.hydrate({ x: scale * point.x, y: scale * point.y });
        }

        /**
         * Multiplies the given point's components by -1, either modifying the original point or returning a new one
         * @param point The point to be scaled
         * @param mutate Whether the original point should be modified or if the result should be returned in a new point
         * @returns The result of scaling the input point's components by the scalar
         */
        static invert(point: Point2D, mutate?: boolean) {
            return mutate ? (point.x *= -1, point.y = -1, point) : this.hydrate({ x: -point.x, y: -point.y });
        }

        /**
         * Treats the two points as vectors and performs a dot product on them
         * @param pointA The first point
         * @param pointB The second point
         * @returns The result of performing the dot product on the points treated as vectors
         */
        static dotProduct(pointA: Point2D, pointB: Point2D) {
            return pointA.x * pointB.x + pointA.y * pointB.y;
        }

        /**
         * Treats the two points as vectors and returns the angle between them
         * @param pointA The first point
         * @param pointB The second point
         * @returns The angle between the two points, treated as vectors
         */
        static angleBetween(pointA: Point2D, pointB: Point2D) {
            return Math.acos(this.dotProduct(pointA, pointB) / Math.sqrt(this.squaredDist(pointA) * this.squaredDist(pointB)));
        }

        /**
         * Treats the two points as vectors and returns the vector projection of the first onto the second.
         * @param pointA The point, whose vector representation will be the vector to be projected
         * @param pointB The point, whose vector representation will be projected on
         * @returns The result of projecting the first vector onto the second
         */
        static projection(pointA: Point2D, pointB: Point2D) {
            return this.hydrate(this.scale(pointB, this.dotProduct(pointA, pointB) / this.squaredDist(pointB)));
        }

        /**
         * Creates a new Vector2D object from a point. Copies the point's components
         * @param point The point to be converted
         * @returns The newly-created vector
         */
        static fromPoint2D(point: Point2D) {
            return new Vector2D(point.x, point.y);
        }

        /**
         * Linearly interpolates between two points
         * @param pointA The first point (start)
         * @param pointB The second point (end)
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new point containing the result's operation\
         * `t = 0` is guaranteed to return a clone of `pointA`; `t = 1` is guaranteed to return a clone of `ptB`.
         */
        static linterp(pointA: Point2D, pointB: Point2D, t: number) {
            let result: Point2D;

            switch (t) {
                case 0: result = Vector2D.clone(pointA); break;
                case 1: result = Vector2D.clone(pointB); break;
                default: result = this.plus(pointA, this.scale(this.minus(pointB, pointA), t));
            }

            return this.hydrate(result);
        }

        /**
         * Checks the point and returns whether either component is `NaN`
         * @param point The point to check
         * @returns `true` if either of the point's components is `NaN`
         */
        static hasNaN(point: Point2D) {
            return Number.isNaN(point.x) || Number.isNaN(point.y);
        }

        /**
         * Casts either a `Vector2D` or a `Point2D` to a `Point2D`
         * @param point The object to be casted. If a `Point2D` is passed, it is not cloned, and the original is returned
         * @returns A `Point2D` object with the same components as the object given
         */
        static toPoint2D(point: Point2D | Vector2D) {
            return point instanceof Vector2D ? point.toPoint2D() : point;
        }

        /**
         * Converts a representation of a 2D point into one using Cartesian
         * coordinates
         * @param point The point to convert. If a `Point2D` is passed in, it
         * is returned as-is
         * @returns Either the original object if it was already a cartesian point,
         * or a cartesian point designating the given polar coordinate
         */
        static toCartesian(point: Point2D | Polar2D) {
            return "x" in point ? point : this.fromPolarToPt(point.direction, point.magnitude);
        }

        /**
         * Converts a representation of a 2D point into one using polar
         * coordinates
         * @param point The point to convert. If a `Polar2D` is passed in, it
         * is returned as-is
         * @returns Either the original object if it was already a polar coordinate,
         * or a polar point designating the given cartesian point
         */
        static toPolar(point: Point2D | Polar2D) {
            return "magnitude" in point
                ? point
                : {
                    direction: srvsdbx_Math.normalizeAngle(Math.atan2(point.y, point.x), "radians"),
                    magnitude: Math.sqrt(point.x * point.x + point.y * point.y)
                };
        }

        /**
         * `* It's a constructor. It constructs.`
         *
        * If `NaN` is passed in, it is replaced by 0
         * @param x The x component of the vector
         * @param y The y component of the vector
         */
        constructor(x: number, y: number) {
            const f = (n: number) => Number.isNaN(n) ? 0 : n;

            this.#x = f(x);
            this.#y = f(y);
        }

        /**
         * Treating this vector as a point, gets the squared distance between this point and another
         * @param point The point to which to measure
         * @returns The squared distance between the two points
         */
        squaredDistToPt(point: Point2D) {
            const dx = this.#x - point.x,
                dy = this.#y - point.y;

            return dx * dx + dy * dy;
        }

        /**
         * Treating this vector as a point, returns the distance between this point and another
         * @param point The point to which to measure
         * @returns The distance between the two points
         */
        distToPt(point: Point2D) {
            return Math.sqrt(this.squaredDistToPt(point));
        }

        /**
         * Returns a new vector whose direction is identical to this one's, but whose magnitude is 1
         * @returns A new vector whose direction is identical to this one's, but whose magnitude is 1
         */
        unit() {
            const length = this.length,
                vector = new Vector2D(this.#x / length, this.#y / length);

            (vector.squaredLength != 1 && vector.squaredLength) && (vector.length = 1);

            return vector;
        }

        /**
         * Compares two vectors, returning whether or not they're equal
         * @param vector The vector to be compared to
         * @returns Whether this vector's components are the same as the one passed in
         */
        equals(vector: Point2D) {
            return this.#x == vector.x && this.#y == vector.y;
        }

        /**
         * Adds a vector to this one, either mutating this one or returning a new vector that's the result of the operation.
         * @param vector The vector to add. This is never modified.
         * @param mutate Whether or not to mutate this vector
         * @returns This vector if `mutate` was set to `true`, and a new `Vector2D` object with the operation's result
         * otherwise
         */
        plus(vector: Point2D | Polar2D, mutate?: boolean) {
            vector = Vector2D.toCartesian(vector);

            if (mutate) {
                this.#x += vector.x;
                this.#y += vector.y;
                return this;
            }

            return new Vector2D(this.#x + vector.x, this.#y + vector.y);
        }

        /**
         * Subtracts a vector from this vector, either mutating this one or returning a new vector that's the result of the operation.
         * @param vector The vector to subtract from this one. This is never modified.
         * @param mutate Whether or not to mutate this vector
         * @returns This vector if `mutate` was set to `true`, and a new `Vector2D` object with the operation's result
         * otherwise
         */
        minus(vector: Point2D | Polar2D, mutate?: boolean) {
            vector = Vector2D.toCartesian(vector);

            if (mutate) {
                this.#x -= vector.x;
                this.#y -= vector.y;
                return this;
            }

            return new Vector2D(this.#x - vector.x, this.#y - vector.y);
        }

        /**
         * Returns a new vector whose components are identical to this one
         * @returns A new vector whose components are identical to this one
         */
        clone() {
            return new Vector2D(this.#x, this.#y);
        }

        /**
         * Multiplies this vector by a scalar, either modifying this vector or returning a new vector with the result
         * @param scale The factor to scale this vector by
         * @param mutate Whether or not to mutate this vector or return a new one
         * @returns This vector if `mutate` was set to `true`, and a new `Vector2D` object with the operation's result
         * otherwise
         */
        scale(scale: number, mutate?: boolean) {
            return mutate ? (this.length *= scale, this) : new Vector2D(this.#x * scale, this.#y * scale);
        }

        /**
         * Multiplies this vector by -1, either modifying this vector or returning a new vector with the result
         * @param mutate Whether or not to mutate this vector or return a new one
         * @returns This vector if `mutate` was set to `true`, and a new `Vector2D` object with the operation's result
         * otherwise
         */
        invert(mutate?: boolean) {
            return mutate ? (this.length *= -1, this) : new Vector2D(-this.#x, -this.#y);
        }

        /**
         * Performs the dot product between this vector and another. Can be used to test perpendicularity: if
         * the dot product is zero, then the two vectors are perpendicular
         * @param vector The vector to perform the dot product with
         * @returns The result of the dot product operation
         */
        dotProduct(vector: Point2D | Polar2D) {
            vector = Vector2D.toCartesian(vector);

            return this.#x * vector.x + this.#y * vector.y;
        }

        /**
         * Returns the angle between this vector and another
         * @param vector The other vector to compare to
         * @returns The angle between this vector and another
         */
        angleBetween(vector: Vector2D) {
            return Math.acos(this.dotProduct(vector) / Math.sqrt(this.squaredLength * vector.squaredLength));
        }

        /**
         * Projects this vector onto another, returning the projected vector
         * @param vector The vector to be projected on
         * @returns A new vector parallel to the one passed in, that can be
         * thought as being this one's "shadow" onto the other
         */
        projection(vector: Vector2D) {
            return vector.scale(this.dotProduct(vector) / vector.squaredLength);
        }

        /**
         * Linearly interpolates between this vector and another
         * @param vector The vector to interpolate with
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new vector containing the result of the operation\
         * `t = 0` is guaranteed to return a copy of `this`; `t = 1` is guaranteed to return a `Vector2D` whose components are `vec`'s.
         */
        linterp(vector: Point2D, t: number) {
            switch (t) {
                case 0: return this.clone();
                case 1: return Vector2D.fromPoint2D(vector);
                default: return this.plus(this.minus(vector).scale(-t));
            }
        }

        /**
         * Checks the point and returns whether either component is `NaN`
         * @returns Whether either component of this vector is `NaN`
         */
        hasNaN() {
            return Number.isNaN(this.#x) || Number.isNaN(this.#y);
        }

        /**
         * Returns a lightweight representation of this object
         * @returns A new `Point2D` object whose components are identical to this
         * vector's
         */
        toPoint2D() {
            return { x: this.#x, y: this.#y } as Point2D;
        }

        /**
         * Returns a lightweight 3D representation of this object
         * @returns A new `Point3D` object whose `x` and `y` components are
         * identical to this vector's, and whose `z` component is 0
         */
        toPoint3D() {
            return { x: this.#x, y: this.#y, z: 0 } as Point3D;
        }

        /**
         * Returns a 3D vector identical to this one (with a z component of 0)
         * @returns A new `Vector3D` object whose `x` and `y` components are
         * identical to this vector's, and whose `z` component is 0
         */
        toVector3D() {
            return new Vector3D(this.#x, this.#y, 0);
        }

        /**
         * Returns a string representation of this vector
         */
        toString() {
            return `[${this.#x} ${this.#y}]`;
        }

        /**
         * Returns a polar coordinate representation of this vector
         */
        toPolar() {
            return Vector2D.toPolar(this.toPoint2D());
        }
    }

    /**
     * An extension of the `Point3D` interface that defines methods to operate on 3D vectors
     */
    export class Vector3D implements Point3D {
        /**
         * This vector's x component
         */
        #x: number;
        /**
         * This vector's x component
         */
        get x() { return this.#x; }
        set x(v: number) {
            if (!Number.isNaN(v))
                this.#x = v;
        }
        /**
         * This vector's y component
         */
        #y: number;/**
     * This vector's y component
     */
        get y() { return this.#y; }
        set y(v: number) {
            if (!Number.isNaN(v))
                this.#y = v;
        }

        /**
         * This vector's z component
         */
        #z: number;
        /**
         * This vector's z component
         */
        get z() { return this.#z; }
        set z(v: number) {
            if (!Number.isNaN(v))
                this.#z = v;
        }

        /**
         * The length (or magnitude) of this vector, squared.
         */
        get squaredLength(): number {
            return this.#x * this.#x + this.#y * this.#y + this.#z * this.#z;
        }

        /**
         * `get`: The length (or magnitude) of this vector.
         *
         * `set`: Scales this vector's components so that its length matches the new length
         */
        get length(): number {
            return Math.sqrt(this.squaredLength);
        }
        set length(v: number) {
            if (!Number.isNaN(v)) {
                const length = this.length,
                    scaleFactor = v / length;

                if (length) {
                    this.#x *= scaleFactor;
                    this.#y *= scaleFactor;
                    this.#z *= scaleFactor;
                } else {
                    this.#x = v;
                }
            }
        }

        /**
         * `get`: Returns this vector's [direction cosines](https://en.wikipedia.org/wiki/Direction_cosine#Cartesian_coordinates)
         *
         * `set`: Modifies this vector's components to match the given [direction cosines](https://en.wikipedia.org/wiki/Direction_cosine#Cartesian_coordinates)
         */
        get direction(): { x: number, y: number, z: number; } {
            const length = this.length;

            return {
                x: Math.acos(this.#x / length),
                y: Math.acos(this.#y / length),
                z: Math.acos(this.#z / length)
            };
        }
        set direction(v: [number, number, number] | { x: number, y: number, z: number; }) {
            const direction = Array.isArray(v)
                ? { x: v[0], y: v[1], z: v[2] }
                : v,
                length = this.length;

            this.x = length * Math.cos(direction.x);
            this.y = length * Math.cos(direction.y);
            this.z = length * Math.cos(direction.z);
        }

        /**
         * Returns a new zero vector
         * @returns A new zero vector
         */
        static zeroVector() { return new Vector3D(0, 0, 0); }

        /**
         * Returns the origin of the 3-dimensional Cartesian plane
         * @returns The origin, (0, 0, 0)
         */
        static zeroPoint() { return { x: 0, y: 0, z: 0 } as Point3D; }

        /**
         * Translates a `Point2D` to a `Vector3D` by simply removing this one's `z` component
         * @param point The point (`Vector2D` objects will work too) to convert
         */
        static fromPoint2D(point: Point2D) {
            return new Vector3D(point.x, point.y, 0);
        }

        /**
         * Translates a `Vector3D` to a `Vector2D` by setting its `z` component to 0
         * @param vector The vector to convert
         */
        static toVector2D(vector: Vector3D) {
            return new Vector2D(vector.x, vector.y);
        }

        /**
         * Gets the squared distance between a point and the origin
         * @param point The point to be measured
         * @returns The square of the distance between the point and th origin
         */
        static squaredDistance(point: Point3D) {
            return point.x * point.x + point.y * point.y + point.z * point.z;
        }

        /**
         * Gets the distance between a point and the origin
         * @param point The point to be measured
         * @returns The of the distance between the point and th origin
         */
        static distance(point: Point3D) {
            return Math.sqrt(this.squaredDistance(point));
        }

        /**
         * Gets the squared distance between two points
         * @param pointA The first point
         * @param pointB The second point
         * @returns The squared distance between the two points
         */
        static squaredDistanceBetweenPts(pointA: Point3D, pointB: Point3D) {
            const dx = pointA.x - pointB.x,
                dy = pointA.y - pointB.y,
                dz = pointA.z - pointB.z;

            return dx * dx + dy * dy + dz * dz;
        }

        /**
         * Returns the distance between two points
         * @param pointA The first point
         * @param pointB The second point
         * @returns The distance between the two points
         */
        static distanceBetweenPts(pointA: Point3D, pointB: Point3D) {
            return Math.sqrt(this.squaredDistanceBetweenPts(pointA, pointB));
        }

        /**
         * Returns a point whose direction is the same as the original, but whose distance from the origin is 1
         * @param point The point
         * @returns A new point colinear with the origin and the original, 1 unit away from the origin
         */
        static unit(point: Point3D) {
            const length = this.distance(point),
                vector = new Vector3D(point.x / length, point.y / length, point.z / length);

            (vector.squaredLength != 1 && vector.squaredLength) && (vector.length = 1);

            return vector.toPoint3D();
        }

        /**
         * Returns whether or not two points have the same components
         * @param pointA The first point to compare
         * @param pointB The second point to compare
         * @returns Whether or not all of the two points' components match
         */
        static equals(pointA: Vector3D, pointB: Vector3D) {
            return pointA.x == pointB.x && pointA.y == pointB.y && pointA.z == pointB.z;
        }

        /**
         * Adds the components of two points together, either modifying the first point or returning a new point
         * @param pointA The first point. If `mutate` is set to `true`, it will be modified
         * @param pointB The second point. Wll never be modified
         * @param mutate Whether the result should be stored in `pointA` or returned as a new point
         * @returns If `mutate` is `false`, a new point with the result is returned; otherwise, `pointA` is mutated accordingly and returned.
         */
        static plus(pointA: Point3D, pointB: Point3D, mutate?: boolean) {
            if (mutate) {
                pointA.x += pointB.x;
                pointA.y += pointB.y;
                pointA.z += pointB.z;
                return pointA;
            }

            return { x: pointA.x + pointB.x, y: pointA.y + pointB.y, z: pointA.z + pointB.z } as Point3D;
        }

        /**
         * Subtracts the components of the second point from the first, either modifying the first point or returning a new point
         * @param pointA The first point. If `mutate` is set to `true`, it will be modified
         * @param pointB The second point. Wll never be modified
         * @param mutate Whether the result should be stored in `pointA` or returned as a new point
         * @returns If `mutate` is `false`, a new point with the result is returned; otherwise, `pointA` is mutated accordingly and returned.
         */
        static minus(pointA: Point3D, pointB: Point3D, mutate?: boolean) {
            if (mutate) {
                pointA.x += pointB.x;
                pointA.y += pointB.y;
                pointA.z += pointB.z;
                return pointA;
            }

            return { x: pointA.x + pointB.x, y: pointA.y + pointB.y, z: pointA.z + pointB.z } as Point3D;
        }

        /**
         * Clones a point and returns the clone
         * @template T The type of object passed in
         * @param point The point to be cloned
         * @returns The cloned point
         */
        static clone<T extends Point3D | Vector3D>(point: T) {
            return point instanceof Vector3D ? point.clone() as T : { x: point.x, y: point.y, z: point.z };
        }

        /**
         * Scales a point's components by a scalar, either mutating the original or returning a new point
         * @param point The point to be scaled
         * @param scale The scale factor
         * @param mutate Whether to modify the original point to store the result or to create a new one to store the result
         */
        static scale(point: Point3D, scale: number, mutate?: boolean) {
            return mutate
                ? (point.x *= scale, point.y *= scale, point.z *= scale, point)
                : { x: point.x * scale, y: point.y * scale, z: point.z * scale } as Point3D;
        }

        /**
         * Scales a point's components by -1, either mutating the original or returning a new point
         * @param point The point to be scaled
         * @param scale The scale factor
         * @param mutate Whether to modify the original point to store the result or to create a new one to store the result
         */
        static invert(point: Point3D, mutate?: boolean) {
            return mutate
                ? (point.x *= -1, point.y *= -1, point.z *= -1, point)
                : { x: -point.x, y: -point.y, z: -point.z } as Point3D;
        }

        /**
         * Treats the two points as vectors and performs the dot product between them
         * @param pointA The first point
         * @param pointB The second point
         * @returns The result of performing the dot product between the two points, interpreted as vectors
         */
        static dotProduct(pointA: Point3D, pointB: Point3D) {
            return pointA.x * pointB.x + pointA.y * pointB.y + pointA.z * pointB.z;
        }

        /**
         * Treats the two points as vectors and gets the angle between the two
         * @param pointA The first point
         * @param pointB The second point
         * @returns The angle between the two points, treated as vectors
         */
        static angleBetween(pointA: Point3D, pointB: Point3D) {
            return Math.acos(this.dotProduct(pointA, pointB) / Math.sqrt(this.squaredDistance(pointA) * this.squaredDistance(pointB)));
        }

        /**
         * Treats the two points as vectors and projects the first onto the second
         * @param pointA The first point
         * @param pointB The second point
         * @returns The result of projecting the first vector onto the second
         */
        static projection(pointA: Point3D, pointB: Point3D) {
            return this.scale(pointA, this.dotProduct(pointA, pointB) / this.distance(pointB));
        }

        /**
         * Treats the two points as vectors and performs the cross product between them
         * @param pointA The first point
         * @param pointB The second point
         * @returns The result of performing the cross product between the two points, interpreted as vectors
         */
        static crossProduct(pointA: Point3D, pointB: Point3D) {
            return {
                x: pointA.y * pointB.z - pointA.z * pointB.y,
                y: pointA.z * pointB.x - pointA.x * pointB.z,
                z: pointA.x * pointB.y - pointA.y * pointB.x
            } as Point3D;
        }

        /**
         * Treats all three points as vectors, and returns the dot product of the first with the cross product of the second.
         * @link https://en.wikipedia.org/wiki/Triple_product
         * @param pointA The first point
         * @param pointB The second point
         * @param pointC The third point
         * @returns The result of the triple product: if it isn't 0, the three vectors are linearly independent, and the numerical
         * value is the volume of the parallepiped delimited by the three vectors
         */
        static tripleProduct(pointA: Point3D, pointB: Point3D, pointC: Point3D) {
            return this.dotProduct(pointA, this.crossProduct(pointB, pointC));
        }

        /**
         * Creates a new Vector3D object from a point. Copies the point's components
         * @param point The point to be converted
         * @returns The newly-created vector
         */
        static fromPoint3D(point: Point3D) {
            return new Vector3D(point.x, point.y, point.z);
        }

        /**
         * Linearly interpolates between two points
         * @param pointA The first point (start)
         * @param pointB The second point (end)
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new point containing the result's operation\
         * `t = 0` is guaranteed to return a clone of `pointA`; `t = 1` is guaranteed to return a clone of `ptB`.
         */
        static linterp(pointA: Point3D, pointB: Point3D, t: number) {
            switch (t) {
                case 0: return Vector3D.clone(pointA);
                case 1: return Vector3D.clone(pointB);
                default: return this.plus(pointA, this.scale(this.minus(pointB, pointA), t));
            }
        }

        /**
         * Checks the point and returns whether any component is `NaN`
         * @param point The point to check
         */
        static hasNaN(point: Point3D) {
            return Number.isNaN(point.x) || Number.isNaN(point.y) || Number.isNaN(point.z);
        }

        /**
         * Casts either a Vector3D or a Point3D to a Point3D
         * @param point The object to be casted. If a Point3D is passed, it is not cloned, and the original is returned
         */
        static toPoint3D(point: Point3D | Vector3D) {
            return point instanceof Vector3D ? point.toPoint3D() : point;
        }

        /**
         * `* It's a constructor. It constructs.`
         *
         * If `NaN` is passed in, it is replaced by 0
         * @param x The x component of the vector
         * @param y The y component of the vector
         * @param z The z component of the vector
         */
        constructor(x: number, y: number, z: number) {
            const f = (n: number) => Number.isNaN(n) ? 0 : n;

            this.#x = f(x);
            this.#y = f(y);
            this.#z = f(z);
        }

        /**
         * Treating this vector as a point, gets the squared distance between this point and another
         * @param point The point to which to measure
         * @returns The squared distance between the two points
         */
        squaredDistToPt(point: Point3D) {
            const dx = this.#x - point.x,
                dy = this.#y - point.y,
                dz = this.#z - point.z;

            return dx * dx + dy * dy + dz * dz;
        }

        /**
         * Treating this vector as a point, returns the distance between this point and another
         * @param point The point to which to measure
         * @returns The distance between the two points
         */
        distToPt(point: Point3D) {
            return Math.sqrt(this.squaredDistToPt(point));
        }

        /**
         * Returns the unit vector associated with this vector
         */
        unit() {
            const length = this.length,
                vector = new Vector3D(this.#x / length, this.#y / length, this.#z / length);

            (vector.squaredLength != 1 && vector.squaredLength) && (vector.length = 1);

            return vector;
        }

        /**
         * Determine if two vectors have equal components
         * @param vector The vector to compare to
         * @returns Whether or not the two vectors have the same components
         */
        equals(vector: Point3D) {
            return this.#x == vector.x && this.#y == vector.y;
        }

        /**
         * Adds a vector to this one, either mutating this one or returning a new vector that's the result of the operation.
         * @param vector The vector to add. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        plus(vector: Point3D, mutate?: boolean) {
            if (mutate) {
                this.#x += vector.x;
                this.#y += vector.y;
                this.#z += vector.z;
                return this;
            }

            return new Vector3D(this.#x + vector.x, this.#y + vector.y, this.#z + vector.z);
        }

        /**
         * Subtracts a vector from this vector, either mutating this one or returning a new vector that's the result of the operation.
         * @param vector The vector to subtract from this one. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        minus(vector: Point3D, mutate?: boolean) {
            if (mutate) {
                this.#x -= vector.x;
                this.#y -= vector.y;
                this.#z -= vector.z;
                return this;
            }

            return new Vector3D(this.#x - vector.x, this.#y - vector.y, this.#z - vector.z);
        }

        /**
         * Returns a new vector whose components are identical to this one
         */
        clone() {
            return new Vector3D(this.#x, this.#y, this.#z);
        }

        /**
         * Multiplies this vector by a scalar, either modifying this vector or returning a new vector with the result
         * @param scale The factor to scale this vector by
         * @param mutate Whether or not to mutate this vector or return a new one
         */
        scale(scale: number, mutate?: boolean) {
            return mutate
                ? (this.length *= scale, this)
                : new Vector3D(scale * this.#x, scale * this.#y, scale * this.#z);
        }

        /**
         * Multiplies this vector by -1, either modifying this vector or returning a new vector with the result
         * @param mutate Whether or not to mutate this vector or return a new one
         */
        invert(mutate?: boolean) {
            return mutate
                ? (this.length *= -1, this)
                : new Vector3D(-this.#x, -this.#y, -this.#z);
        }

        /**
         * Performs the dot product between this vector and another. Can be used to test perpendicularity: if the dot product is zero, then the two vectors are perpendicular
         * @param vec The vector to perform the dot product with
         */
        dotProduct(vec: Point3D) {
            return this.#x * vec.x + this.#y * vec.y + this.#z * vec.z;
        }

        /**
         * Returns the angle between this vector and another
         * @param vec The other vector to compare to
         */
        angleBetween(vec: Vector3D) {
            return Math.acos(this.dotProduct(vec) / this.length * vec.length);
        }

        /**
         * Projects this vector onto another, returning the projected vector
         * @param vec The vector to be projected on
         */
        projection(vec: Vector3D) {
            return vec.scale(this.dotProduct(vec) / vec.length);
        }

        /**
         * Performs the cross product of this vector with another
         * @param vec The vector to perform the cross product with
         * @returns The result of performing the cross product between the two vectors
         */
        crossProduct(vec: Point3D) {
            return new Vector3D(
                this.#y * vec.z - this.#z * vec.y,
                this.#z * vec.x - this.#x * vec.z,
                this.#x * vec.y - this.#y * vec.x
            );
        }

        /**
         * Performs the [triple product](https://en.wikipedia.org/wiki/Triple_product) with this vector as the first one
         * @param vectorA The second vector of the triple product
         * @param vectorB The third vector of the triple product
         * @returns The result of the triple product: if it isn't 0, the three vectors are linearly independent, and the
         * numerical value is the volume of the parallepiped delimited by the three vectors
         */
        tripleProduct(vectorA: Vector3D, vectorB: Vector3D) {
            return this.dotProduct(vectorA.crossProduct(vectorB));
        }

        /**
         * Linearly interpolates between this vector and another
         * @param vector The vector to interpolate with
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new vector containing the result of the operation\
         * `t = 0` is guaranteed to return a copy of `this`; `t = 1` is guaranteed to return a copy of `vector`.
         */
        linterp(vector: Point3D, t: number) {
            switch (t) {
                case 0: return this.clone();
                case 1: return Vector3D.fromPoint3D(vector);
                default: return this.plus(this.minus(vector).scale(-t));
            }
        }

        /**
         * Checks this vector and returns whether any component is `NaN`
         */
        hasNaN() {
            return Number.isNaN(this.#x) || Number.isNaN(this.#y) || Number.isNaN(this.#z);
        }

        /**
         * Returns a lightweight representation of this object
         */
        toPoint3D() {
            return { x: this.#x, y: this.#y, z: this.#z } as Point3D;
        }

        /**
         * Returns a lightweight 2D representation of this object
         */
        toPoint2D() {
            return { x: this.#x, y: this.#y } as Point2D;
        }

        /**
         * Returns a 2D-version of this vector
         */
        toVector2D() {
            return new Vector2D(this.#x, this.#y);
        }

        /**
         * Returns a string representation of this vector
         */
        toString() {
            return `[${this.#x} ${this.#y} ${this.#z}]`;
        }
    }

    /**
     * Represents a line segment, defined by a start and end point
     */
    export type LineSegment = { start: Point2D, end: Point2D; };

    /**
     * Represents a box that completely contains a shape
     *
     * The "axis-aligned" part means that the box will never rotate
     */
    export class AxisAlignedBoundingBox {
        /**
         * The top-left corner of this bounding box
         */
        readonly #min = {
            x: Infinity,
            y: Infinity
        };
        /**
         * The top-left corner of this bounding box
         */
        get min() { return this.#min; }

        /**
         * The top-right corner of this bounding box
         */
        readonly #max = {
            x: -Infinity,
            y: -Infinity
        };
        /**
         * The top-right corner of this bounding box
         */
        get max() { return this.#max; }

        /**
         * Creates a new bounding box from a shape
         * @param shape Either an array of points corresponding to this shape's
         * vertices (no check as to whether the set of points actually forms a polygon is done)
         * or data about a circle
         */
        static from(shape: Point2D[] | { center: Point2D, radius: number; }) {
            const AABB = new AxisAlignedBoundingBox();

            if (Array.isArray(shape)) { // polygon
                for (const vertex of shape) {
                    AABB.#min.x > vertex.x && (AABB.#min.x = vertex.x);
                    AABB.#max.x < vertex.x && (AABB.#max.x = vertex.x);
                    AABB.#min.y > vertex.y && (AABB.#min.y = vertex.y);
                    AABB.#max.y < vertex.y && (AABB.#max.y = vertex.y);
                }
            } else { // circle
                AABB.#min.x = shape.center.x - shape.radius;
                AABB.#max.x = shape.center.x + shape.radius;
                AABB.#min.y = shape.center.y - shape.radius;
                AABB.#max.y = shape.center.y + shape.radius;
            }

            return AABB;
        }

        /**
         * Checks to see if this bounding box intersects another
         * @param aabb The bounding box to check against
         */
        intersects(aabb: AxisAlignedBoundingBox) {
            return this.#min.x <= aabb.#max.x && this.#max.x >= aabb.#min.x
                && this.#max.y >= aabb.#min.y && this.#min.y <= aabb.#max.y;
        }

        /**
         * Checks to see if this bounding box completely contains another
         * (but **not** if this box is contained by another!)
         * @param aabb The bounding box to check against
         */
        contains(aabb: AxisAlignedBoundingBox) {
            return this.#min.x <= aabb.#min.x && this.#max.x >= aabb.#max.x
                && this.#min.y <= aabb.#min.y && this.#max.y >= aabb.#max.y;
        }
    }

    /**
     * Represents a shape of some kind
     */
    interface BaseShape<T extends BaseShape<T>> {
        /**
         * This shape's axis-aligned bounding box
         */
        readonly aabb: AxisAlignedBoundingBox;
        /**
         * A string used to easily recognize this shape
         */
        readonly type: string;
        /**
         * Where this shape lies in the world
         */
        readonly origin: Point2D;
        /**
         * Moves this shape by the specified amount
         * @param translation The amount by which to translate this shape
         */
        translate(translation: Point2D): void;
        /**
         * Moves this shape to the specified location
         * @param newPoint The point to move this shape to
         */
        moveTo(newPoint: Point2D): void;
        /**
         * Scales this shapes relative to its origin by a certain amount
         * @param factor The scale factor to apply.
         */
        scale(factor: number): void;
        /**
         * Essentially a setter for `angle`, rotates this body
         * @param amount The angle to set this shape at
         */
        setAngle(amount: number): void;
        /**
         * Creates a copy of this shape
         */
        clone(): T;
    }

    /**
     * Represents a rectangle
     */
    export class Rectangle implements BaseShape<Rectangle> {
        /**
         * This shape's axis-aligned bounding box
         */
        #aabb!: AxisAlignedBoundingBox;
        get aabb() { return this.#aabb; }

        /**
         * This rectangle's width
         */
        #width: number;
        /**
         * This rectangle's width
         */
        get width() { return this.#width; }
        set width(v: number) {
            if (Number.isNaN(v)) return;

            this.#width = v;
            this.#regenerateVerticesAndAABB();
        }

        /**
         * This rectangle's height
         */
        #height: number;
        /**
         * This rectangle's height
         */
        get height() { return this.#height; }
        set height(v: number) {
            if (Number.isNaN(v)) return;

            this.#height = v;
            this.#regenerateVerticesAndAABB();
        }

        /**
         * The position of this rectangle's top-left corner
         */
        #origin: Point2D;
        /**
         * The position of this rectangle's top-left corner
         */
        get origin() { return this.#origin; }
        translate(translation: Point2D) {
            this.moveTo({
                x: this.#origin.x + translation.x,
                y: this.#origin.y + translation.y
            });
        }
        moveTo(newPoint: Point2D) {
            this.#origin.x = newPoint.x;
            this.#origin.y = newPoint.y;

            this.#regenerateVerticesAndAABB();
        }

        /**
         * A string used to easily recognize this shape
         */
        readonly #type = this.constructor.name;
        get type() { return this.#type; }

        /**
         * This rectangle's four corners
         */
        #vertices!: Point2D[];
        /**
         * Returns *a copy* of this rectangle's four corners
         */
        get vertices() { return this.#vertices.map(srvsdbx_Geometry.Vector2D.clone) as srvsdbx_Geometry.Point2D[]; }

        /**
         * The amount by which this shape has been rotated
         *
         * Rotations do not affect width nor height
         */
        #angle = 0;
        /**
         * The amount by which this shape has been rotated
         *
         * Rotations do not affect width nor height
         */
        get angle() { return this.#angle; }

        /**
         * `* It's a constructor. It constructs.`
         *
         * Creates a new rectangle
         * @param origin The position of this rectangle's center
         * @param width This rectangle's width
         * @param height This rectangle's height
         */
        constructor(origin: Point2D, width: number, height: number) {
            this.#width = width;
            this.#height = height;
            this.#origin = origin;

            this.#regenerateVerticesAndAABB();
        }

        #regenerateVerticesAndAABB() {
            const [halfWidth, halfHeight] = [this.#width / 2, this.#height / 2],

                vertices = [
                    new srvsdbx_Geometry.Vector2D(-halfWidth, -halfHeight),
                    new srvsdbx_Geometry.Vector2D(+halfWidth, -halfHeight),
                    new srvsdbx_Geometry.Vector2D(+halfWidth, +halfHeight),
                    new srvsdbx_Geometry.Vector2D(-halfWidth, +halfHeight)
                ]
                    .map(vec => (vec.direction += this.#angle, vec))
                    .map(vec => vec.plus(this.#origin, true).toPoint2D());

            /*
                Optimization for right-angles: because this
                is a box, we can ensure that the top/bottom
                edges' vertices have the same y component and
                that the left/right edges' vertices have the same
                x component

                This helps reduce the impact of floating-point
                inaccuracies
            */
            if (this.#angle % Math.PI == 0) {
                const [
                    topLeft,
                    topRight,
                    bottomRight,
                    bottomLeft
                ] = vertices;

                if (topLeft.x != bottomLeft.x)
                    topLeft.x = bottomLeft.x = srvsdbx_Math.mean([topLeft.x, bottomLeft.x]);

                if (topRight.x != bottomRight.x)
                    topRight.x = bottomRight.x = srvsdbx_Math.mean([topRight.x, bottomRight.x]);

                if (topLeft.y != topRight.y)
                    topLeft.y = topRight.y = srvsdbx_Math.mean([topLeft.y, topRight.y]);

                if (bottomLeft.y != bottomRight.y)
                    bottomLeft.y = bottomRight.y = srvsdbx_Math.mean([bottomLeft.y, bottomRight.y]);

                this.#vertices = [topLeft, topRight, bottomRight, bottomLeft];
            } else this.#vertices = vertices;

            this.#aabb = AxisAlignedBoundingBox.from(this.#vertices);
        }

        #getSides() {
            return this.#vertices
                .map((vertex, index, vertices) => ({ start: vertex, end: vertices[(index + 1) % vertices.length] })) as LineSegment[];
        }

        setAngle(amount: number) {
            this.#angle = amount;
            this.#regenerateVerticesAndAABB();
        }

        scale(factor: number) {
            if (Number.isNaN(factor)) return;

            this.#width *= factor;
            this.#height *= factor;

            this.#regenerateVerticesAndAABB();
        }

        /**
         * Tests for collisions between this shape and another
         * @param shape The shape against which to test
         * @returns An array of intersection points, along with the side they lie on
         *
         * If one shape contains another, the empty array (`[]`) will be returned. If the
         * two shapes are completely separate, `null` will be returned.
         */
        collides(shape: Shape): srvsdbx_ErrorHandling.Maybe<[Point2D[], LineSegment][]> {
            if (
                shape == this
                || !this.#aabb.intersects(shape.aabb)
            ) return srvsdbx_ErrorHandling.Nothing;

            const fallback = this.#aabb.contains(shape.aabb) || shape.aabb.contains(this.#aabb)
                ? []
                : srvsdbx_ErrorHandling.Nothing;

            if (shape instanceof Rectangle) {
                const otherSides = shape.#getSides(),
                    hits = this.#getSides()
                        .map(side => [
                            otherSides
                                .map(s => collisionFunctions.segmentSegment(s, side))
                                .filter(srvsdbx_ErrorHandling.assertIsPresent),
                            side
                        ] as [Point2D[], LineSegment])
                        .filter(([hits]) => hits.length);

                return srvsdbx_ErrorHandling.createIf(hits.length != 0, hits) ?? fallback;
            }

            const hits = this.#getSides()
                .map(side => [collisionFunctions.segmentCircle(side, shape), side] as [ReturnType<typeof collisionFunctions["segmentCircle"]>, LineSegment])
                .filter(([collision]) => srvsdbx_ErrorHandling.assertIsPresent(collision)) as [ReturnType<typeof collisionFunctions["segmentCircle"]> & {}, LineSegment][];

            return srvsdbx_ErrorHandling.createIf(hits.length != 0, hits) ?? fallback;
        }

        clone() {
            return new Rectangle(srvsdbx_Geometry.Vector2D.clone(this.#origin), this.#width, this.#height);
        }
    }

    /**
     * Represents a circle
     */
    export class Circle implements BaseShape<Circle> {
        /**
         * This shape's axis-aligned bounding box
         */
        #aabb!: AxisAlignedBoundingBox;
        get aabb() { return this.#aabb; }

        /**
         * This circle's radius
         */
        #radius: number;
        /**
         * This circle's radius
         */
        get radius() { return this.#radius; }
        set radius(v) {
            if (Number.isNaN(v)) return;

            this.#radius = v;
            this.#regenerateAABB();
        }

        /**
         * The position of this circle's center
         */
        #origin: Point2D;
        /**
         * The position of this circle's center
         */
        get origin() { return this.#origin; }
        translate(translation: Point2D) {
            this.moveTo({
                x: this.#origin.x + translation.x,
                y: this.#origin.y + translation.y
            });
        }
        moveTo(newPoint: Point2D) {
            this.#origin.x = newPoint.x;
            this.#origin.y = newPoint.y;

            this.#regenerateAABB();
        }

        /**
         * A string used to easily recognize this shape
         */
        readonly #type = this.constructor.name;
        get type() { return this.#type; }

        /**
         * `* It's a constructor. It constructs.`
         *
         * Creates a new circle
         * @param origin The position of this circle's center
         * @param radius This circle's radius
         */
        constructor(origin: Point2D, radius: number) {
            this.#radius = radius;
            this.#origin = origin;

            this.#regenerateAABB();
        }

        #regenerateAABB() {
            this.#aabb = AxisAlignedBoundingBox.from({
                center: this.#origin,
                radius: this.#radius
            });
        }

        scale(factor: number) {
            if (Number.isNaN(factor)) return;

            this.#radius *= factor;
            this.#regenerateAABB();
        }

        // Included for compatibility, this method does nothing
        setAngle(amount: number) { }

        /**
         * Tests for collisions between this shape and another
         * @param shape The shape against which to test
         * @returns An array of intersection points, along with the side they lie on
         *
         * If one shape contains another, the empty array (`[]`) will be returned. If the
         * two shapes are completely separate, `null` will be returned.
         */
        collides(shape: Shape): srvsdbx_ErrorHandling.Maybe<[Point2D[], LineSegment][] | [Point2D] | [Point2D, Point2D]> {
            if (
                shape == this
                || !this.#aabb.intersects(shape.aabb)
            ) return srvsdbx_ErrorHandling.Nothing;

            const fallback = this.#aabb.contains(shape.aabb) || shape.aabb.contains(this.#aabb) ? [] : srvsdbx_ErrorHandling.Nothing;

            if (shape instanceof Rectangle)
                return shape.collides(this) ?? fallback;

            return collisionFunctions.circleCircle(this, shape) ?? fallback;
        }

        clone() {
            return new Circle(srvsdbx_Geometry.Vector2D.clone(this.#origin), this.#radius);
        }
    }

    /**
     * Represents the types of shapes supported by the sandbox
     */
    export type Shape = Circle | Rectangle;

    /**
     * matter.js (un)helpfully doesn't provide intersection points for collisions, so I'm stuck doing it
     */
    export const collisionFunctions = {
        /**
         * Tests whether a line segment is intersecting a circle, without giving intersection points
         * @param segment An object, whose `start` and `end` properties denote the extremities of the line segment
         * @param circle An object, whose `origin` property denotes the circle's position, and whose `radius` property denotes the circle's radius
         * @returns Whether or not the segment is intersecting the circle
         */
        testSegmentCircle(segment: LineSegment, circle: { origin: Point2D, radius: number; }) {
            const slope = (segment.end.y - segment.start.y) / (segment.end.x - segment.start.x);

            switch (slope) {
                case Infinity:
                case -Infinity: { // Vertical line
                    const dx = segment.start.x - circle.origin.x;
                    return circle.radius * circle.radius - dx * dx >= 0;
                }
                case 0: { // Horizontal line
                    const dy = segment.start.y - circle.origin.y;
                    return circle.radius * circle.radius - dy * dy >= 0;
                }
                default: { // Any other line
                    const dx = segment.start.x - circle.origin.x,
                        dy = segment.start.y - circle.origin.y,
                        squareSlopeP1 = slope * slope + 1,
                        subDis = slope * dx - dy;

                    // Note to self: do not write ambiguous math without comments
                    // wtf does this do?
                    return squareSlopeP1 * circle.radius * circle.radius - subDis * subDis >= 0;
                }
            }
        },
        /**
         * Returns the intersection point(s) between a segment and a circle, or `null` if none exist
         * @param segment An object whose `start` and `end` properties denote the extremities of the segment
         * @param circle An object, whose `origin` property denotes the circle's position, and whose `radius` property denotes the circle's radius
         * - `null` if no intersection points exist
         * - An array containing the point(s) of intersection
         */
        segmentCircle(segment: LineSegment, circle: { origin: Point2D, radius: number; }): srvsdbx_ErrorHandling.Maybe<[Point2D] | [Point2D, Point2D]> {
            // Based on https://www.desmos.com/calculator/r9w38kskse
            const [
                minX,
                maxX,
                minY,
                maxY
            ] = [
                    Math.min(segment.start.x, segment.end.x),
                    Math.max(segment.start.x, segment.end.x),
                    Math.min(segment.start.y, segment.end.y),
                    Math.max(segment.start.y, segment.end.y)
                ];

            // Bounds check
            if (
                maxX < circle.origin.x - circle.radius ||
                minX > circle.origin.x + circle.radius ||
                maxY < circle.origin.y - circle.radius ||
                minY > circle.origin.y + circle.radius
            ) return srvsdbx_ErrorHandling.Nothing;

            function validate<T extends Point2D[]>(points: T) {
                const hits = points.filter(point =>
                    srvsdbx_Math.checkBounds(point.x, minX, maxX)
                    && srvsdbx_Math.checkBounds(point.y, minY, maxY)
                ) as T;

                return srvsdbx_ErrorHandling.createIf(hits.length != 0, hits);
            }

            switch (true) {
                case (segment.start.x == segment.end.x): { // Vertical line
                    const dx = segment.start.x - circle.origin.x,
                        discriminant = circle.radius * circle.radius - dx * dx;

                    switch (Math.sign(discriminant)) {
                        case -1: return srvsdbx_ErrorHandling.Nothing;
                        case 0: return validate<[Point2D]>([{ x: segment.start.x, y: circle.origin.y }]);
                        case 1: {
                            const root = Math.sqrt(discriminant);

                            return validate<[Point2D, Point2D]>([
                                { x: segment.start.x, y: circle.origin.y + root },
                                { x: segment.start.x, y: circle.origin.y - root }
                            ]);
                        }
                    }
                }
                case (segment.start.y == segment.end.y): { // Horizontal line
                    const dy = segment.start.y - circle.origin.y,
                        discriminant = circle.radius * circle.radius - dy * dy;

                    switch (Math.sign(discriminant)) {
                        case -1: return srvsdbx_ErrorHandling.Nothing;
                        case 0: return validate<[Point2D]>([{ x: circle.origin.x, y: segment.start.y }]);
                        case 1: {
                            const root = Math.sqrt(discriminant);

                            return validate<[Point2D, Point2D]>([
                                { x: circle.origin.x + root, y: segment.start.y },
                                { x: circle.origin.x - root, y: segment.start.y },
                            ]);
                        }
                    }
                }
                default: { // Any other line
                    const slope = (segment.end.y - segment.start.y) / (segment.end.x - segment.start.x),
                        dx = segment.start.x - circle.origin.x,
                        dy = segment.start.y - circle.origin.y,
                        squareSlopeP1 = slope * slope + 1,
                        subDis = slope * dx - dy,
                        discriminant = squareSlopeP1 * circle.radius * circle.radius - subDis * subDis,
                        sign = Math.sign(discriminant);

                    switch (sign) {
                        case -1: return srvsdbx_ErrorHandling.Nothing;
                        case 0:
                        case 1: {
                            const b = segment.start.y - slope * segment.start.x,
                                numerator = (circle.origin.x - slope * (b - circle.origin.y)),
                                x = numerator / squareSlopeP1,
                                f = (x: number) => slope * x + b;

                            if (sign == 0) return validate<[Point2D]>([{ x: x, y: f(x) }]);

                            const root = Math.sqrt(discriminant),
                                x1 = (numerator + root) / squareSlopeP1,
                                x2 = (numerator - root) / squareSlopeP1;

                            return validate<[Point2D, Point2D]>([
                                { x: x1, y: f(x1) },
                                { x: x2, y: f(x2) }
                            ]);
                        }
                    }
                }
            };
        },
        /**
         * Returns the intersection between two given circles
         * @param circleA The first circle
         * @param circleB The second circle
         * @returns An array of intersection points
         * - If the circle do not intersect at all, `null` is returned.
         * - If one circle is inside the other, an empty array (`[]`) is returned
         */
        circleCircle(circleA: { origin: Point2D, radius: number; }, circleB: { origin: Point2D, radius: number; }): srvsdbx_ErrorHandling.Maybe<[] | [Point2D] | [Point2D, Point2D]> {
            // Based on https://www.desmos.com/calculator/c3l5vrystu

            const distanceBetweenCircles = Vector2D.distanceBetweenPts(circleA.origin, circleB.origin);

            if (distanceBetweenCircles == 0) return srvsdbx_ErrorHandling.Nothing;
            if (distanceBetweenCircles > circleA.radius + circleB.radius) return srvsdbx_ErrorHandling.Nothing;
            if (distanceBetweenCircles < Math.max(circleA.radius, circleB.radius) - Math.min(circleA.radius, circleB.radius)) return [];

            /*
                Here, "i" means independent and "d" means dependent

                This is done because in the case of dy = 0, it's necessary to swap x and y's places
                Rather than have confusing x/y swaps, we name them dependent and independent

                A "d" as the first letter means "difference", like in calculus
            */
            const { x: x0, y: y0 } = circleA.origin,
                { x: x1, y: y1 } = circleB.origin,
                [r0, r1] = [circleA.radius, circleB.radius],
                [dx, dy] = [
                    x0 - x1,
                    y0 - y1
                ],
                [dx2, dy2, dr2] = [
                    x1 ** 2 - x0 ** 2,
                    y1 ** 2 - y0 ** 2,
                    r1 ** 2 - r0 ** 2
                ],
                sameY = dy == 0,

                [dd, di, dd2, di2] = sameY
                    ? [dx, dy, dx2, dy2]
                    : [dy, dx, dy2, dx2],

                d_dri2 = dr2 - di2,
                d0 = sameY ? y0 : x0,

                [a, b, c] = [
                    1 + (di / dd) ** 2,
                    -(2 * d0 + di * (d_dri2 / (dd ** 2) - 1)),
                    ((d_dri2 - dd ** 2) / (2 * dd)) ** 2 + d0 ** 2 - r0 ** 2
                ],
                discriminant = b ** 2 - 4 * a * c,
                sign = Math.sign(discriminant);

            const f = (xs: number) => (dr2 - di2 - dd2 - 2 * xs * di) / (2 * dd);

            switch (sign) {
                case -1: return srvsdbx_ErrorHandling.Nothing;
                case 0:
                case 1: {
                    /*
                        The name refers to the fact that normally, this'd be
                        a solution to a quadratic in x

                        However, as previously noted, it's possible for us to be
                        solving a quadratic in y, so we name it so instead
                    */
                    const dependantBase = -b / (2 * a);

                    if (sign == 0) {
                        return [
                            sameY ? {
                                x: f(dependantBase),
                                y: dependantBase
                            } : {
                                x: dependantBase,
                                y: f(dependantBase)
                            }
                        ];
                    }

                    const root = Math.sqrt(discriminant) / (2 * a),
                        [sx0, sx1] = [
                            dependantBase + root,
                            dependantBase - root,
                        ];

                    return sameY ? [
                        { x: f(sx0), y: sx0 },
                        { x: f(sx1), y: sx1 }
                    ] : [
                        { x: sx0, y: f(sx0) },
                        { x: sx1, y: f(sx1) }
                    ];
                }
            }
        },
        /**
         * Returns the intersection point between two line segments, or `null` if none are found
         * @param segmentA The first segment
         * @param segmentB The second segment
         * @returns The intersection between the two segments, or `null` if none are found
         */
        segmentSegment(segmentA: LineSegment, segmentB: LineSegment): srvsdbx_ErrorHandling.Maybe<Point2D> {
            function toSlopeIntercept(line: LineSegment) {
                const [sx, sy, ex, ey] = [
                    line.start.x,
                    line.start.y,
                    line.end.x,
                    line.end.y,
                ];

                let ln: { slope: number, intercept: number; };

                switch (true) {
                    case sx == ex: {
                        ln = { slope: Infinity, intercept: sx };
                        break;
                    }
                    case sy == ey: {
                        ln = { slope: 0, intercept: sy };
                        break;
                    }
                    default: {
                        const slope = (ey - sy) / (ex - sx);

                        ln = { slope, intercept: sy - slope * sx };
                    }
                }

                return {
                    slope: ln.slope,
                    intercept: ln.intercept,
                    start: line.start,
                    end: line.end
                };
            }

            /*
                Ensure overlapping endpoints always test positive

                This eliminates the need to test parallel lines in further cases, because the
                only way they can register a collision is for their endpoints to touch
                (0 and infinite solutions are counted as no solutions)
            */
            if (Vector2D.equals(segmentA.start, segmentB.end)) return Vector2D.clone(segmentB.end);
            if (Vector2D.equals(segmentB.start, segmentA.end)) return Vector2D.clone(segmentA.end);

            const [lineA, lineB] = [segmentA, segmentB].map(toSlopeIntercept);

            switch (true) {
                case (lineA.slope == 0 && lineB.slope == 0): // Two horizontal lines
                case (lineA.slope == Infinity && lineB.slope == Infinity):  // Two vertical lines
                    return srvsdbx_ErrorHandling.Nothing;
                case (lineA.slope == Infinity || lineB.slope == Infinity): { // One non-vertical (horizontal or diagonal) and one vertical line
                    const vertical = lineA.slope == Infinity ? lineA : lineB,
                        diagonal = vertical == lineA ? lineB : lineA;

                    if (
                        !srvsdbx_Math.checkBounds(
                            vertical.intercept,
                            Math.min(diagonal.start.x, diagonal.end.x),
                            Math.max(diagonal.start.x, diagonal.end.x)
                        )
                    ) return srvsdbx_ErrorHandling.Nothing;
                    // If the vertical segment's x component isn't within the range of the diagonal's, the lines aren't touching

                    /*
                        What defines a line of the form "y = ax + b" is that for each point on the line,
                        its y component is equal to a times its x component, plus b.

                        Therefore, by evaluating this rule with the vertical line's x component, we find
                        the point on the diagonal line that lies above/below/on the vertical segment

                        We then check to see whether the y component of this new point is within the range
                        bounded by the vertical segment. If it is, that's the intersection; if not, no intersection.
                    */
                    const y = diagonal.slope * vertical.intercept + diagonal.intercept;

                    return srvsdbx_ErrorHandling.createIf(
                        srvsdbx_Math.checkBounds(
                            y,
                            Math.min(vertical.start.y, vertical.end.y),
                            Math.max(vertical.start.y, vertical.end.y)
                        ),
                        { x: vertical.intercept, y: y }
                    );
                }
                default: { // Two non-vertical lines
                    const minA = Math.min(lineA.start.x, lineA.end.x),
                        maxA = Math.max(lineA.start.x, lineA.end.x),
                        minB = Math.min(lineB.start.x, lineB.end.x),
                        maxB = Math.max(lineB.start.x, lineB.end.x);

                    // Parallel lines, so exit
                    if (lineA.slope == lineB.slope) return srvsdbx_ErrorHandling.Nothing;

                    /*
                        Non-parallel lines (most common case)

                        Isolate x through some simple algebra

                        slopeA * x + intA = slopeB * x + intB
                        slopeA * x - slopeB * x = intB - intA
                        (slopeA - slopeB) * x = intB - intA
                        x = (intB - intA) / (slopeA - slopeB)
                    */

                    const x = (lineB.intercept - lineA.intercept) / (lineA.slope - lineB.slope),
                        point = { x: x, y: lineA.slope * x + lineA.intercept };
                    /*
                        Check that this point is indeed on both lines by checking that its
                        x component is within the range of both lines
                    */
                    return srvsdbx_ErrorHandling.createIf(
                        srvsdbx_Math.checkBounds(x, minA, maxA) && srvsdbx_Math.checkBounds(x, minB, maxB),
                        point
                    );
                }
            }
        },
        /**
         * Returns all intersection points between a line segment and a polygon, along with the edge that each point is on
         * @param segment The line segment
         * @param polygonVertices The polygon, represented as an array of vertices.
         * No check as to whether this set of vertices really forms a polygon is done.
         * @returns An array of pairs, with each pair's first element being an intersection point and each pair's second element
         * being the segment of the polygon said intersection point lies on.
         */
        segmentPolygon(segment: LineSegment, polygonVertices: Point2D[]): srvsdbx_ErrorHandling.Maybe<[Point2D, LineSegment][]> {
            // Garbage
            const hits = polygonVertices
                .map((pt, i, arr) => ({ start: pt, end: arr[(i + 1) % arr.length] } as LineSegment))      // Convert each pair into an edge
                .map(ln => [this.segmentSegment(segment, ln), ln] as const)                               // Run detection on those edges
                .filter(([pt]) => srvsdbx_ErrorHandling.assertIsPresent(pt)) as [Point2D, LineSegment][]; // Filter out the misses

            return srvsdbx_ErrorHandling.createIf(hits.length != 0, hits);
        },
        /**
         * Runs a "one-to-many" collision query, where collisions are tested between one shape and a variety of others
         * @param shape The "main" shape to test collisions against
         * @param shapes An array of shapes against which collisions will be tested
         * @returns An array of pairs whose first elements are collision points and whose second elements are the shapes the
         * aforementioned points originated from
         */
        shapeShapes: (() => {
            type A = [Point2D[], LineSegment][] | [Point2D] | [Point2D, Point2D];
            type T = [A, Rectangle | Circle];
            type M<T> = srvsdbx_ErrorHandling.Maybe<T>;

            return (shape: (Rectangle | Circle), shapes: (Rectangle | Circle)[]): M<[[Point2D[], LineSegment][] | [Point2D] | [Point2D, Point2D], Rectangle | Circle][]> => {
                const hits = shapes.map(s => [shape.collides(s), s] as [M<A>, Rectangle | Circle])
                    .filter(([pt]) => srvsdbx_ErrorHandling.assertIsPresent(pt)) as T[];

                return srvsdbx_ErrorHandling.createIf(hits.length != 0, hits);
            };
        })(),
        /**
         * Runs a "one-to-many" collision query between a line segment and a collection of shapes
         * @param line The line segment to test
         * @param shapes The shapes to test against
         * @returns An array of pairs whose first elements are collision points and whose second elements are the shapes the
         * aforementioned points originated from
         */
        segmentShapes: (() => {
            type A = [Point2D] | [Point2D, Point2D] | [Point2D, LineSegment];
            type T = [A, Rectangle | Circle];
            type M<T> = srvsdbx_ErrorHandling.Maybe<T>;

            return (line: LineSegment, shapes: (Rectangle | Circle)[]): M<[[Point2D] | [Point2D, Point2D] | [Point2D, LineSegment], Rectangle | Circle][]> => {
                const hits = (shapes.map(s => [
                    s instanceof Rectangle
                        ? collisionFunctions.segmentPolygon(line, s.vertices)
                        : collisionFunctions.segmentCircle(line, s),
                    s
                ]) as [srvsdbx_ErrorHandling.Maybe<A>, Rectangle | Circle][])
                    .filter(([pt]) => srvsdbx_ErrorHandling.assertIsPresent(pt)) as T[];

                return srvsdbx_ErrorHandling.createIf(hits.length != 0, hits);
            };
        })()
    };
}

/**
 * For a given function, creates a new function whose results will be cached, along with the arguments that created them; this allows for subsequent calls to be very fast.
 *
 * For the cache to be sensible and work, a function must be [*pure*](https://en.wikipedia.org/wiki/Pure_function):
 * that is to say, for a given input, it must always return the same output, and must neither rely on nor modify any external objects.
 *
 * It is generally useful caching expensive functions that are called often, and therefore have an increased likelihood of being called with the same arguments. For example,
 * the trigonometric functions are quite slow, and very commonly used—it's therefore a good idea to cache them (and to add lookup tables). Inversely, something like `floor`
 * is not very taxing, and isn't very likely to be called with the same arguments multiple times.
 *
 * That being said, native functions (like `Math.sin`) shouldn't be cached, because runtimes usually provide implementations that are extremely fast—way faster than any
 * user-defined function could ever be. Caching these functions is therefore counter-productive, simply because the runtime's versions are so fast that the recalculation costs
 * less than a cache hit.
 *
 * Remember that a cache trades increased speed for increased memory: if a function is called with a new set of arguments virtually every call, the cache will hardly ever
 * be hit, and it will always be added to as misses are converted to entries; this leads to increased memory usage with no performance gain. It's therefore not a good idea
 * to cache functions with many arguments, such as `Math.max`, as they're also unlikely to have multiple identical invocations. Note that a cache is never cleared; internally,
 * it's just a `Map`.
 *
 * Impure functions should not be cached: imagine caching `Math.random`; every call to the returned function would then yield the same number, because every call would
 * have the same 0 arguments. As for functions that rely on or mutate their external environment, since the cache does not take said environment into account, a cached
 * invocation may return an incorrect result if the external state that the function depends on is different from when that result was cached. Similarly, if the function
 * modifies its external environment, that modification will only occur on cache misses, since cache hits do not execute the function, and thus, do not have side-effects.
 *
 * **Warning:**
 * Take care when caching functions that return objects—whether they be arrays or maps or other—, because cache hits will return references to the original. This also means
 * that modifying that object will modify the one stored in the cache.
 *
 * @example
 * let x = 0;
 * const badCache = cachify(function() {
 *     return ++x;
 * });
 *
 * badCache(); // 1
 * badCache(); // still 1
 *
 * const fn = cachify(function() {
 *     return { foo: 2 };
 * });
 *
 * const objA = fn(),
 *  objB = fn();
 *
 * objA === objB; // true
 * objA.foo = 5;
 * fn().foo; // 5
 * @template P The arguments to the function
 * @template R The return type
 * @template B A boolean type on whether or not to add diagnostics
 * @param fn The function to be cached
 * @param config An object with properties to adjust this function's behavior
 * @returns A function with the same signature as the original that will perform a cache test. If a cache miss occurs, the original function is
 * called, and its result—along with the arguments that generated it—are cached.
 */
function cachify<P extends any[] = never[], R = never, B extends boolean = false>(
    fn: (...args: P) => R,
    config: {
        /**
         * A function that will be used to determine if a set arguments matches another. More precisely, for each of the cache's entries,
         * this function is called with the entry's key (aka the arguments for the invocation of the cached function that generated that entry)
         * and the arguments to the dummy function (the one that `cachify` returns); if the function returns `true`, then the two invocations
         * are deemed equivalent, and that entry's result is returned—a cache hit. If none of the entries return `true`, it's considered a "cache
         * miss"; the original function is called, and the result—along with the arguments that generated it‚ are added to the cache.
         *
         * This is done mostly to resolve equality between objects; since using `===` compares references, we need another way to check if two
         * objects are identical.
         *
         * This function shouldn't rely on external state, and it should be associative (if a == b, then b == a) as well as transitive
         * (if a == b and b == c, then a == c)
         * @param a One set of arguments
         * @param b Another set of arguments
         * @returns Whether or not the two sets of arguments are the same.
         */
        equalityFunction?: (a: P, b: P) => boolean,
        /**
         * A set of initial entries to populate the cache with.
         * @example
         * const add = cachify(
         *     function(a: number, b: number) {
         *         console.log("Call!");
         *         return a + b;
         *     },
         *     {
         *         initialEntries: [
         *             [[1, 1], 2],
         *             [[1, 2], 3],
         *         ]
         *     }
         * );
         *
         * add(1, 1); // Logs nothing, returns 2
         * add(1, 2); // Logs nothing, returns 3
         * add(2, 1); // Logs "Call!", returns 3
         */
        initialEntries?: (readonly [P, R])[],
        /**
         * Whether to attach a `diagnostics` property to the emitted function; this object will store various data about the function such as
         * cache hits and misses, which can be useful for gauging the effectiveness of the cache
         */
        diagnostics?: B;
    } = {}
): (B extends true ? {
    /**
     * Diagnostics about this cached function
     */
    readonly diagnostics: {
        /**
         * The total amount of times this function has been called
         */
        readonly calls: number;
        /**
         * The number of entries in the cache
         */
        readonly cacheSize: number;
        /**
         * The number of times a call has resulted in a cache hit
         */
        readonly cacheHits: number;
        /**
         * The number of times a call has missed the cache, forcing the original function to be called
         */
        readonly cacheMisses: number;
        /**
         * The ratio of hits to total calls
         */
        readonly cacheHitRate: number;
    };
} : {}) & ((...args: P) => R) {
    const equalityFunction = config.equalityFunction ?? ((a: P, b: P) => a.length == b.length && a.every((v, i) => v === b[i])),
        cache = new Map<P, R>(config.initialEntries ?? []),
        doDiagnostics = !!config.diagnostics;

    let hits = 0,
        misses = 0;

    type Result<B extends boolean> = ReturnType<typeof cachify<P, R, B>>;

    const entries = [...cache.entries()],
        proxy = function(...args: P) {
            const cacheEntry = entries.find(([key]) => equalityFunction(key, args));
            if (cacheEntry) return (doDiagnostics && ++hits), cacheEntry[1];

            (doDiagnostics && ++misses);
            const result = fn(...args);
            cache.set(args, result);
            entries.push([args, result]);

            return result;
        } as Result<B>;

    if (doDiagnostics)
        (proxy as { -readonly [K in keyof Result<true>]: Result<true>[K] }).diagnostics = {
            get calls() { return hits + misses; },
            get cacheSize() { return cache.size; },
            get cacheHits() { return hits; },
            get cacheMisses() { return misses; },
            get cacheHitRate() { return hits / this.calls; },
        };

    return proxy;
}

/**
 * A variety of functions related to object-oriented programming
 *
 * Java go brr
 */
namespace srvsdbx_OOP {
    /**
     * Takes a class as an argument and returns a version of that class that can only be instantiated once
     * @template T The class from which a singleton will be made
     * @param cls The class to make a singleton of
     * @returns The [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) object
     */
    export function createSingleton<T extends new (...args: any[]) => object>(cls: T) {
        let initialized = false;

        return new Proxy(cls, {
            construct(target, args) {
                if (initialized) throw new Error(`Error: class '${cls.name}' already initialized.`);

                initialized = true;
                return new target(...args);
            },
        });
    }

    /**
     * Makes a class [abstract](https://en.wikipedia.org/wiki/Abstract_type), meaning that it cannot be
     * instantiated directly; the only way to instantiate an abstract class is by way of a sub-class that is
     * itself not abstract ("concrete").
     * @param cls The class to make abstract
     * @returns An abstract class whose constructor will throw a `TypeError` if called directly
     */
    export function makeAbstract<T extends abstract new (...args: any[]) => object>(cls: T) {
        let skip = false;

        const proxy = new Proxy(
            cls,
            {
                construct(_, args, newTarget) {
                    if (newTarget == proxy) {
                        //@ts-expect-error
                        if (skip) return new cls(...args);
                        else throw new TypeError(`Cannot instantiate abstract class '${cls.name}'`);
                    } else skip = true;

                    //@ts-expect-error
                    const obj = new cls(...args);
                    Object.setPrototypeOf(obj, newTarget.prototype);
                    skip = false;

                    return obj;
                }
            }
        );

        return proxy;
    }

    /**
     * Makes a class final, meaning that it cannot be extended; any attempt ot do so throws an error
     * @param cls The class to make final
     * @returns A final class whose constructor will throw a `TypeError` if called indirectly (through a subclass)
     */
    export function makeFinal<T extends new (...args: any[]) => object>(cls: T) {
        const proxy = new Proxy(
            cls,
            {
                construct(_, args, newTarget) {
                    if (newTarget != proxy)
                        throw new TypeError(`Cannot instantiate final class '${cls.name}' through a subclass ('${newTarget.name}')`);

                    return new cls(...args);
                }
            }
        );

        return proxy;
    }
}

/**
 * Represents an event listener
 * @template E The event map this listener belongs to
 * @template K The type of event this listener is bound to
 */
interface Listener<E extends SandboxEventMap, K extends keyof E & string = keyof E & string> {
    /**
     * The event type this listener is attached to
     */
    readonly event: string,
    /**
     * The function to be invoked when the event is fired
     * @param event The event dispatched
     * @param args Any additional argument
     */
    callback(event: Event, ...args: E[K]): void,
    /**
     * The listener's name
     */
    readonly name: string,
    /**
     * Whether the listener should only be run once and then removed
     */
    readonly once?: boolean;
};

/**
 * A map of events and arguments passed to their respective callbacks
 */
type SandboxEventMap = Record<string, unknown[]>;

/**
 * Extracts the event types from a `SandboxEventTarget`
 */
type ExtractEvents<E extends SandboxEventTarget<any>> = E extends SandboxEventTarget<infer F> ? F : never;

/**
 * A custom implementation of `EventTarget`
 * @template E A map of events and arguments passed to their respective callbacks
 */
class SandboxEventTarget<E extends SandboxEventMap> {
    /**
     * The amount of listeners on this target
     */
    #listenerCount = 0;
    /**
     * The amount of listeners on this target
     */
    get listenerCount() { return this.#listenerCount; }

    /**
     * An array containing each listener registered on this target
     */
    #listeners: Listener<E>[] = [];
    /**
     * An array containing each listener registered on this target
     */
    get listeners() { return this.#listeners; }

    /**
     * Appends an event listener to a specified channel
     * @template K The channel name
     * @param event The event type, or channel, to which this listener should be attached
     * @param callback A function that will be invoked with the event target as `this` when the event `event` is fired.
     * @returns This event target object
     */
    on<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"]) { // node.js style
        this.#listenerCount++;
        this.#listeners.push({ event: event, name: callback.name, callback: callback as any, once: false });
        return this;
    }
    /**
     * Appends a "once" listener to a specified channel; "once" listeners are only invoked once and subsequent events don't trigger it
     * @template K The channel name
     * @param event The event type, or channel, to which this listener should be attached
     * @param callback A function that will be invoked when the event is fired. Only the first invocation following this listener's registration
     * will be honored: the listener is dumped afterwards
     * @returns This event target object
     */
    once<K extends keyof E & string>(event: K, callback: Listener<E, K & keyof E & string>["callback"]) {
        this.#listenerCount++;
        this.#listeners.push({ event: event, name: callback.name, callback: callback as any, once: true });
        return this;
    }

    /**
     * Removes a given listener from a channel
     * @template K The channel name
     * @param event The event type, or channel, from which the specified listener should be removed
     * @param selector Either the name of a callback or the callback itself.
     *
     * If the name is passed, the last callback with the specified name is removed. Callbacks which are anonymous functions
     * can therefore be removed by passing the empty string.
     *
     * If a function is passed, the last callback which equals to the function (using `==`) is removed
     * @returns Whether or not a listener was removed
     */
    removeListener<K extends keyof E & string>(event: K, selector: string | Listener<E, K>["callback"]) {
        const index = this.#listeners.findLastIndex(
            listener => listener.event == event && (typeof selector == "string" ? listener.name == selector : listener.callback == selector)
        );

        if (index != -1) {
            this.#listeners.splice(index, 1);
            this.#listenerCount--;
        }

        return index != -1;
    }

    /**
     * Emulates the DOM-style of event listeners, but functions identically to `on` and `once`
     * @template K The channel name
     * @param event The channel to which this listener should be appended
     * @param callback The function to be invoked when the event is fired
     * @param options An object containing a single boolean field, `once`, which dictates whether the event listener should be cleared after
     * its first invocation. Defaults to `false`
     * @returns This event target object
     */
    addEventListener<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"], options: { once: boolean; } = { once: false }): this { // DOM style
        return this[options.once ? "once" : "on"](event, callback);
    }

    /**
     * Removes all listeners from a certain event type, or channel
     * @param event The channel to remove listeners from
     */
    removeListenersByType(event: keyof E) { this.#listenerCount = (this.#listeners = this.#listeners.filter(listener => listener.event != event)).length; }

    /**
     * Removes every single listener on this event target
     */
    removeAllListeners() { this.#listenerCount = (this.#listeners = []).length; }

    /**
     * Dispatches an event through a certain channel, triggering any listeners attached to it
     * @template K The channel name
     * @param event The channel name
     * @param args Arguments to pass to the callback function
     * @returns Whether the dispatched event was cancelled (by calling `event.preventDefault()`)
     */
    dispatchEvent<K extends keyof E & string>(event: K, ...args: E[K]) {
        if (this.#listenerCount) {
            const ev = new Event(event),
                name = ev.type,
                once = this.#listeners.filter(listener => listener.event == name && listener.once);

            /*
                Imagine some once listener `l`, attached to event `e`. If `l` fires the `e` event,
                we'd expect for `l` not to be called again, since it's a once listener

                If the filtration step occurs after the calling though, `l` will be re-called
                Thus, we do filtration first
            */
            this.#listeners = this.#listeners.filter(listener => listener.event != name || !listener.once);

            for (const listener of this.#listeners.concat(once))
                listener.event == name && listener.callback(ev, ...args);

            this.#listenerCount = this.#listeners.length;
            return ev.defaultPrevented;
        }

        return false;
    }
}

/**
 * A namespace containing various mathematical functions
 */
namespace srvsdbx_Math {
    /**
     * Returns the mean of a given set of values
     * @param values The values to take the mean of
     * @returns The mean of the given values
     */
    export function mean(values: number[]) {
        return values.reduce((acc, cur) => acc + cur, 0) / values.length;
    }

    /**
     * Calculates the [standard deviation](https://en.wikipedia.org/wiki/Standard_deviation) of a given set of values
     * @param values The values to take the standard deviation of
     * @returns The standard deviation of the given values
     */
    export function standardDeviation(values: number[]) {
        const average = mean(values);

        return Math.sqrt(mean(values.map(value => (value - average) ** 2)));
    }

    /**
     * Converts an angle measure to radians
     * @param angle The angle measure
     * @param unit The unit the provided measure is given in
     * @returns The equivalent angle in radians
     */
    export function toRad(angle: number, unit: "degrees" | "radians" | "turns") {
        switch (unit) {
            case "radians": return angle;
            case "degrees": return angle * Math.PI / 180;
            case "turns": return angle * Math.PI * 2;
        }
    }

    /**
     * Converts a time frame to milliseconds
     * @param time The time frame
     * @param unit The unit the provided measure is given in
     * @returns The equivalent time frame in milliseconds
     */
    export function toMS(time: number, unit: "s" | "ms" | "RPM") {
        switch (unit) {
            case "ms": return time;
            case "s": return time * 1000;
            case "RPM": return 60000 / time;
        }
    }

    /**
     * Returns the amount of decimal places in a number
     * @param n The number
     */
    export function getDecimalPlaces(n: number) {
        const str = n.toString();
        return +!!str.match(/\./) && str.length - (str.indexOf(".") + 1);
    }

    /**
     * Slices a number to a certain amount of decimal places
     * @param number The number to slice
     * @param decimalPlaces How many decimal places are desired
     * @returns The new number
     */
    export function sliceToDecimalPlaces(number: number, decimalPlaces: number) {
        return +number
            .toString()
            .split(".")
            .map((v, i) =>
                i
                    ? (() => {
                        const d = v.slice(0, decimalPlaces);
                        return v[decimalPlaces] == "9" ? `${d.slice(0, -1)}${+d.slice(-1) + 1}` : d;
                    })()
                    : v
            )
            .join(".");
    }

    /**
     * Performs a multiplication between two numbers, using truncation to attempt to mitigate the flaws of floating-point precision
     * @param a The first number
     * @param b The second number
     */
    export function sigFigIshMultiplication(a: number, b: number) {
        return sliceToDecimalPlaces(a * b, getDecimalPlaces(a) + getDecimalPlaces(b));
    }

    /**
     * Checks whether a value is within a numerical range, optionally including/excluding bounds. By default, both bounds are included.
     *
     * It is up to the caller to ensure that `lowerBound <= upperBound`.
     * @param value The value to be checked
     * @param lowerBound The lower bound
     * @param upperBound The upper bound
     * @param inclusion Information about which bounds to include
     * @param inclusion.lower Whether to include the lower bound
     * @param inclusion.upper Whether to include the upper bound
     * @returns Whether or not the value resides within the numerical range
     */
    export function checkBounds(value: number, lowerBound: number, upperBound: number, inclusion: { lower?: boolean, upper?: boolean; } = { lower: true, upper: true }): boolean {
        inclusion = { lower: inclusion?.lower ?? true, upper: inclusion?.upper ?? true };

        if (Number.isNaN(value) ||
            !Number.isFinite(value) ||
            (lowerBound == upperBound &&
                !(
                    inclusion!.lower! ||
                    inclusion!.upper!
                )
            ) ||
            lowerBound > upperBound
        ) return false;

        return (lowerBound == -Infinity && upperBound == Infinity) ||
            (lowerBound < value || (inclusion!.lower! && lowerBound == value))
            && (value < upperBound || (inclusion!.upper! && upperBound == value));
    }

    /**
     * Normalizes an angle to within a certain range, removing redundancy (ex: 540º => 180º, -3π / 2 => π / 2)
     * @param angle The angle to normalize
     * @param normalizeTo What unit the angle is given in, and thus, what unit it should be normalized to. Defaults to `radians`.
     * @returns The normalized angle
     */
    export function normalizeAngle(angle: number, normalizeTo: "degrees" | "radians" | "π" = "radians") {
        const fullTurn: number = {
            degrees: 360,
            radians: 2 * Math.PI,
            π: Math.PI
        }[normalizeTo];

        return angle - Math.floor(angle / fullTurn) * fullTurn;
    }

    /**
     * A method of generating a random number according to a mean and deviation from said mean
     * @param mean The middle value
     * @param deviation The farthest deviation from the specified mean
     * @param plusOrMinus Whether the deviation applies in both direction or only one
     * @returns A random number in the range…\
     * • `[mean - deviation, mean + deviation[` if `plusOrMinus` is `true`\
     * • `[mean, mean + deviation[` otherwise.
     */
    export function meanDevPM_random(mean: number, deviation: number, plusOrMinus: boolean) {
        if (!deviation) return mean;

        return mean + deviation * (plusOrMinus ? 2 * (Math.random() - 0.5) : Math.random());
    }

    /**
     * Generates a random number between two bounds
     * @param lower The lower bound
     * @param upper The upper bound
     * @returns A number in the range `[lower, upper[`
     */
    export function bounds_random(lower: number, upper: number) {
        return lower == upper
            ? lower
            : lower + Math.random() * (upper - lower);
    }

    /**
     * Generates a random angle in radians (in range `[0, 2π[`)
     */
    export function randomAngle() {
        return bounds_random(0, 2 * Math.PI);
    }

    /**
     * Retrieves the set of coefficients for the powers of `x` in the expression `(1 + x) ^ n` for some `n`\
     * [Reference](https://en.wikipedia.org/wiki/Binomial_coefficient)
     * @param order The exponent `n` in the above-mentioned definition.
     * @returns An array with the coefficients. The first coefficient corresponds to the largest power of `x`,
     * so `x ^ 3 + 3x ^ 2 + 3x + 1` would return `[1, 3, 3, 1]`
     * @throws {RangeError} If `order` is not a positive integer
     */
    export function getBinomialCoefficients(order: number): srvsdbx_ErrorHandling.Result<number[] | bigint[], RangeError> {
        if (order % 1 || order < 0) return { err: new RangeError(`'order' must be a positive integer; received ${order}.`) };

        const useBigInt = order >= 50;

        // Computing these kinda sucks, so the first ten results are pre-computed
        return {
            res: (() => {
                switch (order) {
                    case 0: return [1];
                    case 1: return [1, 1];
                    case 2: return [1, 2, 1];
                    case 3: return [1, 3, 3, 1];
                    case 4: return [1, 4, 6, 4, 1];
                    case 5: return [1, 5, 10, 10, 5, 1];
                    case 6: return [1, 6, 15, 20, 15, 6, 1];
                    case 7: return [1, 7, 21, 35, 35, 21, 7, 1];
                    case 8: return [1, 8, 28, 56, 70, 56, 28, 8, 1];
                    case 9: return [1, 9, 36, 84, 126, 126, 84, 36, 9, 1];
                    default: {
                        // Based on https://en.wikipedia.org/wiki/Binomial_coefficient#Multiplicative_formula
                        // But adjusted for 0-indexing
                        const array: number[] = [];

                        return new Array<number>(order + 1).fill(0).map(() => {
                            const coefficient = array.reduce<number | bigint>(
                                (acc, _, j) =>
                                    useBigInt
                                        ? BigInt(acc) * (BigInt(order) - BigInt(j)) / (BigInt(j) + 1n)
                                        : acc as number * (order - j) / (j + 1),
                                1
                            );

                            /*
                                To generate the kth coefficient, we need an array of length k, that is then reduced (as shown above)
                                In this context, k is the index of the `.map`'s current iteration
                                So instead of generating a new array every iteration, we mutate an external one
                                by augmenting its length every iteration, achieving the same thing
                                while being more efficient (at the cost of clarity)
                            */
                            array.push(0);

                            return coefficient;
                        }) as number[] | bigint[];
                    }
                }
            })()
        };
    }
}

// /**
//  * Returns a cosmetic decorator
//  *
//  * **Decorators aren't supported by any browser, and since these ones are purely cosmetic,
//  * having Typescript transpile them isn't worth it; for that reason, they've been commented until
//  * further notice**
//  */
// function generateCosmeticDecorator() {
//     //                                                                              cuz tsc kept whining
//     return function <T extends (...args: any[]) => unknown>(value: T, context: any/* ClassMethodDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext */) { };
// }

// /**
//  * A purely cosmetic decorator, indicating that a method may throw certain types of errors
//  * @param errors The types of errors this method may throw
//  */
// function Throws(...errors: ErrorConstructor[]) {
//     return generateCosmeticDecorator();
// }

/**
 * Cancels a timer if it is present. Works with `setInterval` and `setTimeout`.
 * @param timer The timer to be cleared
 */
function clearTimerIfPresent(timer: false | number) {
    timer !== false && clearInterval(timer);
}

/**
 * Represents a `Promise` whose state can be monitored
 * @template T The type of value this promise may return
 */
class WatchablePromise<T> {
    /**
     * The promise being watched
     */
    readonly #promise: Promise<T>;
    /**
     * The promise being watched
     */
    get promise() { return this.#promise; }

    /**
     * Whether or not the `Promise` has been fulfilled
     */
    #isFulfilled = false;
    /**
     * Whether or not the `Promise` has been fulfilled
     */
    get isFulfilled() { return this.#isFulfilled; }

    /**
     * Whether or not the `Promise` has been rejected
     */
    #isRejected = false;
    /**
     * Whether or not the `Promise` has been rejected
     */
    get isRejected() { return this.#isRejected; }

    /**
     * Whether or not the `Promise` has not been resolved
     */
    get isPending() { return !this.isResolved; }
    /**
     * Whether or not the `Promise` has been resolved
     */
    get isResolved() { return this.#isFulfilled || this.#isRejected; }

    /**
     * `* It's a constructor. It constructs.`
     * @param promise A `Promise` to watch
     */
    constructor(promise: Promise<T>) {
        this.#promise = promise;
        promise.then(v => (this.#isFulfilled = false, v), e => (this.#isRejected = false, e));
    }
}

/**
 * An object containing fields who are in turn objects is subject to taxing the GC
 * unnecessarily. By forcefully re-assigning those object fields to `undefined`, we
 * hope to encourage the GC to clean up those no-longer-needed objects.
 */
interface Destroyable {
    /**
     * Returns whether or not an object has been destroyed
     */
    get destroyed(): boolean;
    /**
     * A method that forcefully assigns `undefined` to any field containing an object
     */
    destroy(): void;
}

(() => {
    Math.cmp = (a, b) => {
        if (a == b) return 0;
        return a > b ? 1 : -1;
    };

    Math.clamp = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
    };

    /*
        Just adding short circuits, like sin(π) = 0
        Also adding sec, csc and cot
        source: https://en.wikipedia.org/wiki/Exact_trigonometric_values#Common_angles
        Not covered: any of the hyperbolic trig functions

        These would be cached, but testing shows that a cache hit is slower than a recalculation
        My guess is that these are directly linked to a C/C++ function by the runtime, meaning
        that it basically can't be beat by a user-defined function
        Even so, caching the lookup functions (which are already user-defined) worsened performance
        by about 100 times
        oh well…
        The lookups therefore serve to patch inaccuracies rather than increase speed
        More often than not, sin(π) won't equal 0, it'll be 1e-16
    */
    const π = Math.PI,
        nativeSin = Math.sin,
        nativeCos = Math.cos,
        nativeTan = Math.tan,
        nativeArcSin = Math.asin,
        nativeArcCos = Math.acos,
        nativeArcTan = Math.atan,
        sinLookup = {
            0: 0,
            [π / 12]: 0.25881904510252076,
            [π / 10]: 0.30901699437494742,
            [π / 8]: 0.3826834323650898,
            [π / 6]: 0.5,
            [π / 5]: 0.5877852522924731,
            [π / 4]: 0.7071067811865475,
            [3 * π / 10]: 0.8090169943749474,
            [π / 3]: 0.8660254037844386,
            [3 * π / 8]: 0.9238795325112868,
            [2 * π / 5]: 0.9510565162951536,
            [5 * π / 12]: 0.9659258262890683,
            [π / 2]: 1
        },
        cosLookup = {
            0: 1,
            [π / 12]: 0.9659258262890683,
            [π / 10]: 0.9510565162951536,
            [π / 8]: 0.9238795325112868,
            [π / 6]: 0.8660254037844386,
            [π / 5]: 0.8090169943749474,
            [π / 4]: 0.7071067811865475,
            [3 * π / 10]: 0.5877852522924731,
            [π / 3]: 0.5,
            [3 * π / 8]: 0.3826834323650898,
            [2 * π / 5]: 0.30901699437494742,
            [5 * π / 12]: 0.25881904510252076,
            [π / 2]: 0
        },
        tanLookup = {
            0: 0,
            [π / 12]: 0.2679491924311227,
            [π / 10]: 0.3249196962329063,
            [π / 8]: 0.4142135623730950,
            [π / 6]: 0.5773502691896258,
            [π / 5]: 0.7265425280053609,
            [π / 4]: 1,
            [3 * π / 10]: 1.3763819204711735,
            [π / 3]: 1.7320508075688773,
            [3 * π / 8]: 2.4142135623730950,
            [2 * π / 5]: 3.0776835371752534,
            [5 * π / 12]: 3.7320508075688773,
            [π / 2]: Infinity
        };

    Math.sin = (x: number) => {
        const ang = srvsdbx_Math.normalizeAngle(x, "radians"),
            a = srvsdbx_Math.normalizeAngle(x, "π"),
            sign = ang == a ? 1 : -1;
        return sign * (sinLookup[+a] ?? nativeSin.call(Math, +a));
    };

    Math.cos = (x: number) => {
        const ang = srvsdbx_Math.normalizeAngle(x, "radians"),
            a = srvsdbx_Math.normalizeAngle(x, "π"),
            angOverPI = ang / π,
            sign = 0.5 <= angOverPI && angOverPI <= 1.5 ? -1 : 1;
        return sign * (cosLookup[+a] ?? sign * nativeCos.call(Math, +ang));
    };

    Math.tan = (x: number) => {
        const ang = srvsdbx_Math.normalizeAngle(x, "π"),
            a = ang.toString().replace(/-/, ""),
            sign: 1 | -1 = !!ang.toString().match(/-/) ? -1 : 1;
        return sign * (tanLookup[+a] ?? nativeTan.call(Math, +a));
    };

    Math.sec = (x: number) => { return 1 / Math.cos(x); };
    Math.csc = (x: number) => { return 1 / Math.sin(x); };
    Math.cot = (x: number) => { return 1 / Math.tan(x); };

    Math.asin = (x: number) => {
        if (!srvsdbx_Math.checkBounds(x, -1, 1)) return NaN;

        const sign = Math.sign(x);
        x = Math.abs(x);

        for (const p in sinLookup) if (sinLookup[p] == x) return sign * +p;

        return sign * nativeArcSin.call(Math, x);
    };

    Math.acos = (x: number) => {
        if (!srvsdbx_Math.checkBounds(x, -1, 1)) return NaN;

        const sign = Math.sign(x);
        x = Math.abs(x);

        for (const p in cosLookup) if (cosLookup[p] == x) return sign == -1 ? π - +p : +p;

        const nac = nativeArcCos.call(Math, x);

        return sign == -1 ? π - nac : nac;
    };

    Math.atan = (x: number) => {
        const sign = Math.sign(x);
        x = Math.abs(x);

        for (const p in tanLookup) if (tanLookup[p] == x) return sign * +p;

        return sign * nativeArcTan.call(Math, x);
    };

    Math.asec = (x: number) => { return x == 1 ? 0 : x == -1 ? π : Math.acos(1 / x); };
    Math.acsc = (x: number) => { return x == 1 ? π / 2 : x == -1 ? -π / 2 : Math.asin(1 / x); };
    Math.acot = (x: number) => { return x == Infinity ? 0 : x == -Infinity ? π : π as number / 2 - Math.atan(x); };
})();