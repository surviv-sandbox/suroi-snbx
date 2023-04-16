/// <reference types="p5" />
interface Math {
    sign(x: number): -1 | 0 | 1;
    cmp(a: number, b: number): -1 | 0 | 1;
    clamp(value: number, min: number, max: number): number;
    sec(x: number): number;
    csc(x: number): number;
    cot(x: number): number;
    asec(x: number): number;
    acsc(x: number): number;
    acot(x: number): number;
}
interface Array<T> {
    findLastIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;
    findLast<S extends T>(predicate: (value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
}
type ExportInterface<I extends SimpleImport> = Omit<I, Exclude<keyof SimpleImport, "name" | "displayName" | "targetVersion">>;
type Dimension = number | "auto";
type TupleToUnion<T extends readonly any[]> = T extends readonly [infer U, ...infer V] ? V extends [infer W] ? U | W : U | TupleToUnion<V> : never;
type ObjectKey<T extends object> = keyof T;
type ObjectValue<T extends object> = T[keyof T];
type DeepPartial<T extends object> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
type DeepRequired<T extends object> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};
declare const generateId: () => bigint;
type ObjectId = ReturnType<typeof generateId>;
declare namespace srvsdbx_ErrorHandling {
    const Nothing: null;
    type Nothing = typeof Nothing;
    type Maybe<T> = T | null;
    function assertIsPresent<T>(value: Maybe<T>): value is T;
    function createIf<T, B extends boolean>(condition: B, value: MayBeFunctionWrapped<T>): B extends true ? T : Nothing;
    type ResultRes<T> = {
        res: T;
    };
    type ResultErr<E> = {
        err: E;
    };
    type Result<T, E> = ResultRes<T> | ResultErr<E>;
    function handleResult<T = never, E = never, Sr = unknown, Fr = unknown>(val: Result<T, E>, success: (value: T) => Sr, error: (error: E) => Fr): ([T] extends [never] ? never : Sr) | ([E] extends [never] ? never : Fr);
    function emptyResult(): ResultRes<undefined>;
    function identity<T>(x: T): T;
    function passAlongOrThrow<T, E>(val: Result<T, E>): ([T] extends [never] ? never : T) | ([E] extends [never] ? never : never);
    function yeet<E>(e: E): never;
}
type FunctionWrapper<T, U extends any[] = []> = (...args: U) => T;
type MayBeFunctionWrapped<T, U extends any[] = []> = T | FunctionWrapper<T, U>;
type ExtractWrapped<T> = T extends MayBeFunctionWrapped<infer U, any> ? U : never;
type ExtractArgs<T> = T extends MayBeFunctionWrapped<any, infer U> ? U : never;
declare function extractValue<T, U extends any[] = []>(val: MayBeFunctionWrapped<T, U>, ...args: U): T;
type IfThenElse<B extends boolean, I, E> = B extends true ? I : E;
type PrototypeReference<T extends keyof Gamespace["prototypes"]> = MapKey<Gamespace["prototypes"][T]>;
type SimpleListener<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap> = (this: HTMLElementTagNameMap[T], ev: HTMLElementEventMap[K]) => void;
type OptionsListener<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap> = {
    callback: SimpleListener<T, K>;
    options?: boolean | AddEventListenerOptions;
};
declare function makeElement<K extends keyof HTMLElementTagNameMap>(key: K, properties?: DeepPartial<HTMLElementTagNameMap[K]>, children?: string | Node | (string | Node)[], listeners?: {
    [key in keyof HTMLElementEventMap]?: SimpleListener<K, key> | OptionsListener<K, key> | (SimpleListener<K, key> | OptionsListener<K, key>)[];
}): HTMLElementTagNameMap[K];
declare namespace srvsdbx_AssetManagement {
    type AssetSrcPair<T> = {
        readonly src: string;
        readonly asset: T;
    };
    type ImageSrcPair = AssetSrcPair<import("p5").Image>;
    type FontSrcPair = AssetSrcPair<import("p5").Font>;
    const loadingFunctions: {
        loadImageAsync: (path: string) => Promise<srvsdbx_ErrorHandling.Result<AssetSrcPair<import("p5").Image>, {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        }>>;
        loadFontAsync: (path: string) => Promise<srvsdbx_ErrorHandling.Result<AssetSrcPair<any>, {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        }>>;
    };
    function loadImageArray(paths: string[], errors: unknown[], prefix?: string): Promise<AssetSrcPair<import("p5").Image>[]>;
    type ConvertPathsToImages<O extends object> = {
        [K in keyof O]: K extends "image" ? ImageSrcPair : K extends "images" ? O[K] extends string[] ? ImageSrcPair[] : O[K] : O[K] extends object ? ConvertPathsToImages<O[K]> : O[K] extends object | undefined ? ConvertPathsToImages<O[K] & {}> | undefined : O[K];
    };
    function determineImageDimensions(image: ImageSrcPair["asset"], dimensions: {
        width: Dimension;
        height: Dimension;
    }): {
        width: number;
        height: number;
    };
}
declare function pickRandomInArray<T>(array: T[]): T;
declare namespace srvsdbx_Geometry {
    export interface Point2D {
        x: number;
        y: number;
    }
    export interface Polar2D {
        direction: number;
        magnitude: number;
    }
    export interface Hydrated2DPoint extends Point2D, Polar2D {
    }
    export interface Point3D extends Point2D {
        z: number;
    }
    export class Vector2D implements Point2D {
        #private;
        get x(): number;
        set x(v: number);
        get y(): number;
        set y(v: number);
        get squaredLength(): number;
        get length(): number;
        set length(v: number);
        get direction(): number;
        set direction(v: number);
        static zeroVector(): Vector2D;
        static zeroPoint(): Point2D;
        static hydrate<T extends Point2D | Polar2D>(point: T): T extends Vector2D ? Vector2D : Hydrated2DPoint;
        static fromVector3D(vector: Vector3D): Vector2D;
        static toVector3D(vector: Vector2D): Vector3D;
        static fromPolarToPt(angle: number, magnitude: number): Point2D;
        static fromPolarToVec(angle: number, magnitude: number): Vector2D;
        static squaredDist(point: Point2D): number;
        static dist(point: Point2D): number;
        static squaredDistanceBetweenPts(pointA: Point2D, ptB: Point2D): number;
        static distanceBetweenPts(pointA: Point2D, ptB: Point2D): number;
        static unit(pt: Point2D): Point2D;
        static equals(pointA: Point2D, ptB: Point2D): boolean;
        static plus(pointA: Point2D, pointB: Point2D, mutate?: boolean): Point2D;
        static minus(pointA: Point2D, pointB: Point2D, mutate?: boolean): Point2D;
        static clone<T extends Point2D | Vector2D>(point: T): T | {
            x: number;
            y: number;
        };
        static scale(point: Point2D, scale: number, mutate?: boolean): Point2D;
        static invert(point: Point2D, mutate?: boolean): Point2D;
        static dotProduct(pointA: Point2D, pointB: Point2D): number;
        static angleBetween(pointA: Point2D, pointB: Point2D): number;
        static projection(pointA: Point2D, pointB: Point2D): Hydrated2DPoint;
        static fromPoint2D(point: Point2D): Vector2D;
        static linterp(pointA: Point2D, pointB: Point2D, t: number): Hydrated2DPoint;
        static hasNaN(point: Point2D): boolean;
        static toPoint2D(point: Point2D | Vector2D): Point2D;
        static toCartesian(point: Point2D | Polar2D): Point2D;
        static toPolar(point: Point2D | Polar2D): Polar2D;
        constructor(x: number, y: number);
        squaredDistToPt(point: Point2D): number;
        distToPt(point: Point2D): number;
        unit(): Vector2D;
        equals(vector: Point2D): boolean;
        plus(vector: Point2D | Polar2D, mutate?: boolean): Vector2D;
        minus(vector: Point2D | Polar2D, mutate?: boolean): Vector2D;
        clone(): Vector2D;
        scale(scale: number, mutate?: boolean): Vector2D;
        invert(mutate?: boolean): Vector2D;
        dotProduct(vector: Point2D | Polar2D): number;
        angleBetween(vector: Vector2D): number;
        projection(vector: Vector2D): Vector2D;
        linterp(vector: Point2D, t: number): Vector2D;
        hasNaN(): boolean;
        toPoint2D(): Point2D;
        toPoint3D(): Point3D;
        toVector3D(): Vector3D;
        toString(): string;
        toPolar(): Polar2D;
    }
    export class Vector3D implements Point3D {
        #private;
        get x(): number;
        set x(v: number);
        get y(): number;
        set y(v: number);
        get z(): number;
        set z(v: number);
        get squaredLength(): number;
        get length(): number;
        set length(v: number);
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
        static zeroVector(): Vector3D;
        static zeroPoint(): Point3D;
        static fromPoint2D(point: Point2D): Vector3D;
        static toVector2D(vector: Vector3D): Vector2D;
        static squaredDistance(point: Point3D): number;
        static distance(point: Point3D): number;
        static squaredDistanceBetweenPts(pointA: Point3D, pointB: Point3D): number;
        static distanceBetweenPts(pointA: Point3D, pointB: Point3D): number;
        static unit(point: Point3D): Point3D;
        static equals(pointA: Vector3D, pointB: Vector3D): boolean;
        static plus(pointA: Point3D, pointB: Point3D, mutate?: boolean): Point3D;
        static minus(pointA: Point3D, pointB: Point3D, mutate?: boolean): Point3D;
        static clone<T extends Point3D | Vector3D>(point: T): T | {
            x: number;
            y: number;
            z: number;
        };
        static scale(point: Point3D, scale: number, mutate?: boolean): Point3D;
        static invert(point: Point3D, mutate?: boolean): Point3D;
        static dotProduct(pointA: Point3D, pointB: Point3D): number;
        static angleBetween(pointA: Point3D, pointB: Point3D): number;
        static projection(pointA: Point3D, pointB: Point3D): Point3D;
        static crossProduct(pointA: Point3D, pointB: Point3D): Point3D;
        static tripleProduct(pointA: Point3D, pointB: Point3D, pointC: Point3D): number;
        static fromPoint3D(point: Point3D): Vector3D;
        static linterp(pointA: Point3D, pointB: Point3D, t: number): Point3D;
        static hasNaN(point: Point3D): boolean;
        static toPoint3D(point: Point3D | Vector3D): Point3D;
        constructor(x: number, y: number, z: number);
        squaredDistToPt(point: Point3D): number;
        distToPt(point: Point3D): number;
        unit(): Vector3D;
        equals(vector: Point3D): boolean;
        plus(vector: Point3D, mutate?: boolean): Vector3D;
        minus(vector: Point3D, mutate?: boolean): Vector3D;
        clone(): Vector3D;
        scale(scale: number, mutate?: boolean): Vector3D;
        invert(mutate?: boolean): Vector3D;
        dotProduct(vec: Point3D): number;
        angleBetween(vec: Vector3D): number;
        projection(vec: Vector3D): Vector3D;
        crossProduct(vec: Point3D): Vector3D;
        tripleProduct(vectorA: Vector3D, vectorB: Vector3D): number;
        linterp(vector: Point3D, t: number): Vector3D;
        hasNaN(): boolean;
        toPoint3D(): Point3D;
        toPoint2D(): Point2D;
        toVector2D(): Vector2D;
        toString(): string;
    }
    export type LineSegment = {
        start: Point2D;
        end: Point2D;
    };
    export class AxisAlignedBoundingBox {
        #private;
        get min(): {
            x: number;
            y: number;
        };
        get max(): {
            x: number;
            y: number;
        };
        static from(shape: Point2D[] | {
            center: Point2D;
            radius: number;
        }): AxisAlignedBoundingBox;
        intersects(aabb: AxisAlignedBoundingBox): boolean;
        contains(aabb: AxisAlignedBoundingBox): boolean;
    }
    interface BaseShape<T extends BaseShape<T>> {
        readonly aabb: AxisAlignedBoundingBox;
        readonly type: string;
        readonly origin: Point2D;
        translate(translation: Point2D): void;
        moveTo(newPoint: Point2D): void;
        scale(factor: number): void;
        setAngle(amount: number): void;
        clone(): T;
    }
    export class Rectangle implements BaseShape<Rectangle> {
        #private;
        get aabb(): AxisAlignedBoundingBox;
        get width(): number;
        set width(v: number);
        get height(): number;
        set height(v: number);
        get origin(): Point2D;
        translate(translation: Point2D): void;
        moveTo(newPoint: Point2D): void;
        get type(): string;
        get vertices(): Point2D[];
        get angle(): number;
        constructor(origin: Point2D, width: number, height: number);
        setAngle(amount: number): void;
        scale(factor: number): void;
        collides(shape: Shape): srvsdbx_ErrorHandling.Maybe<[Point2D[], LineSegment][]>;
        clone(): Rectangle;
    }
    export class Circle implements BaseShape<Circle> {
        #private;
        get aabb(): AxisAlignedBoundingBox;
        get radius(): number;
        set radius(v: number);
        get origin(): Point2D;
        translate(translation: Point2D): void;
        moveTo(newPoint: Point2D): void;
        get type(): string;
        constructor(origin: Point2D, radius: number);
        scale(factor: number): void;
        setAngle(amount: number): void;
        collides(shape: Shape): srvsdbx_ErrorHandling.Maybe<[Point2D[], LineSegment][] | [Point2D] | [Point2D, Point2D]>;
        clone(): Circle;
    }
    export type Shape = Circle | Rectangle;
    export const collisionFunctions: {
        testSegmentCircle(segment: LineSegment, circle: {
            origin: Point2D;
            radius: number;
        }): boolean;
        segmentCircle(segment: LineSegment, circle: {
            origin: Point2D;
            radius: number;
        }): srvsdbx_ErrorHandling.Maybe<[Point2D] | [Point2D, Point2D]>;
        circleCircle(circleA: {
            origin: Point2D;
            radius: number;
        }, circleB: {
            origin: Point2D;
            radius: number;
        }): srvsdbx_ErrorHandling.Maybe<[] | [Point2D] | [Point2D, Point2D]>;
        segmentSegment(segmentA: LineSegment, segmentB: LineSegment): srvsdbx_ErrorHandling.Maybe<Point2D>;
        segmentPolygon(segment: LineSegment, polygonVertices: Point2D[]): srvsdbx_ErrorHandling.Maybe<[Point2D, LineSegment][]>;
        shapeShapes: (shape: (Rectangle | Circle), shapes: (Rectangle | Circle)[]) => srvsdbx_ErrorHandling.Maybe<[[Point2D] | [Point2D, Point2D] | [Point2D[], LineSegment][], Circle | Rectangle][]>;
        segmentShapes: (line: LineSegment, shapes: (Rectangle | Circle)[]) => srvsdbx_ErrorHandling.Maybe<[[Point2D] | [Point2D, Point2D] | [Point2D, LineSegment], Circle | Rectangle][]>;
    };
    export {};
}
declare function cachify<P extends any[] = never[], R = never, B extends boolean = false>(fn: (...args: P) => R, config?: {
    equalityFunction?: (a: P, b: P) => boolean;
    initialEntries?: (readonly [P, R])[];
    diagnostics?: B;
}): (B extends true ? {
    readonly diagnostics: {
        readonly calls: number;
        readonly cacheSize: number;
        readonly cacheHits: number;
        readonly cacheMisses: number;
        readonly cacheHitRate: number;
    };
} : {}) & ((...args: P) => R);
declare namespace srvsdbx_OOP {
    function createSingleton<T extends new (...args: any[]) => object>(cls: T): T;
    function makeAbstract<T extends abstract new (...args: any[]) => object>(cls: T): T;
    function makeFinal<T extends new (...args: any[]) => object>(cls: T): T;
}
interface Listener<E extends SandboxEventMap, K extends keyof E & string = keyof E & string> {
    readonly event: string;
    callback(event: Event, ...args: E[K]): void;
    readonly name: string;
    readonly once?: boolean;
}
type SandboxEventMap = Record<string, unknown[]>;
type ExtractEvents<E extends SandboxEventTarget<any>> = E extends SandboxEventTarget<infer F> ? F : never;
declare class SandboxEventTarget<E extends SandboxEventMap> {
    #private;
    get listenerCount(): number;
    get listeners(): Listener<E, keyof E & string>[];
    on<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"]): this;
    once<K extends keyof E & string>(event: K, callback: Listener<E, K & keyof E & string>["callback"]): this;
    removeListener<K extends keyof E & string>(event: K, selector: string | Listener<E, K>["callback"]): boolean;
    addEventListener<K extends keyof E & string>(event: K, callback: Listener<E, K>["callback"], options?: {
        once: boolean;
    }): this;
    removeListenersByType(event: keyof E): void;
    removeAllListeners(): void;
    dispatchEvent<K extends keyof E & string>(event: K, ...args: E[K]): boolean;
}
declare namespace srvsdbx_Math {
    function mean(values: number[]): number;
    function standardDeviation(values: number[]): number;
    function toRad(angle: number, unit: "degrees" | "radians" | "turns"): number;
    function toMS(time: number, unit: "s" | "ms" | "RPM"): number;
    function getDecimalPlaces(n: number): number;
    function sliceToDecimalPlaces(number: number, decimalPlaces: number): number;
    function sigFigIshMultiplication(a: number, b: number): number;
    function checkBounds(value: number, lowerBound: number, upperBound: number, inclusion?: {
        lower?: boolean;
        upper?: boolean;
    }): boolean;
    function normalizeAngle(angle: number, normalizeTo?: "degrees" | "radians" | "π"): number;
    function meanDevPM_random(mean: number, deviation: number, plusOrMinus: boolean): number;
    function bounds_random(lower: number, upper: number): number;
    function randomAngle(): number;
    function getBinomialCoefficients(order: number): srvsdbx_ErrorHandling.Result<number[] | bigint[], RangeError>;
}
declare function clearTimerIfPresent(timer: false | number): void;
declare class WatchablePromise<T> {
    #private;
    get promise(): Promise<T>;
    get isFulfilled(): boolean;
    get isRejected(): boolean;
    get isPending(): boolean;
    get isResolved(): boolean;
    constructor(promise: Promise<T>);
}
interface Destroyable {
    get destroyed(): boolean;
    destroy(): void;
}
