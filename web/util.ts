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
     */
    findLast<S extends T>(predicate: (value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
}

/**
 * Allows type safety in export.js files by removing the `namespace` and `includePath` fields normally required by the `SimpleImport` interface
 *
 * These fields are provided by the import script, and it's less error-prone that way
 */
type ExportInterface<I extends SimpleImport> = Omit<I, Exclude<keyof SimpleImport, "name" | "displayName" | "targetVersion">>;

/**
 * When specifying the dimensions of an object, the sandbox always allows the special string "auto"
 */
type Dimension = number | "auto";

/**
 * Converts a tuple type—such as `[1, 5, "s"]`—into a union of its members—`1 | 5 | "s"`
 */
type TupleToUnion<T extends readonly any[]> = T extends readonly [infer U, ...infer V] ? V extends [infer W] ? U | W : U | TupleToUnion<V> : never;

/**
 * Extracts the key type from a Map type
 */
type MapKey<T> = T extends Map<infer K, any> ? K : never;

/**
 * Extracts the value type from a Map type
 */
type MapValue<T> = T extends Map<any, infer V> ? V : never;

/**
 * Extracts the key type from an object type
 */
type ObjectKey<T extends object> = keyof T;

/**
 * Extracts the value type from an object type
*/
type ObjectValue<T extends object> = T[keyof T];
// type ObjectValue<T extends object> = T extends { [K in keyof T]: infer V } ? V : never;

/**
 * An extension of the `Partial` type provided natively by Typescript that recursively renders fields optional
 */
type DeepPartial<T extends object> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * An extension of the `Required` type provided natively by Typescript that recursively renders fields required
 */
type DeepRequired<T extends object> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

/**
 * A simple function for generating unique, sequential IDs
 */
const generateId = (() => {
    let i = 0;

    return () => i++;
})();

/**
 * A namespace containing types and functions related to a Rust-inspired error handling system
 */
namespace srvsdbx_ErrorHandling {
    /**
     * Represents the explicit absence of a value
     */
    export const Nothing = null;

    /**
     * Represents the explicit absence of a value
     */
    export type Nothing = typeof Nothing;

    /**
     * Represents a value that might exist
     */
    export type Maybe<T> = T | Nothing;
    /**
     * Represents a successful operation
     */
    export type ResultRes<T> = { res: T; };
    /**
     * Represents a failed operation
     */
    export type ResultErr<E> = { err: E; };
    /**
     * Represents a result whose state is unknown
     */
    export type Result<T, E> = ResultRes<T> | ResultErr<E>;

    /**
     * Utility function for handling success and failure
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
     * @param x The value to return
     * @returns The inputted value
     */
    export function identity<T>(x: T) { return x; }

    /**
     * A wrapper for a common `handleResult` call, with the result as the first argument, `identity` as the second and `yeet` as the third.
     *
     * If the result is a `ResultRes`, said result is returned. Otherwise, the result is a `ResultErr`, and said error is thrown.
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
     * @param e The expression to be thrown
     */
    export function yeet<E>(e: E): never {
        throw e;
    }
}

/**
 * Represents a value wrapped in a function that returns it
 */
type FunctionWrapper<T, U extends any[] = []> = (...args: U) => T;

/**
 * Represents a value that might be "as-is" or wrapped in a function
 */
type MayBeFunctionWrapped<T, U extends any[] = []> = T | FunctionWrapper<T, U>;

/**
 * Extracts the wrapped value from a `MayBeFunctionWrapped` type
 */
type ExtractWrapped<T> = T extends MayBeFunctionWrapped<infer U, any> ? U : never;

/**
 * Extracts the arguments from a `MayBeFunctionWrapped` type's function form
 */
type ExtractArgs<T> = T extends MayBeFunctionWrapped<any, infer U> ? U : never;

/**
 * Extracts a value that may either be a "plain" value or one wrapped in a function
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
 * Symbolically represents a pointer to a game object. Practically speaking, a `string`.
 */
type PrototypeReference<T extends keyof Gamespace["prototypes"]> = MapKey<Gamespace["prototypes"][T]>;

/**
 * Represents an event handler function for `Element.addEventListener`
 */
type SimpleListener<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap> = (this: HTMLElementTagNameMap[T], ev: HTMLElementEventMap[K]) => void;

/**
 * Represents a more complex listener where options—such as `passive` and `once`—have been specified.
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
            )
                element[key][objKey] = objVal;

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
     */
    export type AssetSrcPair<T> = {
        /**
         * The path at which this asset lies
         */
        src: string,
        /**
         * The asset
         */
        asset: T;
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
            return new Promise<R>(
                (res, rej) => {
                    operation.call(/* p5 magic (aka getting p5 to not crash) */{ _decrementPreload() { } }, args, res, rej);
                }
            );
        }

        function toAsync<R>(original: (path: string, success: (args: R) => any, failure: (error: unknown) => any) => R) {
            return async function(path: string): Promise<srvsdbx_ErrorHandling.Result<AssetSrcPair<R>, unknown>> {
                try {
                    return {
                        res: {
                            src: path,
                            asset: await promisify(original, path)
                        }
                    };
                } catch (e) {
                    return { err: e };
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

        return array;
    }

    /**
     * Converts any properties named `image` to `ImageSrcPair`s and any properties named `images` to `ImageSrcPair[]`s
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
                const l = this.length,
                    k = v / l;

                if (l) {
                    this.#x *= k;
                    this.#y *= k;
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
                const l = this.length;

                this.#x = l * Math.cos(v);
                this.#y = l * Math.sin(v);
            }
        }

        /**
         * Simply returns a new zero vector
         * @returns A new zero vector
         */
        static zeroVec() { return new Vector2D(0, 0); }

        /**
         * Returns the origin
         * @returns The origin, (0, 0)
         */
        static zeroPt() { return { x: 0, y: 0 } as Point2D; }

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

            const cart = this.toCartesian(point),
                polar = this.toPolar(point);

            return {
                x: cart.x,
                y: cart.y,
                magnitude: polar.magnitude,
                direction: polar.direction
            } as T extends Vector2D ? Vector2D : Hydrated2DPoint;
        }

        /**
         * Translates a `Vector3D` to a `Vector2D` by simply removing its `z` component
         * @param vec The vector to convert
         */
        static fromVector3D(vec: Vector3D) {
            return new Vector2D(vec.x, vec.y);
        }

        /**
         * Translates a `Vector2D` to a `Vector3D` by setting its `z` component to 0
         * @param vec The vector to convert
         */
        static toVector3D(vec: Vector2D) {
            return new Vector3D(vec.x, vec.y, 0);
        }

        /**
         * Converts from polar coordinates to a `Point2D`
         * @param angle The angle of the point relative to the x-axis
         * @param magnitude The distance of the point from the origin
         */
        static fromPolarToPt(angle: number, magnitude: number) {
            return { x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle) } as Point2D;
        }

        /**
         * Converts from polar coordinates to a `Vector2D`
         * @param angle The angle of the point relative to the x-axis
         * @param magnitude The distance of the point from the origin
         */
        static fromPolarToVec(angle: number, magnitude: number) {
            const vec = new Vector2D(magnitude * Math.cos(angle), magnitude * Math.sin(angle));

            vec.squaredLength != magnitude * magnitude && vec.squaredLength && (vec.length = Math.abs(magnitude));

            return vec;
        }

        /**
         * Gets the squared distance between a point and the origin
         * @param pt The point to be measured
         * @returns The squared distance
         */
        static squaredDist(pt: Point2D) {
            return pt.x * pt.x + pt.y * pt.y;
        }

        /**
         * Returns the distance between a point and the origin
         * @param pt The point to be measured
         * @returns The distance
         */
        static dist(pt: Point2D) {
            return Math.sqrt(this.squaredDist(pt));
        }

        /**
         * Gets the squared distance between two points
         * @param ptA The first point
         * @param ptB The second point
         * @returns The squared distance between the two points
         */
        static squaredDistBetweenPts(ptA: Point2D, ptB: Point2D) {
            const dx = ptA.x - ptB.x,
                dy = ptA.y - ptB.y;

            return dx * dx + dy * dy;
        }

        /**
         * Returns the distance between two points
         * @param ptA The first point
         * @param ptB The second point
         * @returns The distance between the two points
         */
        static distBetweenPts(ptA: Point2D, ptB: Point2D) {
            return Math.sqrt(this.squaredDistBetweenPts(ptA, ptB));
        }

        /**
         * Returns a new point whose distance from the origin is 1, and whose direction is the same as the original
         * @param pt The point to take the direction from
         * @returns A point whose distance from the origin is 1, and whose direction is the same as the original point
         */
        static unit(pt: Point2D) {
            const l = this.dist(pt),
                vec = new Vector2D(pt.x / l, pt.y / l);

            (vec.squaredLength != 1 && vec.squaredLength) && (vec.length = 1); // Just to be sure

            return vec.toPoint2D();
        }

        /**
         * Returns whether or not two points have the same components
         * @param ptA The first point to compare
         * @param ptB The second point to compare
         * @returns Whether or not the two points have the same components
         */
        static equals(ptA: Point2D, ptB: Point2D) {
            return ptA.x == ptB.x && ptA.y == ptB.y;
        }

        /**
         * Adds the components of two points together, either modifying the first one or returning a new point.
         * @param ptA The first point to add. If `mutate` is set to `true`, this point's components will be changed.
         * @param ptB The second point. Will never change.
         * @param mutate Whether or not the result should overwrite `ptA` or if it should be returned as a new point.
         * @returns Either a completely new point, or `ptA` if `mutate` was set to `true`.
         */
        static plus(ptA: Point2D, ptB: Point2D, mutate?: boolean) {
            if (mutate) {
                ptA.x += ptB.x;
                ptA.y += ptB.y;
                return ptA;
            }

            return this.hydrate({ x: ptA.x + ptB.x, y: ptA.y + ptB.y });
        }

        /**
         * Subtracts the components of the second point from the first one, either modifying the first one or returning a new point.
         * @param ptA The first point to be subtracted from. If `mutate` is set to `true`, this point's components will be changed.
         * @param ptB The second point. Will never change.
         * @param mutate Whether or not the result should overwrite `ptA` or if it should be returned as a new point.
         * @returns Either a completely new point, or `ptA` if `mutate` was set to `true`.
         */
        static minus(ptA: Point2D, ptB: Point2D, mutate?: boolean) {
            if (mutate) {
                ptA.x -= ptB.x;
                ptA.y -= ptB.y;
                return ptA;
            }

            return this.hydrate({ x: ptA.x - ptB.x, y: ptA.y - ptB.y });
        }

        /**
         * Creates a clone of a Point2D or Vector2D object
         * @param pt The point to clone
         */
        static clone<T extends Point2D | Vector2D>(pt: T) {
            return pt instanceof Vector2D ? pt.clone() as T : { x: pt.x, y: pt.y };
        }

        /**
         * Multiplies the given point's components by a scalar, either modifying the original point or returning a new one
         * @param pt The point to be scaled
         * @param scale The scale factor
         * @param mutate Whether the original point should be modified or if the result should be returned in a new point
         * @returns The result of scaling the input point's components by the scalar
         */
        static scale(pt: Point2D, scale: number, mutate?: boolean) {
            return mutate ? (pt.x *= scale, pt.y = scale, pt) : this.hydrate({ x: scale * pt.x, y: scale * pt.y });
        }

        /**
         * Multiplies the given point's components by -1, either modifying the original point or returning a new one
         * @param pt The point to be scaled
         * @param mutate Whether the original point should be modified or if the result should be returned in a new point
         * @returns The result of scaling the input point's components by the scalar
         */
        static invert(pt: Point2D, mutate?: boolean) {
            return mutate ? (pt.x *= -1, pt.y = -1, pt) : this.hydrate({ x: -pt.x, y: -pt.y });
        }

        /**
         * Treats the two points as vectors and performs a dot product on them
         * @param ptA The first point
         * @param ptB The second point
         * @returns The result of performing the dot product on the points treated as vectors
         */
        static dotProduct(ptA: Point2D, ptB: Point2D) {
            return ptA.x * ptB.x + ptA.y * ptB.y;
        }

        /**
         * Treats the two points as vectors and returns the angle between them
         * @param ptA The first point
         * @param ptB The second point
         * @returns The angle between the two points, treated as vectors
         */
        static angleBetween(ptA: Point2D, ptB: Point2D) {
            return Math.acos(this.dotProduct(ptA, ptB) / Math.sqrt(this.squaredDist(ptA) * this.squaredDist(ptB)));
        }

        /**
         * Treats the two points as vectors and returns the vector projection of the first onto the second.
         * @param ptA The point, whose vector representation will be the vector to be projected
         * @param ptB The point, whose vector representation will be projected on
         * @returns The result of projecting the first vector onto the second
         */
        static projection(ptA: Point2D, ptB: Point2D) {
            return this.hydrate(this.scale(ptB, this.dotProduct(ptA, ptB) / this.squaredDist(ptB)));
        }

        /**
         * Creates a new Vector2D object from a point. Copies the point's components
         * @param pt The point to be converted
         * @returns The newly-created vector
         */
        static fromPoint2D(pt: Point2D) {
            return new Vector2D(pt.x, pt.y);
        }

        /**
         * Linearly interpolates between two points
         * @param ptA The first point (start)
         * @param ptB The second point (end)
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new point containing the result's operation\
         * `t = 0` is guaranteed to return a clone of `ptA`; `t = 1` is guaranteed to return a clone of `ptB`.
         */
        static lerp(ptA: Point2D, ptB: Point2D, t: number) {
            let res: Point2D;

            switch (t) {
                case 0: res = Vector2D.clone(ptA);
                case 1: res = Vector2D.clone(ptB);
                default: res = this.plus(ptA, this.scale(this.minus(ptB, ptA), t));
            }

            return this.hydrate(res);
        }

        /**
         * Checks the point and returns whether either component is `NaN`
         * @param pt The point to check
         */
        static hasNaN(pt: Point2D) {
            return Number.isNaN(pt.x) || Number.isNaN(pt.y);
        }

        /**
         * Casts either a `Vector2D` or a `Point2D` to a `Point2D`
         * @param pt The object to be casted. If a `Point2D` is passed, it is not cloned, and the original is returned
         */
        static toPoint2D(pt: Point2D | Vector2D) {
            return pt instanceof Vector2D ? pt.toPoint2D() : pt;
        }

        /**
         * Converts a representation of a 2D point into one using Cartesian
         * coordinates
         * @param point The point to convert. If a `Point2D` is passed in, it
         * is returned as-is
         */
        static toCartesian(point: Point2D | Polar2D) {
            return "x" in point ? point : this.fromPolarToPt(point.direction, point.magnitude);
        }

        /**
         * Converts a representation of a 2D point into one using polar
         * coordinates
         * @param point The point to convert. If a `Polar2D` is passed in, it
         * is returned as-is
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
         * @param pt The point to which to measure
         * @returns The squared distance between the two points
         */
        squaredDistToPt(pt: Point2D) {
            const dx = this.#x - pt.x,
                dy = this.#y - pt.y;

            return dx * dx + dy * dy;
        }

        /**
         * Treating this vector as a point, returns the distance between this point and another
         * @param pt The point to which to measure
         * @returns The distance between the two points
         */
        distToPt(pt: Point2D) {
            return Math.sqrt(this.squaredDistToPt(pt));
        }

        /**
         * Returns a new vector whose direction is identical to this one's, but whose magnitude is 1
         */
        unit() {
            const l = this.length,
                vec = new Vector2D(this.#x / l, this.#y / l);

            (vec.squaredLength != 1 && vec.squaredLength) && (vec.length = 1); // Just to be sure

            return vec;
        }

        /**
         * Compares two vectors, returning whether or not they're equal
         * @param vec The vector to be compared to
         */
        equals(vec: Point2D) {
            return this.#x == vec.x && this.#y == vec.y;
        }

        /**
         * Adds a vector to this one, either mutating this one or returning a new vector that's the result of the operation.
         * @param vec The vector to add. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        plus(vec: Point2D | Polar2D, mutate?: boolean) {
            vec = Vector2D.toCartesian(vec);

            if (mutate) {
                this.#x += vec.x;
                this.#y += vec.y;
                return this;
            }

            return new Vector2D(this.#x + vec.x, this.#y + vec.y);
        }

        /**
         * Subtracts a vector from this vector, either mutating this one or returning a new vector that's the result of the operation.
         * @param vec The vector to subtract from this one. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        minus(vec: Point2D | Polar2D, mutate?: boolean) {
            vec = Vector2D.toCartesian(vec);

            if (mutate) {
                this.#x -= vec.x;
                this.#y -= vec.y;
                return this;
            }

            return new Vector2D(this.#x - vec.x, this.#y - vec.y);
        }

        /**
         * Returns a new vector whose components are identical to this one
         */
        clone() {
            return new Vector2D(this.#x, this.#y);
        }

        /**
         * Multiplies this vector by a scalar, either modifying this vector or returning a new vector with the result
         * @param scale The factor to scale this vector by
         * @param mutate Whether or not to mutate this vector or return a new one
         */
        scale(scale: number, mutate?: boolean) {
            return mutate ? (this.length *= scale, this) : new Vector2D(this.#x * scale, this.#y * scale);
        }

        /**
         * Multiplies this vector by -1, either modifying this vector or returning a new vector with the result
         * @param mutate Whether or not to mutate this vector or return a new one
         */
        invert(mutate?: boolean) {
            return mutate ? (this.length *= -1, this) : new Vector2D(-this.#x, -this.#y);
        }

        /**
         * Performs the dot product between this vector and another. Can be used to test perpendicularity: if
         * the dot product is zero, then the two vectors are perpendicular
         * @param vec The vector to perform the dot product with
         */
        dotProduct(vec: Point2D | Polar2D) {
            vec = Vector2D.toCartesian(vec);

            return this.#x * vec.x + this.#y * vec.y;
        }

        /**
         * Returns the angle between this vector and another
         * @param vec The other vector to compare to
         */
        angleBetween(vec: Vector2D) {
            return Math.acos(this.dotProduct(vec) / Math.sqrt(this.squaredLength * vec.squaredLength));
        }

        /**
         * Projects this vector onto another, returning the projected vector
         * @param vec The vector to be projected on
         */
        projection(vec: Vector2D) {
            return vec.scale(this.dotProduct(vec) / vec.squaredLength);
        }

        /**
         * Linearly interpolates between this vector and another
         * @param vec The vector to interpolate with
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new vector containing the result of the operation\
         * `t = 0` is guaranteed to return a copy of `this`; `t = 1` is guaranteed to return a `Vector2D` whose components are `vec`'s.
         */
        lerp(vec: Point2D, t: number) {
            switch (t) {
                case 0: return this.clone();
                case 1: return Vector2D.fromPoint2D(vec);
                default: return this.plus(this.minus(vec).scale(-t));
            }
        }

        /**
         * Checks the point and returns whether either component is `NaN`
         */
        hasNaN() {
            return Number.isNaN(this.#x) || Number.isNaN(this.#y);
        }

        /**
         * Returns a lightweight representation of this object
         */
        toPoint2D() {
            return { x: this.#x, y: this.#y } as Point2D;
        }

        /**
         * Returns a lightweight 3D representation of this object
         */
        toPoint3D() {
            return { x: this.#x, y: this.#y, z: 0 } as Point3D;
        }

        /**
         * Returns a 3D vector identical to this one (with a z component of 0)
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
            if (!Number.isNaN(v)) {
                this.#x = v;
            }
        }
        /**
         * This vector's y component
         */
        #y: number;/**
     * This vector's y component
     */
        get y() { return this.#y; }
        set y(v: number) {
            if (!Number.isNaN(v)) {
                this.#y = v;
            }
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
            if (!Number.isNaN(v)) {
                this.#z = v;
            }
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
                const l = this.length,
                    k = v / l;

                if (l) {
                    this.#x *= k;
                    this.#y *= k;
                    this.#z *= k;
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
            const l = this.length;

            return {
                x: Math.acos(this.#x / l),
                y: Math.acos(this.#y / l),
                z: Math.acos(this.#z / l)
            };
        }
        set direction(v: [number, number, number] | { x: number, y: number, z: number; }) {
            const dir = Array.isArray(v) ? { x: v[0], y: v[1], z: v[2] } : v,
                l = this.length;

            this.x = l * Math.cos(dir.x);
            this.y = l * Math.cos(dir.y);
            this.z = l * Math.cos(dir.z);
        }

        /**
         * Returns a new zero vector
         * @returns A new zero vector
         */
        static zeroVec() { return new Vector3D(0, 0, 0); }

        /**
         * Returns the origin
         * @returns The origin, (0, 0, 0)
         */
        static zeroPt() { return { x: 0, y: 0, z: 0 } as Point3D; }

        /**
         * Translates a `Vector2D` to a `Vector3D` by simply removing its `z` component
         * @param vec The vector to convert
         */
        static fromVector2D(vec: Vector2D) {
            return new Vector3D(vec.x, vec.y, 9);
        }

        /**
         * Translates a `Vector3D` to a `Vector2D` by setting its `z` component to 0
         * @param vec The vector to convert
         */
        static toVector2D(vec: Vector3D) {
            return new Vector2D(vec.x, vec.y);
        }

        /**
         * Gets the squared distance between a point and the origin
         * @param pt The point to be measured
         * @returns The square of the distance between the point and th origin
         */
        static squaredDist(pt: Point3D) {
            return pt.x * pt.x + pt.y * pt.y + pt.z * pt.z;
        }

        /**
         * Gets the distance between a point and the origin
         * @param pt The point to be measured
         * @returns The of the distance between the point and th origin
         */
        static dist(pt: Point3D) {
            return Math.sqrt(this.squaredDist(pt));
        }

        /**
         * Gets the squared distance between two points
         * @param ptA The first point
         * @param ptB The second point
         * @returns The squared distance between the two points
         */
        static squaredDistBetweenPts(ptA: Point3D, ptB: Point3D) {
            const dx = ptA.x - ptB.x,
                dy = ptA.y - ptB.y,
                dz = ptA.z - ptB.z;

            return dx * dx + dy * dy + dz * dz;
        }

        /**
         * Returns the distance between two points
         * @param ptA The first point
         * @param ptB The second point
         * @returns The distance between the two points
         */
        static distBetweenPts(ptA: Point3D, ptB: Point3D) {
            return Math.sqrt(this.squaredDistBetweenPts(ptA, ptB));
        }

        /**
         * Returns a point whose direction is the same as the original, but whose distance from the origin is 1
         * @param pt The point
         * @returns A new point colinear with the origin and the original, 1 unit away from the origin
         */
        static unit(pt: Point3D) {
            const l = this.dist(pt),
                vec = new Vector3D(pt.x / l, pt.y / l, pt.z / l);

            (vec.squaredLength != 1 && vec.squaredLength) && (vec.length = 1);

            return vec.toPoint3D();
        }

        /**
         * Returns whether or not two points have the same components
         * @param ptA The first point to compare
         * @param ptB The second point to compare
         * @returns Whether or not all of the two points' components match
         */
        static equals(ptA: Vector3D, ptB: Vector3D) {
            return ptA.x == ptB.x && ptA.y == ptB.y && ptA.z == ptB.z;
        }

        /**
         * Adds the components of two points together, either modifying the first point or returning a new point
         * @param ptA The first point. If `mutate` is set to `true`, it will be modified
         * @param ptB The second point. Wll never be modified
         * @param mutate Whether the result should be stored in `ptA` or returned as a new point
         * @returns If `mutate` is `false`, a new point with the result is returned; otherwise, `ptA` is mutated accordingly and returned.
         */
        static plus(ptA: Point3D, ptB: Point3D, mutate?: boolean) {
            if (mutate) {
                ptA.x += ptB.x;
                ptA.y += ptB.y;
                ptA.z += ptB.z;
                return ptA;
            }

            return { x: ptA.x + ptB.x, y: ptA.y + ptB.y, z: ptA.z + ptB.z } as Point3D;
        }

        /**
         * Subtracts the components of the second point from the first, either modifying the first point or returning a new point
         * @param ptA The first point. If `mutate` is set to `true`, it will be modified
         * @param ptB The second point. Wll never be modified
         * @param mutate Whether the result should be stored in `ptA` or returned as a new point
         * @returns If `mutate` is `false`, a new point with the result is returned; otherwise, `ptA` is mutated accordingly and returned.
         */
        static minus(ptA: Point3D, ptB: Point3D, mutate?: boolean) {
            if (mutate) {
                ptA.x += ptB.x;
                ptA.y += ptB.y;
                ptA.z += ptB.z;
                return ptA;
            }

            return { x: ptA.x + ptB.x, y: ptA.y + ptB.y, z: ptA.z + ptB.z } as Point3D;
        }

        /**
         * Clones a point and returns the clone
         * @param pt The point to be cloned
         * @returns The cloned point
         */
        static clone<T extends Point3D | Vector3D>(pt: T) {
            return pt instanceof Vector3D ? pt.clone() as T : { x: pt.x, y: pt.y, z: pt.z };
        }

        /**
         * Scales a point's components by a scalar, either mutating the original or returning a new point
         * @param pt The point to be scaled
         * @param scale The scale factor
         * @param mutate Whether to modify the original point to store the result or to create a new one to store the result
         */
        static scale(pt: Point3D, scale: number, mutate?: boolean) {
            return mutate ? (pt.x *= scale, pt.y *= scale, pt.z *= scale, pt) : { x: pt.x * scale, y: pt.y * scale, z: pt.z * scale } as Point3D;
        }

        /**
         * Scales a point's components by -1, either mutating the original or returning a new point
         * @param pt The point to be scaled
         * @param scale The scale factor
         * @param mutate Whether to modify the original point to store the result or to create a new one to store the result
         */
        static invert(pt: Point3D, mutate?: boolean) {
            return mutate ? (pt.x *= -1, pt.y *= -1, pt.z *= -1, pt) : { x: -pt.x, y: -pt.y, z: -pt.z } as Point3D;
        }

        /**
         * Treats the two points as vectors and performs the dot product between them
         * @param ptA The first point
         * @param ptB The second point
         * @returns The result of performing the dot product between the two points, interpreted as vectors
         */
        static dotProduct(ptA: Point3D, ptB: Point3D) {
            return ptA.x * ptB.x + ptA.y * ptB.y + ptA.z * ptB.z;
        }

        /**
         * Treats the two points as vectors and gets the angle between the two
         * @param ptA The first point
         * @param ptB The second point
         * @returns The angle between the two points, treated as vectors
         */
        static angleTo(ptA: Point3D, ptB: Point3D) {
            return Math.acos(this.dotProduct(ptA, ptB) / Math.sqrt(this.squaredDist(ptA) * this.squaredDist(ptB)));
        }

        /**
         * Treats the two points as vectors and projects the first onto the second
         * @param ptA The first point
         * @param ptB The second point
         * @returns The result of projecting the first vector onto the second
         */
        static projection(ptA: Point3D, ptB: Point3D) {
            return this.scale(ptA, this.dotProduct(ptA, ptB) / this.dist(ptB));
        }

        /**
         * Treats the two points as vectors and performs the cross product between them
         * @param ptA The first point
         * @param ptB The second point
         * @returns The result of performing the cross product between the two points, interpreted as vectors
         */
        static crossProduct(ptA: Point3D, ptB: Point3D) {
            return { x: ptA.y * ptB.z - ptA.z * ptB.y, y: ptA.z * ptB.x - ptA.x * ptB.z, z: ptA.x * ptB.y - ptA.y * ptB.x } as Point3D;
        }

        /**
         * Treats all three points as vectors, and returns the dot product of the first with the cross product of the second.
         * @link https://en.wikipedia.org/wiki/Triple_product
         * @param ptA The first point
         * @param ptB The second point
         * @param ptC The third point
         * @returns The result of the triple product: if it isn't 0, the three vectors are linearly dependant, and the numerical value is the volume of the parallepiped delimited by the three vectors
         */
        static tripleProduct(ptA: Point3D, ptB: Point3D, ptC: Point3D) {
            return this.dotProduct(ptA, this.crossProduct(ptB, ptC));
        }

        /**
         * Creates a new Vector3D object from a point. Copies the point's components
         * @param pt The point to be converted
         * @returns The newly-created vector
         */
        static fromPoint3D(pt: Point3D) {
            return new Vector3D(pt.x, pt.y, pt.z);
        }

        /**
         * Linearly interpolates between two points
         * @param ptA The first point (start)
         * @param ptB The second point (end)
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new point containing the result's operation\
        * t = 0` is guaranteed to return a clone of `ptA`; `t = 1` is guaranteed to return a clone of `ptB`.
         */
        static lerp(ptA: Point3D, ptB: Point3D, t: number) {
            switch (t) {
                case 0: return Vector3D.clone(ptA);
                case 1: return Vector3D.clone(ptB);
                default: return this.plus(ptA, this.scale(this.minus(ptB, ptA), t));
            }
        }

        /**
         * Checks the point and returns whether any component is `NaN`
         * @param pt The point to check
         */
        static hasNaN(pt: Point3D) {
            return Number.isNaN(pt.x) || Number.isNaN(pt.y) || Number.isNaN(pt.z);
        }

        /**
         * Casts either a Vector3D or a Point3D to a Point3D
         * @param pt The object to be casted. If a Point3D is passed, it is not cloned, and the original is returned
         */
        static toPoint3D(pt: Point3D | Vector3D) {
            return pt instanceof Vector3D ? pt.toPoint3D() : pt;
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
         * @param pt The point to which to measure
         * @returns The squared distance between the two points
         */
        squaredDistToPt(pt: Point3D) {
            const dx = this.#x - pt.x,
                dy = this.#y - pt.y,
                dz = this.#z - pt.z;

            return dx * dx + dy * dy + dz * dz;
        }

        /**
         * Treating this vector as a point, returns the distance between this point and another
         * @param pt The point to which to measure
         * @returns The distance between the two points
         */
        distToPt(pt: Point3D) {
            return Math.sqrt(this.squaredDistToPt(pt));
        }

        /**
         * Returns the unit vector associated with this vector
         */
        unit() {
            const l = this.length,
                vec = new Vector3D(this.#x / l, this.#y / l, this.#z / l);

            (vec.squaredLength != 1 && vec.squaredLength) && (vec.length = 1);

            return vec;
        }

        /**
         * Determine if two vectors have equal components
         * @param vec The vector to compare to
         * @returns Whether or not the two vectors have the same components
         */
        equals(vec: Point3D) {
            return this.#x == vec.x && this.#y == vec.y;
        }

        /**
         * Adds a vector to this one, either mutating this one or returning a new vector that's the result of the operation.
         * @param vec The vector to add. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        plus(vec: Point3D, mutate?: boolean) {
            if (mutate) {
                this.#x += vec.x;
                this.#y += vec.y;
                this.#z += vec.z;
                return this;
            }

            return new Vector3D(this.#x + vec.x, this.#y + vec.y, this.#z + vec.z);
        }

        /**
         * Subtracts a vector from this vector, either mutating this one or returning a new vector that's the result of the operation.
         * @param vec The vector to subtract from this one. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        minus(vec: Point3D, mutate?: boolean) {
            if (mutate) {
                this.#x -= vec.x;
                this.#y -= vec.y;
                this.#z -= vec.z;
                return this;
            }

            return new Vector3D(this.#x - vec.x, this.#y - vec.y, this.#z - vec.z);
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
            return mutate ? (this.length *= scale, this) : new Vector3D(scale * this.#x, scale * this.#y, scale * this.#z);
        }

        /**
         * Multiplies this vector by -1, either modifying this vector or returning a new vector with the result
         * @param mutate Whether or not to mutate this vector or return a new one
         */
        invert(mutate?: boolean) {
            return mutate ? (this.length *= -1, this) : new Vector3D(-this.#x, -this.#y, -this.#z);
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
        angleTo(vec: Vector3D) {
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
            return new Vector3D(this.#y * vec.z - this.#z * vec.y, this.#z * vec.x - this.#x * vec.z, this.#x * vec.y - this.#y * vec.x);
        }

        /**
         * Performs the [triple product](https://en.wikipedia.org/wiki/Triple_product) with this vector as the first one
         * @param vecA The second vector of the triple product
         * @param vecB The third vector of the triple product
         * @returns The result of the triple product: if it isn't 0, the three vectors are linearly dependant, and the numerical value is the volume of the parallepiped delimited by the three vectors
         */
        tripleProduct(vecA: Vector3D, vecB: Vector3D) {
            return this.dotProduct(vecA.crossProduct(vecB));
        }

        /**
         * Linearly interpolates between this vector and another
         * @param vec The vector to interpolate with
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new vector containing the result of the operation\
         * `t = 0` is guaranteed to return a copy of `this`; `t = 1` is guaranteed to return a copy of `vec`.
         */
        lerp(vec: Point3D, t: number) {
            switch (t) {
                case 0: return this.clone();
                case 1: return Vector3D.fromPoint3D(vec);
                default: return this.plus(this.minus(vec).scale(-t));
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
        segmentCircle(segment: LineSegment, circle: { origin: Point2D, radius: number; }): srvsdbx_ErrorHandling.Maybe<readonly [Point2D] | readonly [Point2D, Point2D]> {
            // Based on https://www.desmos.com/calculator/r9w38kskse
            const slope = (segment.end.y - segment.start.y) / (segment.end.x - segment.start.x);

            switch (slope) {
                case Infinity:
                case -Infinity: { // Vertical line
                    const dx = segment.start.x - circle.origin.x,
                        discrim = circle.radius * circle.radius - dx * dx;

                    switch (Math.sign(discrim)) {
                        case -1: return srvsdbx_ErrorHandling.Nothing;
                        case 0: return [{ x: segment.start.x, y: circle.origin.y }] as const;
                        case 1: {
                            const root = Math.sqrt(discrim);

                            return [
                                { x: segment.start.x, y: circle.origin.y + root },
                                { x: segment.start.x, y: circle.origin.y - root },
                            ] as const;
                        }
                    }
                }
                case 0: { // Horizontal line
                    const dy = segment.start.y - circle.origin.y,
                        discrim = circle.radius * circle.radius - dy * dy;

                    switch (Math.sign(discrim)) {
                        case -1: return srvsdbx_ErrorHandling.Nothing;
                        case 0: return [{ x: circle.origin.x, y: segment.start.y }] as const;
                        case 1: {
                            const root = Math.sqrt(discrim);

                            return [
                                { x: circle.origin.x + root, y: segment.start.y },
                                { x: circle.origin.x - root, y: segment.start.y },
                            ] as const;
                        }
                    }
                }
                default: { // Any other line
                    const dx = segment.start.x - circle.origin.x,
                        dy = segment.start.y - circle.origin.y,
                        squareSlopeP1 = slope * slope + 1,
                        subDis = slope * dx - dy,
                        discrim = squareSlopeP1 * circle.radius * circle.radius - subDis * subDis,
                        sign = Math.sign(discrim);

                    switch (sign) {
                        case -1: return srvsdbx_ErrorHandling.Nothing;
                        case 0:
                        case 1: {
                            const b = segment.start.y - slope * segment.start.x,
                                numer = (circle.origin.x - slope * (b - circle.origin.y)),
                                x = numer / squareSlopeP1,
                                f = (x: number) => slope * x + b;

                            if (sign == 0) return [{ x: x, y: f(x) }] as const;

                            const root = Math.sqrt(discrim),
                                x1 = (numer + root) / squareSlopeP1,
                                x2 = (numer - root) / squareSlopeP1;

                            return [
                                { x: x1, y: f(x1) },
                                { x: x2, y: f(x2) }
                            ] as const;
                        }
                    }
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
                    case sx == ex: ln = { slope: Infinity, intercept: sx };
                    case sy == ey: ln = { slope: 0, intercept: sy };
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

                    return srvsdbx_Math.checkBounds(
                        y,
                        Math.min(vertical.start.y, vertical.end.y),
                        Math.max(vertical.start.y, vertical.end.y)
                    )
                        ? { x: vertical.intercept, y: y }
                        : srvsdbx_ErrorHandling.Nothing;
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
                    return srvsdbx_Math.checkBounds(x, minA, maxA)
                        && srvsdbx_Math.checkBounds(x, minB, maxB)
                        ? point
                        : srvsdbx_ErrorHandling.Nothing;
                }
            }
        },
        /**
         * Returns all intersection points between a line segment and a polygon, along with the edge that each point is on
         * @param segment The line segment
         * @param polygonVertices The polygon, represented as an array of vertices.
         * No check as to whether this set of vertices really forms a polygon is done.
         */
        segmentPolygon(segment: LineSegment, polygonVertices: Point2D[]) {
            // Garbage
            return polygonVertices
                .map((pt, i, arr) => ({ start: pt, end: arr[(i + 1) % arr.length] } as LineSegment))                           // Convert each pair into an edge
                .map(ln => [this.segmentSegment(segment, ln), ln] as const)                                                    // Run detection on those edges
                .filter<[Point2D, LineSegment]>((pt): pt is [Point2D, LineSegment] => pt[0] != srvsdbx_ErrorHandling.Nothing); // Filter out the misses
        }
    };
}

/**
 * For a given function, creates a new function whose results will be cached, along with the arguments that created them; this allows for subsequent calls to be instant.
 *
 * For the cache to be sensible and work, a function must be [*pure*](https://en.wikipedia.org/wiki/Pure_function):
 * that is to say, for a given input, it must always return the same output, and must neither rely on nor modify any external objects.
 *
 * It is generally useful caching expensive functions that are called often, and therefore have an increased likelihood of being called with the same arguments. For example,
 * the trigonometric functions are quite slow, and very commonly used—it's therefore a good idea to cache them (and to add lookup tables). Inversely, something like `floor`
 * is not very taxing, and isn't very likely to be called with the same arguments multiple times.
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
    diagnostics: {
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
        doDiag = !!config.diagnostics;

    let hits = 0,
        misses = 0;

    const entries = [...cache.entries()],
        func = function(...args: P) {
            const cacheEntry = entries.find(([key]) => equalityFunction(key, args));
            if (cacheEntry) return (doDiag && ++hits), cacheEntry[1];

            (doDiag && ++misses);
            const result = fn(...args);
            cache.set(args, result);
            entries.push([args, result]);

            return result;
        } as ReturnType<typeof cachify<P, R, B>>;

    if (doDiag) {
        (func as ReturnType<typeof cachify<P, R, true>>).diagnostics = {
            get calls() { return hits + misses; },
            get cacheSize() { return cache.size; },
            get cacheHits() { return hits; },
            get cacheMisses() { return misses; },
            get cacheHitRate() { return hits / this.calls; },
        };
    }

    return func;
}

/**
 * Takes a class as an argument and returns a version of that class that can only be instantiated once
 * @param cls The class to make a singleton of
 * @returns The [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) object
 */
function createSingleton<T extends new (...args: any[]) => object>(cls: T) {
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
 * Represents an event listener
 */
interface Listener<E extends SandboxEventMap, K extends keyof E & string = keyof E & string> {
    /**
     * The event type this listener is attached to
     */
    event: any,
    /**
     * The function to be invoked when the event is fired
     * @param event The event dispatched
     * @param args Any additional argument
     */
    callback: (event: E[K]["event"], ...args: E[K]["args"]) => void,
    /**
     * The listener's name
     */
    name: string,
    /**
     * Whether the listener should only be run once and then removed
     */
    once?: boolean;
};

/**
 * A map of events and arguments passed to their respective callbacks
 */
type SandboxEventMap = Record<string, { event: Event, args: unknown[]; }>;

/**
 * A custom implementation of EventTarget
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
     * @param event The event type, or channel, to which this listener should be attached
     * @param callback A function that will be invoked with the event target as `this` when the event `event` is fired.
     * @returns This event target object
     */
    on<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"]) { // node.js style
        this.#listenerCount++;
        this.#listeners.push({ event: event, name: callback.name, callback: callback, once: false });
        return this;
    }
    /**
     * Appends a "once" listener to a specified channel; "once" listeners are only invoked once and subsequent events don't trigger it
     * @param event The event type, or channel, to which this listener should be attached
     * @param callback A function that will be invoked when the event is fired. Only the first invocation following this listener's registration will be honored: the listener is dumped afterwards
     * @returns This event target object
     */
    once<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"]) {
        this.#listenerCount++;
        this.#listeners.push({ event: event, name: callback.name, callback: callback, once: true });
        return this;
    }

    /**
     * Removes a given listener from a channel
     * @param event The event type, or channel, from which the specified listener should be removed
     * @param selector Either the name of a callback or the callback itself.
     *
     * If the name is passed, the last callback with the specified name is removed. Callbacks which are anonymous functions can therefore be removed by passing the empty string.
     *
     * If a function is passed, the last callback to be equal to the function is removed
     * @returns Whether or not a listener was removed
     */
    removeListener<K extends keyof E & string>(event: K, selector: string | Listener<E, K>["callback"]) {
        const index = this.#listeners.findLastIndex(
            l => l.event == event && (typeof selector == "string" ? l.name == selector : l.callback == selector)
        );

        // If multiple callbacks have the same name, the one added last is removed (hence the .reverse())
        if (index != -1) {
            this.#listeners.splice(index, 1);
            this.#listenerCount--;
        }

        return index != -1;
    }

    /**
     * Emulates the DOM-style of event listeners, but functions identically to `on` and `once`
     * @param event The channel to which this listener should be appended
     * @param callback The function to be invoked when the event is fired
     * @param options An object containing a single boolean field, `once`, which dictates whether the event listener should be cleared after its first invocation. Defaults to false
     * @returns This event target object
     */
    addEventListener<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"], options: { once: boolean; } = { once: false }): this { // DOM style
        return this[options.once ? "once" : "on"](event, callback);
    }

    /**
     * Removes all listeners from a certain event type, or channel
     * @param event The channel to remove listeners from
     */
    removeListenersByType(event: keyof E) { this.#listenerCount = (this.#listeners = this.#listeners.filter(l => l.event != event)).length; }

    /**
     * Removes every single listener on this event target
     */
    removeAllListeners() { this.#listenerCount = (this.#listeners = []).length; }

    /**
     * Dispatches an event through a certain channel, triggering any listeners attached to it
     * @param event The channel name
     * @param args Arguments to pass to the callback function
     * @returns Whether the dispatched event was cancelled (by calling `event.preventDefault()`)
     */
    dispatchEvent<K extends keyof E & string>(event: K | E[K]["event"], ...args: E[K]["args"]) {
        if (this.#listenerCount) {
            const ev = event instanceof Event ? event : new Event(event.toString()),
                name = ev.type;

            for (let i = 0, length = this.#listeners.length; i < length; i++) {
                const l = this.#listeners[i];

                l.event == name && l.callback.call(void 0, ev, ...args);
            }

            this.#listeners = this.#listeners.filter(l => l.event != name || !l.once);

            this.#listenerCount = this.#listeners.length;
            return ev.defaultPrevented;
        }

        return false;
    }
}

/**
 * An event representing a collision between two game objects
 */
class CollisionEvent extends Event {
    /**
     * The matter.js `Collision` object containing information about the collision
     */
    readonly #collisionData: Matter.Collision;
    /**
     * The matter.js `Collision` object containing information about the collision
     */
    get collisionData() { return this.#collisionData; }

    readonly #intersectionPoints: srvsdbx_Geometry.Point2D[];
    get intersectionPoints() { return this.#intersectionPoints; }

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(data: Matter.Collision, intersectionsPoints: srvsdbx_Geometry.Point2D[] = []) {
        super("collision");

        this.#collisionData = data;
        this.#intersectionPoints = intersectionsPoints;
    }
}

/**
 * A namespace containing various mathematical functions
 */
namespace srvsdbx_Math {
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
    export function getDecimalPlaces(n: number | Decimal) {
        if (n instanceof Decimal) { return n.decimalPlaces(); }
        const str = n.toString();
        return +!!str.match(/\./) && str.length - (str.indexOf(".") + 1);
    }

    /**
     * Slices a number to a certain amount of decimal places
     * @param number The number to slice
     * @param decimalPlaces How many decimal places are desired
     * @returns The new number
     */
    export function sliceToDecimalPlaces(number: number | Decimal, decimalPlaces: number) {
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
    export function sigFigIshMult(a: number, b: number) {
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
    };

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
        return lower + Math.random() * (upper - lower);
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
     * @returns An array with the coefficients. The first coefficient corresponds to the largest power of `x`, so `x ^ 3 + 3x ^ 2 + 3x + 1` would return `[1, 3, 3, 1]`\
     */
    export function getBinomialCoefficients(order: number): srvsdbx_ErrorHandling.Result<number[] | bigint[], RangeError> {
        if (order % 0 || order < 0) return { err: new RangeError(`'order' must be a positive integer; received ${order}.`) };

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
                            const coeff = array.reduce<number | bigint>(
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

                            return coeff;
                        }) as number[] | bigint[];
                    }
                }
            })()
        };
    }
}

/**
 * Returns a cosmetic decorator
 *
 * **Decorators aren't supported by any browser, and since these ones are purely cosmetic,
 * having Typescript transpile them isn't worth it; for that reason, they've been commented until
 * further notice**
 */
function generateCosmeticDecorator() {
    return function <T extends (...args: any[]) => unknown>(value: T, context: ClassMethodDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext) { };
}

/**
 * A purely cosmetic decorator, indicating that a method may throw certain types of errors
 * @param errors The types of errors this method may throw
 */
function Throws(...errors: ErrorConstructor[]) {
    return generateCosmeticDecorator();
}

/**
 * Extracts the key type from an EventMap type
 */
type EventMapKey<T> = T extends EventMap<infer K, any> ? K : never;

/**
 * Extracts the value type from an EventMap type
 */
type EventMapValue<T> = T extends EventMap<any, infer V> ? V : never;

/**
 * A class that allows one to listen to the operations performed on a map
 */
const EventMap = (() => {
    /**
     * A purely cosmetic decorator, meant to convey that a method can be cancelled
     */
    const Cancellable = generateCosmeticDecorator();

    return class EventMap<K, V> extends SandboxEventTarget<
        {
            get: {
                event: Event,
                args: [K];
            },
            set: {
                event: Event,
                args: [K, V];
            },
            delete: {
                event: Event,
                args: [K, V | undefined];
            },
            clear: {
                event: Event,
                args: [];
            };
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
         * Directly calls the internal map's `entries`
         */
        entries() {
            return this.#internal.entries();
        }

        /**
         * Directly calls the internal map's `keys`
         */
        keys() {
            return this.#internal.keys();
        }

        /**
         * Directly calls the internal map's `values`
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
     * @throws {TypeError} If the map is empty and no default value was specified
     */
    //! @Throws(TypeError)
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

        try {
            this.#performReduction();
        } catch (_) {
            // If the map is empty and has no default value, we'll nevertheless let it slide
            // It's quite uncommon for a map to be populated on creation, and perhaps the user
            // knows that when the map will be reduced, it's guaranteed to be populated
        }
    }

    /**
     * Performs the actual reduction operation
     *
     * @throws {TypeError} If the map is empty and no default value has been specified
     */
    //! @Throws(TypeError)
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
                throw new TypeError("Reduction on an empty map with no default value");
            }
        }
    }

    /**
     * Clears the internal map
     */
    clear() {
        this.#internal.clear();

        // See the comment in .delete
        try {
            this.#performReduction();
        } catch (_) { }
    }

    delete(key: K) {
        const b = this.#internal.delete(key);

        /*
            It's okay for the reduction to fail here

            Pretty much the only time the reduction's failure isn't okay
            is when the value is fetched for use; here, we're just trying
            to be ahead of the curve by adjusting it in advance, but
            if that doesn't work, then we can defer that
            calculation to later.
        */
        try {
            this.#performReduction();
        } catch (_) { }

        return b;
    }

    /**
     * Adds a new element with a specified key and value to the Map.
     * If an element with the same key already exists, the element will be updated.
     * @param key The key to insert the element at
     * @param value The value to insert at the specified key
     * @returns This `ReducibleMap` instance
     * @throws {TypeError} If the map is empty and no default value has been specified
     */
    //! @Throws(TypeError)
    set(key: K, value: V) {
        this.#internal.set(key, value);

        this.#performReduction();
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
 * Cancels a timer if it is present. Works with `setInterval` and `setTimeout`.
 * @param timer The timer to be cleared
 */
function clearTimerIfPresent(timer: false | number) {
    timer !== false && clearInterval(timer);
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