/// <reference types="p5" />
interface Math {
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
declare const generateId: () => number;
/**
 * A namespace containing types and functions related to a Rust-inspired error handling system
 */
declare namespace srvsdbx_ErrorHandling {
    /**
     * Represents the explicit absence of a value
     */
    const Nothing: null;
    /**
     * Represents the explicit absence of a value
     */
    type Nothing = typeof Nothing;
    /**
     * Represents a value that might exist
     */
    type Maybe<T> = T | Nothing;
    /**
     * Represents a successful operation
     */
    type ResultRes<T> = {
        res: T;
    };
    /**
     * Represents a failed operation
     */
    type ResultErr<E> = {
        err: E;
    };
    /**
     * Represents a result whose state is unknown
     */
    type Result<T, E> = ResultRes<T> | ResultErr<E>;
    /**
     * Utility function for handling success and failure
     * @param val The value to evaluate
     * @param success A callback to be invoked if `val` is a `ResultRes` (no error)
     * @param error A callback to be invoked if `val` is a `ResultErr` (an error occurred)
     * @returns The result of whichever callback ends up being invoked
     */
    function handleResult<T = never, E = never, Sr = unknown, Fr = unknown>(val: Result<T, E>, success: (value: T) => Sr, error: (error: E) => Fr): ([T] extends [never] ? never : Sr) | ([E] extends [never] ? never : Fr);
    /**
     * Generates a new empty result
     */
    function emptyResult(): ResultRes<undefined>;
    /**
     * A function that returns its value. Useful for passing `ResultRes` values out of `handleResult`
     * @param x The value to return
     * @returns The inputted value
     */
    function identity<T>(x: T): T;
    /**
     * A wrapper for a common `handleResult` call, with the result as the first argument, `identity` as the second and `yeet` as the third.
     *
     * If the result is a `ResultRes`, said result is returned. Otherwise, the result is a `ResultErr`, and said error is thrown.
     * @param val The expression to evaluate
     * @returns The result of whichever callback ends up being invoked
     */
    function passAlongOrThrow<T, E>(val: Result<T, E>): ([T] extends [never] ? never : T) | ([E] extends [never] ? never : never);
    /**
     * Throws an expression [with force](https://areweyeetyet.rs)
     * @param e The expression to be thrown
     */
    function yeet<E>(e: E): never;
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
declare function extractValue<T, U extends any[] = []>(val: MayBeFunctionWrapped<T, U>, ...args: U): T;
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
declare function makeElement<K extends keyof HTMLElementTagNameMap>(key: K, properties?: DeepPartial<HTMLElementTagNameMap[K]>, children?: string | Node | (string | Node)[], listeners?: {
    [key in keyof HTMLElementEventMap]?: SimpleListener<K, key> | OptionsListener<K, key> | (SimpleListener<K, key> | OptionsListener<K, key>)[];
}): HTMLElementTagNameMap[K];
/**
 * A namespace containing types and functions to manage assets and work with p5's corresponding classes
 */
declare namespace srvsdbx_AssetManagement {
    /**
     * A utility types used to keep assets and their paths together
     */
    type AssetSrcPair<T> = {
        /**
         * The path at which this asset lies
         */
        src: string;
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
    type ImageSrcPair = AssetSrcPair<import("p5").Image>;
    /**
     * A type that encapsulates a p5 Font and the address it came from
     *
     * Useful for interop with native CSS styling
     */
    type FontSrcPair = AssetSrcPair<import("p5").Font>;
    /**
     * A collection of functions for loading assets into p5 objects
     */
    const loadingFunctions: {
        /**
         * Attempts to construct a p5 `Image` object from a given path
         * @param path The path of the asset
         * @returns Either the created asset, or whatever error prevented its creation
         */
        loadImageAsync: (path: string) => Promise<srvsdbx_ErrorHandling.Result<AssetSrcPair<import("p5").Image>, unknown>>;
        /**
         * Attempts to construct a p5 `Font` object from a given path
         * @param path The path of the asset
         * @returns Either the created asset, or whatever error prevented its creation
         */
        loadFontAsync: (path: string) => Promise<srvsdbx_ErrorHandling.Result<AssetSrcPair<any>, unknown>>;
    };
    /**
     * Loads an array of images
     * @param paths An array containing the paths to the images
     * @param errors An array to which any errors will be pushed
     * @param prefix A string to prefix any paths with
     * @returns An array of images and `null`, where `null` is used for any images that failed to load
     */
    function loadImageArray(paths: string[], errors: unknown[], prefix?: string): Promise<srvsdbx_ErrorHandling.Maybe<AssetSrcPair<import("p5").Image>>[]>;
    /**
     * Converts any properties named `image` to `ImageSrcPair`s and any properties named `images` to `ImageSrcPair[]`s
     */
    type ConvertPathsToImages<O extends object> = {
        [K in keyof O]: K extends "image" ? ImageSrcPair : K extends "images" ? O[K] extends string[] ? ImageSrcPair[] : O[K] : O[K] extends object ? ConvertPathsToImages<O[K]> : O[K] extends object | undefined ? ConvertPathsToImages<O[K] & {}> | undefined : O[K];
    };
    /**
     * Determines appropriate dimensions, given an image and a set of dimensions
     * @param image The image to size
     * @param dimensions A set of desired dimensions
     */
    function determineImageDimensions(image: ImageSrcPair["asset"], dimensions: {
        width: Dimension;
        height: Dimension;
    }): {
        width: number;
        height: number;
    };
}
/**
 * Picks a random element out of an array passed to it
 * @param array The array tp pick out of
 * @returns A random element
 */
declare function pickRandomInArray<T>(array: T[]): T;
/**
 * A namespace encompassing a variety of geometrical objects and functions pertaining to the field
 */
declare namespace srvsdbx_Geometry {
    /**
     * A light-weight representation of a point in 2D space
     */
    interface Point2D {
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
    interface Polar2D {
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
    interface Hydrated2DPoint extends Point2D, Polar2D {
    }
    /**
     * A light-weight representation of a point in 3D space
    */
    interface Point3D extends Point2D {
        /**
         * This point's z component
         */
        z: number;
    }
    /**
     * An extension of the `Point2D` interface that adds methods to treat the points as vectors and operate on them accordingly
     */
    class Vector2D implements Point2D {
        #private;
        /**
         * This vector's x component
         *
         * - `get`: Retrieves this vector's x component
         * - `set`: Sets this vector's x component to the provided value if it is not `NaN`
         */
        get x(): number;
        set x(v: number);
        /**
         * This vector's y component
         *
         * - `get`: Retrieves this vector's y component
         * - `set`: Sets this vector's y component to the provided value if it is not `NaN`
         */
        get y(): number;
        set y(v: number);
        /**
         * The length (or magnitude) of this vector, squared.
         */
        get squaredLength(): number;
        /**
         * The length (or magnitude) of this vector.
         *
         * - `get`: Calculates the length (or magnitude) of this vector. For repeated use, it might be worth storing this in a variable to avoid running the getter's code repeatedly
         * - `set`: Scales the vector's components so that its length matches the new length
         */
        get length(): number;
        set length(v: number);
        /**
         *  The direction of this vector with relation to the x-axis.
         *
         * - `get`: Returns the direction of this vector with relation to the x-axis. For repeated use, it might be worth storing this in a variable to avoid running the getter's code repeatedly
         * - `set`: Modifies this vector's components so that its direction matches
         */
        get direction(): number;
        set direction(v: number);
        /**
         * Simply returns a new zero vector
         * @returns A new zero vector
         */
        static zeroVec(): Vector2D;
        /**
         * Returns the origin
         * @returns The origin, (0, 0)
         */
        static zeroPt(): Point2D;
        /**
         * Given a `Point2D`, creates a new point with additional polar coordinate info
         * @param point The point to augment
         * @returns If the point is a `Vector2D`, a clone of that vector; otherwise, a new object with
         * the original's `x` and `y` components, along with the corresponding polar representation
         */
        static hydrate<T extends Point2D | Polar2D>(point: T): T extends Vector2D ? Vector2D : Hydrated2DPoint;
        /**
         * Translates a `Vector3D` to a `Vector2D` by simply removing its `z` component
         * @param vec The vector to convert
         */
        static fromVector3D(vec: Vector3D): Vector2D;
        /**
         * Translates a `Vector2D` to a `Vector3D` by setting its `z` component to 0
         * @param vec The vector to convert
         */
        static toVector3D(vec: Vector2D): Vector3D;
        /**
         * Converts from polar coordinates to a `Point2D`
         * @param angle The angle of the point relative to the x-axis
         * @param magnitude The distance of the point from the origin
         */
        static fromPolarToPt(angle: number, magnitude: number): Point2D;
        /**
         * Converts from polar coordinates to a `Vector2D`
         * @param angle The angle of the point relative to the x-axis
         * @param magnitude The distance of the point from the origin
         */
        static fromPolarToVec(angle: number, magnitude: number): Vector2D;
        /**
         * Gets the squared distance between a point and the origin
         * @param pt The point to be measured
         * @returns The squared distance
         */
        static squaredDist(pt: Point2D): number;
        /**
         * Returns the distance between a point and the origin
         * @param pt The point to be measured
         * @returns The distance
         */
        static dist(pt: Point2D): number;
        /**
         * Gets the squared distance between two points
         * @param ptA The first point
         * @param ptB The second point
         * @returns The squared distance between the two points
         */
        static squaredDistBetweenPts(ptA: Point2D, ptB: Point2D): number;
        /**
         * Returns the distance between two points
         * @param ptA The first point
         * @param ptB The second point
         * @returns The distance between the two points
         */
        static distBetweenPts(ptA: Point2D, ptB: Point2D): number;
        /**
         * Returns a new point whose distance from the origin is 1, and whose direction is the same as the original
         * @param pt The point to take the direction from
         * @returns A point whose distance from the origin is 1, and whose direction is the same as the original point
         */
        static unit(pt: Point2D): Point2D;
        /**
         * Returns whether or not two points have the same components
         * @param ptA The first point to compare
         * @param ptB The second point to compare
         * @returns Whether or not the two points have the same components
         */
        static equals(ptA: Point2D, ptB: Point2D): boolean;
        /**
         * Adds the components of two points together, either modifying the first one or returning a new point.
         * @param ptA The first point to add. If `mutate` is set to `true`, this point's components will be changed.
         * @param ptB The second point. Will never change.
         * @param mutate Whether or not the result should overwrite `ptA` or if it should be returned as a new point.
         * @returns Either a completely new point, or `ptA` if `mutate` was set to `true`.
         */
        static plus(ptA: Point2D, ptB: Point2D, mutate?: boolean): Point2D;
        /**
         * Subtracts the components of the second point from the first one, either modifying the first one or returning a new point.
         * @param ptA The first point to be subtracted from. If `mutate` is set to `true`, this point's components will be changed.
         * @param ptB The second point. Will never change.
         * @param mutate Whether or not the result should overwrite `ptA` or if it should be returned as a new point.
         * @returns Either a completely new point, or `ptA` if `mutate` was set to `true`.
         */
        static minus(ptA: Point2D, ptB: Point2D, mutate?: boolean): Point2D;
        /**
         * Creates a clone of a Point2D or Vector2D object
         * @param pt The point to clone
         */
        static clone<T extends Point2D | Vector2D>(pt: T): T | {
            x: number;
            y: number;
        };
        /**
         * Multiplies the given point's components by a scalar, either modifying the original point or returning a new one
         * @param pt The point to be scaled
         * @param scale The scale factor
         * @param mutate Whether the original point should be modified or if the result should be returned in a new point
         * @returns The result of scaling the input point's components by the scalar
         */
        static scale(pt: Point2D, scale: number, mutate?: boolean): Point2D;
        /**
         * Multiplies the given point's components by -1, either modifying the original point or returning a new one
         * @param pt The point to be scaled
         * @param mutate Whether the original point should be modified or if the result should be returned in a new point
         * @returns The result of scaling the input point's components by the scalar
         */
        static invert(pt: Point2D, mutate?: boolean): Point2D;
        /**
         * Treats the two points as vectors and performs a dot product on them
         * @param ptA The first point
         * @param ptB The second point
         * @returns The result of performing the dot product on the points treated as vectors
         */
        static dotProduct(ptA: Point2D, ptB: Point2D): number;
        /**
         * Treats the two points as vectors and returns the angle between them
         * @param ptA The first point
         * @param ptB The second point
         * @returns The angle between the two points, treated as vectors
         */
        static angleBetween(ptA: Point2D, ptB: Point2D): number;
        /**
         * Treats the two points as vectors and returns the vector projection of the first onto the second.
         * @param ptA The point, whose vector representation will be the vector to be projected
         * @param ptB The point, whose vector representation will be projected on
         * @returns The result of projecting the first vector onto the second
         */
        static projection(ptA: Point2D, ptB: Point2D): Hydrated2DPoint;
        /**
         * Creates a new Vector2D object from a point. Copies the point's components
         * @param pt The point to be converted
         * @returns The newly-created vector
         */
        static fromPoint2D(pt: Point2D): Vector2D;
        /**
         * Linearly interpolates between two points
         * @param ptA The first point (start)
         * @param ptB The second point (end)
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new point containing the result's operation\
         * `t = 0` is guaranteed to return a clone of `ptA`; `t = 1` is guaranteed to return a clone of `ptB`.
         */
        static lerp(ptA: Point2D, ptB: Point2D, t: number): Hydrated2DPoint;
        /**
         * Checks the point and returns whether either component is `NaN`
         * @param pt The point to check
         */
        static hasNaN(pt: Point2D): boolean;
        /**
         * Casts either a `Vector2D` or a `Point2D` to a `Point2D`
         * @param pt The object to be casted. If a `Point2D` is passed, it is not cloned, and the original is returned
         */
        static toPoint2D(pt: Point2D | Vector2D): Point2D;
        /**
         * Converts a representation of a 2D point into one using Cartesian
         * coordinates
         * @param point The point to convert. If a `Point2D` is passed in, it
         * is returned as-is
         */
        static toCartesian(point: Point2D | Polar2D): Point2D;
        /**
         * Converts a representation of a 2D point into one using polar
         * coordinates
         * @param point The point to convert. If a `Polar2D` is passed in, it
         * is returned as-is
         */
        static toPolar(point: Point2D | Polar2D): Polar2D;
        /**
         * `* It's a constructor. It constructs.`
         *
        * If `NaN` is passed in, it is replaced by 0
         * @param x The x component of the vector
         * @param y The y component of the vector
         */
        constructor(x: number, y: number);
        /**
         * Treating this vector as a point, gets the squared distance between this point and another
         * @param pt The point to which to measure
         * @returns The squared distance between the two points
         */
        squaredDistToPt(pt: Point2D): number;
        /**
         * Treating this vector as a point, returns the distance between this point and another
         * @param pt The point to which to measure
         * @returns The distance between the two points
         */
        distToPt(pt: Point2D): number;
        /**
         * Returns a new vector whose direction is identical to this one's, but whose magnitude is 1
         */
        unit(): Vector2D;
        /**
         * Compares two vectors, returning whether or not they're equal
         * @param vec The vector to be compared to
         */
        equals(vec: Point2D): boolean;
        /**
         * Adds a vector to this one, either mutating this one or returning a new vector that's the result of the operation.
         * @param vec The vector to add. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        plus(vec: Point2D | Polar2D, mutate?: boolean): Vector2D;
        /**
         * Subtracts a vector from this vector, either mutating this one or returning a new vector that's the result of the operation.
         * @param vec The vector to subtract from this one. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        minus(vec: Point2D | Polar2D, mutate?: boolean): Vector2D;
        /**
         * Returns a new vector whose components are identical to this one
         */
        clone(): Vector2D;
        /**
         * Multiplies this vector by a scalar, either modifying this vector or returning a new vector with the result
         * @param scale The factor to scale this vector by
         * @param mutate Whether or not to mutate this vector or return a new one
         */
        scale(scale: number, mutate?: boolean): Vector2D;
        /**
         * Multiplies this vector by -1, either modifying this vector or returning a new vector with the result
         * @param mutate Whether or not to mutate this vector or return a new one
         */
        invert(mutate?: boolean): Vector2D;
        /**
         * Performs the dot product between this vector and another. Can be used to test perpendicularity: if
         * the dot product is zero, then the two vectors are perpendicular
         * @param vec The vector to perform the dot product with
         */
        dotProduct(vec: Point2D | Polar2D): number;
        /**
         * Returns the angle between this vector and another
         * @param vec The other vector to compare to
         */
        angleBetween(vec: Vector2D): number;
        /**
         * Projects this vector onto another, returning the projected vector
         * @param vec The vector to be projected on
         */
        projection(vec: Vector2D): Vector2D;
        /**
         * Linearly interpolates between this vector and another
         * @param vec The vector to interpolate with
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new vector containing the result of the operation\
         * `t = 0` is guaranteed to return a copy of `this`; `t = 1` is guaranteed to return a `Vector2D` whose components are `vec`'s.
         */
        lerp(vec: Point2D, t: number): Vector2D;
        /**
         * Checks the point and returns whether either component is `NaN`
         */
        hasNaN(): boolean;
        /**
         * Returns a lightweight representation of this object
         */
        toPoint2D(): Point2D;
        /**
         * Returns a lightweight 3D representation of this object
         */
        toPoint3D(): Point3D;
        /**
         * Returns a 3D vector identical to this one (with a z component of 0)
         */
        toVector3D(): Vector3D;
        /**
         * Returns a string representation of this vector
         */
        toString(): string;
        /**
         * Returns a polar coordinate representation of this vector
         */
        toPolar(): Polar2D;
    }
    /**
     * An extension of the `Point3D` interface that defines methods to operate on 3D vectors
     */
    class Vector3D implements Point3D {
        #private;
        /**
         * This vector's x component
         */
        get x(): number;
        set x(v: number);
        get y(): number;
        set y(v: number);
        /**
         * This vector's z component
         */
        get z(): number;
        set z(v: number);
        /**
         * The length (or magnitude) of this vector, squared.
         */
        get squaredLength(): number;
        /**
         * `get`: The length (or magnitude) of this vector.
         *
         * `set`: Scales this vector's components so that its length matches the new length
         */
        get length(): number;
        set length(v: number);
        /**
         * `get`: Returns this vector's [direction cosines](https://en.wikipedia.org/wiki/Direction_cosine#Cartesian_coordinates)
         *
         * `set`: Modifies this vector's components to match the given [direction cosines](https://en.wikipedia.org/wiki/Direction_cosine#Cartesian_coordinates)
         */
        get direction(): {
            x: number;
            y: number;
            z: number;
        };
        set direction(v: [number, number, number] | {
            x: number;
            y: number;
            z: number;
        });
        /**
         * Returns a new zero vector
         * @returns A new zero vector
         */
        static zeroVec(): Vector3D;
        /**
         * Returns the origin
         * @returns The origin, (0, 0, 0)
         */
        static zeroPt(): Point3D;
        /**
         * Translates a `Vector2D` to a `Vector3D` by simply removing its `z` component
         * @param vec The vector to convert
         */
        static fromVector2D(vec: Vector2D): Vector3D;
        /**
         * Translates a `Vector3D` to a `Vector2D` by setting its `z` component to 0
         * @param vec The vector to convert
         */
        static toVector2D(vec: Vector3D): Vector2D;
        /**
         * Gets the squared distance between a point and the origin
         * @param pt The point to be measured
         * @returns The square of the distance between the point and th origin
         */
        static squaredDist(pt: Point3D): number;
        /**
         * Gets the distance between a point and the origin
         * @param pt The point to be measured
         * @returns The of the distance between the point and th origin
         */
        static dist(pt: Point3D): number;
        /**
         * Gets the squared distance between two points
         * @param ptA The first point
         * @param ptB The second point
         * @returns The squared distance between the two points
         */
        static squaredDistBetweenPts(ptA: Point3D, ptB: Point3D): number;
        /**
         * Returns the distance between two points
         * @param ptA The first point
         * @param ptB The second point
         * @returns The distance between the two points
         */
        static distBetweenPts(ptA: Point3D, ptB: Point3D): number;
        /**
         * Returns a point whose direction is the same as the original, but whose distance from the origin is 1
         * @param pt The point
         * @returns A new point colinear with the origin and the original, 1 unit away from the origin
         */
        static unit(pt: Point3D): Point3D;
        /**
         * Returns whether or not two points have the same components
         * @param ptA The first point to compare
         * @param ptB The second point to compare
         * @returns Whether or not all of the two points' components match
         */
        static equals(ptA: Vector3D, ptB: Vector3D): boolean;
        /**
         * Adds the components of two points together, either modifying the first point or returning a new point
         * @param ptA The first point. If `mutate` is set to `true`, it will be modified
         * @param ptB The second point. Wll never be modified
         * @param mutate Whether the result should be stored in `ptA` or returned as a new point
         * @returns If `mutate` is `false`, a new point with the result is returned; otherwise, `ptA` is mutated accordingly and returned.
         */
        static plus(ptA: Point3D, ptB: Point3D, mutate?: boolean): Point3D;
        /**
         * Subtracts the components of the second point from the first, either modifying the first point or returning a new point
         * @param ptA The first point. If `mutate` is set to `true`, it will be modified
         * @param ptB The second point. Wll never be modified
         * @param mutate Whether the result should be stored in `ptA` or returned as a new point
         * @returns If `mutate` is `false`, a new point with the result is returned; otherwise, `ptA` is mutated accordingly and returned.
         */
        static minus(ptA: Point3D, ptB: Point3D, mutate?: boolean): Point3D;
        /**
         * Clones a point and returns the clone
         * @param pt The point to be cloned
         * @returns The cloned point
         */
        static clone<T extends Point3D | Vector3D>(pt: T): T | {
            x: number;
            y: number;
            z: number;
        };
        /**
         * Scales a point's components by a scalar, either mutating the original or returning a new point
         * @param pt The point to be scaled
         * @param scale The scale factor
         * @param mutate Whether to modify the original point to store the result or to create a new one to store the result
         */
        static scale(pt: Point3D, scale: number, mutate?: boolean): Point3D;
        /**
         * Scales a point's components by -1, either mutating the original or returning a new point
         * @param pt The point to be scaled
         * @param scale The scale factor
         * @param mutate Whether to modify the original point to store the result or to create a new one to store the result
         */
        static invert(pt: Point3D, mutate?: boolean): Point3D;
        /**
         * Treats the two points as vectors and performs the dot product between them
         * @param ptA The first point
         * @param ptB The second point
         * @returns The result of performing the dot product between the two points, interpreted as vectors
         */
        static dotProduct(ptA: Point3D, ptB: Point3D): number;
        /**
         * Treats the two points as vectors and gets the angle between the two
         * @param ptA The first point
         * @param ptB The second point
         * @returns The angle between the two points, treated as vectors
         */
        static angleTo(ptA: Point3D, ptB: Point3D): number;
        /**
         * Treats the two points as vectors and projects the first onto the second
         * @param ptA The first point
         * @param ptB The second point
         * @returns The result of projecting the first vector onto the second
         */
        static projection(ptA: Point3D, ptB: Point3D): Point3D;
        /**
         * Treats the two points as vectors and performs the cross product between them
         * @param ptA The first point
         * @param ptB The second point
         * @returns The result of performing the cross product between the two points, interpreted as vectors
         */
        static crossProduct(ptA: Point3D, ptB: Point3D): Point3D;
        /**
         * Treats all three points as vectors, and returns the dot product of the first with the cross product of the second.
         * @link https://en.wikipedia.org/wiki/Triple_product
         * @param ptA The first point
         * @param ptB The second point
         * @param ptC The third point
         * @returns The result of the triple product: if it isn't 0, the three vectors are linearly dependant, and the numerical value is the volume of the parallepiped delimited by the three vectors
         */
        static tripleProduct(ptA: Point3D, ptB: Point3D, ptC: Point3D): number;
        /**
         * Creates a new Vector3D object from a point. Copies the point's components
         * @param pt The point to be converted
         * @returns The newly-created vector
         */
        static fromPoint3D(pt: Point3D): Vector3D;
        /**
         * Linearly interpolates between two points
         * @param ptA The first point (start)
         * @param ptB The second point (end)
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new point containing the result's operation\
        * t = 0` is guaranteed to return a clone of `ptA`; `t = 1` is guaranteed to return a clone of `ptB`.
         */
        static lerp(ptA: Point3D, ptB: Point3D, t: number): Point3D;
        /**
         * Checks the point and returns whether any component is `NaN`
         * @param pt The point to check
         */
        static hasNaN(pt: Point3D): boolean;
        /**
         * Casts either a Vector3D or a Point3D to a Point3D
         * @param pt The object to be casted. If a Point3D is passed, it is not cloned, and the original is returned
         */
        static toPoint3D(pt: Point3D | Vector3D): Point3D;
        /**
         * `* It's a constructor. It constructs.`
         *
         * If `NaN` is passed in, it is replaced by 0
         * @param x The x component of the vector
         * @param y The y component of the vector
         * @param z The z component of the vector
         */
        constructor(x: number, y: number, z: number);
        /**
         * Treating this vector as a point, gets the squared distance between this point and another
         * @param pt The point to which to measure
         * @returns The squared distance between the two points
         */
        squaredDistToPt(pt: Point3D): number;
        /**
         * Treating this vector as a point, returns the distance between this point and another
         * @param pt The point to which to measure
         * @returns The distance between the two points
         */
        distToPt(pt: Point3D): number;
        /**
         * Returns the unit vector associated with this vector
         */
        unit(): Vector3D;
        /**
         * Determine if two vectors have equal components
         * @param vec The vector to compare to
         * @returns Whether or not the two vectors have the same components
         */
        equals(vec: Point3D): boolean;
        /**
         * Adds a vector to this one, either mutating this one or returning a new vector that's the result of the operation.
         * @param vec The vector to add. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        plus(vec: Point3D, mutate?: boolean): Vector3D;
        /**
         * Subtracts a vector from this vector, either mutating this one or returning a new vector that's the result of the operation.
         * @param vec The vector to subtract from this one. This is never modified.
         * @param mutate Whether or not to mutate this vector
         */
        minus(vec: Point3D, mutate?: boolean): Vector3D;
        /**
         * Returns a new vector whose components are identical to this one
         */
        clone(): Vector3D;
        /**
         * Multiplies this vector by a scalar, either modifying this vector or returning a new vector with the result
         * @param scale The factor to scale this vector by
         * @param mutate Whether or not to mutate this vector or return a new one
         */
        scale(scale: number, mutate?: boolean): Vector3D;
        /**
         * Multiplies this vector by -1, either modifying this vector or returning a new vector with the result
         * @param mutate Whether or not to mutate this vector or return a new one
         */
        invert(mutate?: boolean): Vector3D;
        /**
         * Performs the dot product between this vector and another. Can be used to test perpendicularity: if the dot product is zero, then the two vectors are perpendicular
         * @param vec The vector to perform the dot product with
         */
        dotProduct(vec: Point3D): number;
        /**
         * Returns the angle between this vector and another
         * @param vec The other vector to compare to
         */
        angleTo(vec: Vector3D): number;
        /**
         * Projects this vector onto another, returning the projected vector
         * @param vec The vector to be projected on
         */
        projection(vec: Vector3D): Vector3D;
        /**
         * Performs the cross product of this vector with another
         * @param vec The vector to perform the cross product with
         * @returns The result of performing the cross product between the two vectors
         */
        crossProduct(vec: Point3D): Vector3D;
        /**
         * Performs the [triple product](https://en.wikipedia.org/wiki/Triple_product) with this vector as the first one
         * @param vecA The second vector of the triple product
         * @param vecB The third vector of the triple product
         * @returns The result of the triple product: if it isn't 0, the three vectors are linearly dependant, and the numerical value is the volume of the parallepiped delimited by the three vectors
         */
        tripleProduct(vecA: Vector3D, vecB: Vector3D): number;
        /**
         * Linearly interpolates between this vector and another
         * @param vec The vector to interpolate with
         * @param t The interpolation factor. Not clamped to [0, 1]
         * @returns A new vector containing the result of the operation\
         * `t = 0` is guaranteed to return a copy of `this`; `t = 1` is guaranteed to return a copy of `vec`.
         */
        lerp(vec: Point3D, t: number): Vector3D;
        /**
         * Checks this vector and returns whether any component is `NaN`
         */
        hasNaN(): boolean;
        /**
         * Returns a lightweight representation of this object
         */
        toPoint3D(): Point3D;
        /**
         * Returns a lightweight 2D representation of this object
         */
        toPoint2D(): Point2D;
        /**
         * Returns a 2D-version of this vector
         */
        toVector2D(): Vector2D;
        /**
         * Returns a string representation of this vector
         */
        toString(): string;
    }
    /**
     * Represents a line segment, defined by a start and end point
     */
    type LineSegment = {
        start: Point2D;
        end: Point2D;
    };
    /**
     * matter.js (un)helpfully doesn't provide intersection points for collisions, so I'm stuck doing it
     */
    const collisionFunctions: {
        /**
         * Tests whether a line segment is intersecting a circle, without giving intersection points
         * @param segment An object, whose `start` and `end` properties denote the extremities of the line segment
         * @param circle An object, whose `origin` property denotes the circle's position, and whose `radius` property denotes the circle's radius
         * @returns Whether or not the segment is intersecting the circle
         */
        testSegmentCircle(segment: LineSegment, circle: {
            origin: Point2D;
            radius: number;
        }): boolean;
        /**
         * Returns the intersection point(s) between a segment and a circle, or `null` if none exist
         * @param segment An object whose `start` and `end` properties denote the extremities of the segment
         * @param circle An object, whose `origin` property denotes the circle's position, and whose `radius` property denotes the circle's radius
         * - `null` if no intersection points exist
         * - An array containing the point(s) of intersection
         */
        segmentCircle(segment: LineSegment, circle: {
            origin: Point2D;
            radius: number;
        }): srvsdbx_ErrorHandling.Maybe<readonly [Point2D] | readonly [Point2D, Point2D]>;
        /**
         * Returns the intersection point between two line segments, or `null` if none are found
         * @param segmentA The first segment
         * @param segmentB The second segment
         * @returns The intersection between the two segments, or `null` if none are found
         */
        segmentSegment(segmentA: LineSegment, segmentB: LineSegment): srvsdbx_ErrorHandling.Maybe<Point2D>;
        /**
         * Returns all intersection points between a line segment and a polygon, along with the edge that each point is on
         * @param segment The line segment
         * @param polygonVertices The polygon, represented as an array of vertices.
         * No check as to whether this set of vertices really forms a polygon is done.
         */
        segmentPolygon(segment: LineSegment, polygonVertices: Point2D[]): [Point2D, LineSegment][];
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
declare function cachify<P extends any[] = never[], R = never, B extends boolean = false>(fn: (...args: P) => R, config?: {
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
    equalityFunction?: (a: P, b: P) => boolean;
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
    initialEntries?: (readonly [P, R])[];
    /**
     * Whether to attach a `diagnostics` property to the emitted function; this object will store various data about the function such as
     * cache hits and misses, which can be useful for gauging the effectiveness of the cache
     */
    diagnostics?: B;
}): (B extends true ? {
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
} : {}) & ((...args: P) => R);
/**
 * Takes a class as an argument and returns a version of that class that can only be instantiated once
 * @param cls The class to make a singleton of
 * @returns The [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) object
 */
declare function createSingleton<T extends new (...args: any[]) => object>(cls: T): T;
/**
 * Represents an event listener
 */
interface Listener<E extends SandboxEventMap, K extends keyof E & string = keyof E & string> {
    /**
     * The event type this listener is attached to
     */
    event: any;
    /**
     * The function to be invoked when the event is fired
     * @param event The event dispatched
     * @param args Any additional argument
     */
    callback: (event: E[K]["event"], ...args: E[K]["args"]) => void;
    /**
     * The listener's name
     */
    name: string;
    /**
     * Whether the listener should only be run once and then removed
     */
    once?: boolean;
}
/**
 * A map of events and arguments passed to their respective callbacks
 */
type SandboxEventMap = Record<string, {
    event: Event;
    args: unknown[];
}>;
/**
 * A custom implementation of EventTarget
 */
declare class SandboxEventTarget<E extends SandboxEventMap> {
    #private;
    /**
     * The amount of listeners on this target
     */
    get listenerCount(): number;
    /**
     * An array containing each listener registered on this target
     */
    get listeners(): Listener<E, keyof E & string>[];
    /**
     * Appends an event listener to a specified channel
     * @param event The event type, or channel, to which this listener should be attached
     * @param callback A function that will be invoked with the event target as `this` when the event `event` is fired.
     * @returns This event target object
     */
    on<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"]): this;
    /**
     * Appends a "once" listener to a specified channel; "once" listeners are only invoked once and subsequent events don't trigger it
     * @param event The event type, or channel, to which this listener should be attached
     * @param callback A function that will be invoked when the event is fired. Only the first invocation following this listener's registration will be honored: the listener is dumped afterwards
     * @returns This event target object
     */
    once<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"]): this;
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
    removeListener<K extends keyof E & string>(event: K, selector: string | Listener<E, K>["callback"]): boolean;
    /**
     * Emulates the DOM-style of event listeners, but functions identically to `on` and `once`
     * @param event The channel to which this listener should be appended
     * @param callback The function to be invoked when the event is fired
     * @param options An object containing a single boolean field, `once`, which dictates whether the event listener should be cleared after its first invocation. Defaults to false
     * @returns This event target object
     */
    addEventListener<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"], options?: {
        once: boolean;
    }): this;
    /**
     * Removes all listeners from a certain event type, or channel
     * @param event The channel to remove listeners from
     */
    removeListenersByType(event: keyof E): void;
    /**
     * Removes every single listener on this event target
     */
    removeAllListeners(): void;
    /**
     * Dispatches an event through a certain channel, triggering any listeners attached to it
     * @param event The channel name
     * @param args Arguments to pass to the callback function
     * @returns Whether the dispatched event was cancelled (by calling `event.preventDefault()`)
     */
    dispatchEvent<K extends keyof E & string>(event: K | E[K]["event"], ...args: E[K]["args"]): boolean;
}
/**
 * An event representing a collision between two game objects
 */
declare class CollisionEvent extends Event {
    #private;
    /**
     * The matter.js `Collision` object containing information about the collision
     */
    get collisionData(): Matter.Collision;
    get intersectionPoints(): srvsdbx_Geometry.Point2D[];
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(data: Matter.Collision, intersectionsPoints?: srvsdbx_Geometry.Point2D[]);
}
/**
 * A namespace containing various mathematical functions
 */
declare namespace srvsdbx_Math {
    /**
     * Converts an angle measure to radians
     * @param angle The angle measure
     * @param unit The unit the provided measure is given in
     * @returns The equivalent angle in radians
     */
    function toRad(angle: number, unit: "degrees" | "radians" | "turns"): number;
    /**
     * Converts a time frame to milliseconds
     * @param time The time frame
     * @param unit The unit the provided measure is given in
     * @returns The equivalent time frame in milliseconds
     */
    function toMS(time: number, unit: "s" | "ms" | "RPM"): number;
    /**
     * Returns the amount of decimal places in a number
     * @param n The number
     */
    function getDecimalPlaces(n: number | Decimal): number;
    /**
     * Slices a number to a certain amount of decimal places
     * @param number The number to slice
     * @param decimalPlaces How many decimal places are desired
     * @returns The new number
     */
    function sliceToDecimalPlaces(number: number | Decimal, decimalPlaces: number): number;
    /**
     * Performs a multiplication between two numbers, using truncation to attempt to mitigate the flaws of floating-point precision
     * @param a The first number
     * @param b The second number
     */
    function sigFigIshMult(a: number, b: number): number;
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
    function checkBounds(value: number, lowerBound: number, upperBound: number, inclusion?: {
        lower?: boolean;
        upper?: boolean;
    }): boolean;
    /**
     * Normalizes an angle to within a certain range, removing redundancy (ex: 540º => 180º, -3π / 2 => π / 2)
     * @param angle The angle to normalize
     * @param normalizeTo What unit the angle is given in, and thus, what unit it should be normalized to. Defaults to `radians`.
     * @returns The normalized angle
     */
    function normalizeAngle(angle: number, normalizeTo?: "degrees" | "radians" | "π"): number;
    /**
     * A method of generating a random number according to a mean and deviation from said mean
     * @param mean The middle value
     * @param deviation The farthest deviation from the specified mean
     * @param plusOrMinus Whether the deviation applies in both direction or only one
     * @returns A random number in the range…\
     * • `[mean - deviation, mean + deviation[` if `plusOrMinus` is `true`\
     * • `[mean, mean + deviation[` otherwise.
     */
    function meanDevPM_random(mean: number, deviation: number, plusOrMinus: boolean): number;
    /**
     * Generates a random number between two bounds
     * @param lower The lower bound
     * @param upper The upper bound
     * @returns A number in the range `[lower, upper[`
     */
    function bounds_random(lower: number, upper: number): number;
    /**
     * Generates a random angle in radians (in range `[0, 2π[`)
     */
    function randomAngle(): number;
    /**
     * Retrieves the set of coefficients for the powers of `x` in the expression `(1 + x) ^ n` for some `n`\
     * [Reference](https://en.wikipedia.org/wiki/Binomial_coefficient)
     * @param order The exponent `n` in the above-mentioned definition.
     * @returns An array with the coefficients. The first coefficient corresponds to the largest power of `x`, so `x ^ 3 + 3x ^ 2 + 3x + 1` would return `[1, 3, 3, 1]`\
     */
    function getBinomialCoefficients(order: number): srvsdbx_ErrorHandling.Result<number[] | bigint[], RangeError>;
}
/**
 * Returns a cosmetic decorator
 *
 * **Decorators aren't supported by any browser, and since these ones are purely cosmetic,
 * having Typescript transpile them isn't worth it; for that reason, they've been commented until
 * further notice**
 */
declare function generateCosmeticDecorator(): <T extends (...args: any[]) => unknown>(value: T, context: ClassMethodDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext) => void;
/**
 * A purely cosmetic decorator, indicating that a method may throw certain types of errors
 * @param errors The types of errors this method may throw
 */
declare function Throws(...errors: ErrorConstructor[]): <T extends (...args: any[]) => unknown>(value: T, context: ClassMethodDecoratorContext<unknown, (this: unknown, ...args: any) => any> | ClassGetterDecoratorContext<unknown, unknown> | ClassSetterDecoratorContext<unknown, unknown>) => void;
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
declare const EventMap: {
    new <K, V>(): {
        /**
         * The internal map
         */
        "__#29@#internal": Map<K, V>;
        /**
         * The internal map's size
         */
        readonly size: number;
        /**
         * Calls any listeners attached to the `get` event, before calling the original method\
         * This event cannot be cancelled
         * @param key The key to search the map for
         */
        get(key: K): V | undefined;
        /**
         * Calls any listeners attached to the `set` event, before calling the original method
         * @param key The key at which to insert the value
         * @param value The value to insert there
         *
         * - `@Cancellable`: Calling `Event.preventDefault()` will prevent the set operation
         */
        set(key: K, value: V): any;
        /**
         * Calls any listeners attached to the `delete` event, before calling the original method
         * @param key The key to delete
         *
         * - `@Cancellable`: Calling `Event.preventDefault()` will prevent the set operation
         */
        delete(key: K): boolean;
        /**
         * Calls any listeners attached to the `clear` event, before calling the original method
         *
         * - `@Cancellable`: Calling `Event.preventDefault()` will prevent the set operation
         */
        clear(): void;
        /**
         * Directly calls the equivalent method on the internal map
         * @param callbackfn A function to execute for each key/value pair in the map
         * @param thisArg The `this` argument to invoke each callback with
         */
        forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
        /**
         * Directly calls the internal map's `has` method
         * @param key The key to check for
         */
        has(key: K): boolean;
        /**
         * Directly calls the internal map's `entries`
         */
        entries(): IterableIterator<[K, V]>;
        /**
         * Directly calls the internal map's `keys`
         */
        keys(): IterableIterator<K>;
        /**
         * Directly calls the internal map's `values`
         */
        values(): IterableIterator<V>;
        /**
         * Returns the iterator of the internal map
        */
        [Symbol.iterator](): IterableIterator<[K, V]>;
        /**
         * Returns the toStringTag of the internal map
         */
        [Symbol.toStringTag]: string;
        /**
         * The amount of listeners on this target
         */
        "__#27@#listenerCount": number;
        /**
         * The amount of listeners on this target
         */
        readonly listenerCount: number;
        /**
         * An array containing each listener registered on this target
         */
        "__#27@#listeners": Listener<{
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }, "set" | "clear" | "get" | "delete">[];
        /**
         * An array containing each listener registered on this target
         */
        readonly listeners: Listener<{
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }, "set" | "clear" | "get" | "delete">[];
        /**
         * Appends an event listener to a specified channel
         * @param event The event type, or channel, to which this listener should be attached
         * @param callback A function that will be invoked with the event target as `this` when the event `event` is fired.
         * @returns This event target object
         */
        on<K_1 extends "set" | "clear" | "get" | "delete">(event: K_1, callback: (event: {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_1]["event"], ...args: {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_1]["args"]) => void): any;
        /**
         * Appends a "once" listener to a specified channel; "once" listeners are only invoked once and subsequent events don't trigger it
         * @param event The event type, or channel, to which this listener should be attached
         * @param callback A function that will be invoked when the event is fired. Only the first invocation following this listener's registration will be honored: the listener is dumped afterwards
         * @returns This event target object
         */
        once<K_2 extends "set" | "clear" | "get" | "delete">(event: K_2, callback: (event: {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_2]["event"], ...args: {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_2]["args"]) => void): any;
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
        removeListener<K_3 extends "set" | "clear" | "get" | "delete">(event: K_3, selector: string | ((event: {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_3]["event"], ...args: {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_3]["args"]) => void)): boolean;
        /**
         * Emulates the DOM-style of event listeners, but functions identically to `on` and `once`
         * @param event The channel to which this listener should be appended
         * @param callback The function to be invoked when the event is fired
         * @param options An object containing a single boolean field, `once`, which dictates whether the event listener should be cleared after its first invocation. Defaults to false
         * @returns This event target object
         */
        addEventListener<K_4 extends "set" | "clear" | "get" | "delete">(event: K_4, callback: (event: {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_4]["event"], ...args: {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_4]["args"]) => void, options?: {
            once: boolean;
        }): this;
        /**
         * Removes all listeners from a certain event type, or channel
         * @param event The channel to remove listeners from
         */
        removeListenersByType(event: "set" | "clear" | "get" | "delete"): void;
        /**
         * Removes every single listener on this event target
         */
        removeAllListeners(): void;
        /**
         * Dispatches an event through a certain channel, triggering any listeners attached to it
         * @param event The channel name
         * @param args Arguments to pass to the callback function
         * @returns Whether the dispatched event was cancelled (by calling `event.preventDefault()`)
         */
        dispatchEvent<K_5 extends "set" | "clear" | "get" | "delete">(event: K_5 | {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_5]["event"], ...args: {
            get: {
                event: Event;
                args: [K];
            };
            set: {
                event: Event;
                args: [K, V];
            };
            delete: {
                event: Event;
                args: [K, V | undefined];
            };
            clear: {
                event: Event;
                args: [];
            };
        }[K_5]["args"]): boolean;
    };
};
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
declare class ReducibleMap<K, V, R = V> implements Map<K, V> {
    #private;
    /**
     * The result of the reduction operation applied over this map's contents
     * @throws {TypeError} If the map is empty and no default value was specified
     */
    get reduced(): NonNullable<R>;
    get size(): number;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    [Symbol.toStringTag]: string;
    /**
     * `It's a constructor. It constructs`
     * @param reducer The function that will be used to reduce this map; identical in role to `Array.prototype.reduce`
     * @param defaultValue Optionally specify a value that will start as the accumulated value; if the map is empty
     * and no default value specified, an error is thrown
     */
    constructor(reducer: (accumulator: R, currentValue: V, currentKey: K, map: ReducibleMap<K, V, R>) => R, defaultValue?: R);
    /**
     * Clears the internal map
     */
    clear(): void;
    delete(key: K): boolean;
    /**
     * Adds a new element with a specified key and value to the Map.
     * If an element with the same key already exists, the element will be updated.
     * @param key The key to insert the element at
     * @param value The value to insert at the specified key
     * @returns This `ReducibleMap` instance
     * @throws {TypeError} If the map is empty and no default value has been specified
     */
    set(key: K, value: V): this;
    get(key: K): V | undefined;
    has(key: K): boolean;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    entries(): IterableIterator<[K, V]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
}
/**
 * Cancels a timer if it is present. Works with `setInterval` and `setTimeout`.
 * @param timer The timer to be cleared
 */
declare function clearTimerIfPresent(timer: false | number): void;
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
