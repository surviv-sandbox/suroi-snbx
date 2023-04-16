declare namespace srvsdbx_Animation {
    type KeyframeBase = {
        easing?: (t: number) => number;
    };
    type TimeFrame = {
        readonly time: number;
        readonly delay?: never;
        readonly fraction?: never;
    };
    type DelayFrame = {
        readonly time?: never;
        readonly delay: number;
        readonly fraction?: never;
    };
    type FractionFrame = {
        readonly time?: never;
        readonly delay?: never;
        readonly fraction: number;
    };
    export type Keyframe = (TimeFrame | DelayFrame | FractionFrame) & KeyframeBase;
    type TimeBasedKeyframe = Omit<TimeFrame & KeyframeBase, "delay" | "fraction">;
    export type AnimationSkeleton<K extends object = {}> = {
        duration: number;
        readonly keyframes: (Keyframe & {
            data: MayBeFunctionWrapped<K>;
        })[];
        readonly repetition?: {
            readonly iterations: number;
            readonly delay: number;
        };
    };
    export type ExtractAnimationExtension<A extends AnimationSkeleton> = A extends AnimationSkeleton<infer K> ? K : never;
    export type EasingFunction = (a: number, b: number, t: number) => number;
    export const easingFunctions: {
        readonly linterp: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInSine: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeOutSine: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInOutSine: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInCubic: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeOutCubic: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInOutCubic: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInQuintic: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeOutQuintic: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInOutQuintic: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInCirc: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeOutCirc: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInOutCirc: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInElastic: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeOutElastic: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInOutElastic: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInQuad: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeOutQuad: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInOutQuad: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInQuart: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeOutQuart: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInOutQuart: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInExpo: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeOutExpo: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInOutExpo: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInBack: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeOutBack: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly easeInOutBack: EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly cubicBezier: (p1x: number, p1y: number, p2x: number, p2y: number) => EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        readonly bezier: (...points: srvsdbx_Geometry.Point2D[]) => EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
    };
    export type IndeterminateAnimation<T extends object = {}> = (interpolationFunction: ConstructorParameters<typeof Animation<T>>[1]) => Animation<T>;
    export type BoundIndeterminateAnimation<T extends object = {}, I extends IndeterminateAnimation<T> = IndeterminateAnimation<T>> = () => ReturnType<I>;
    export class Animation<T extends object = {}> {
        #private;
        get animationSkeleton(): Omit<AnimationSkeleton<T>, "keyframes"> & {
            keyframes: (TimeBasedKeyframe & {
                data: MayBeFunctionWrapped<T, []>;
            })[];
        };
        get duration(): number;
        get interpolationFunction(): (start: T, end: T, interpolationFactor: number) => T;
        static createStillFrame<T extends object = {}>(data: T): Animation<T>;
        static createIndeterminateAnimation<T extends object = {}>(animationSkeleton: MayBeFunctionWrapped<AnimationSkeleton<T>>): IndeterminateAnimation<T>;
        constructor(animationSkeleton: AnimationSkeleton<T>, interpolationFunction: (start: T, end: T, interpolationFactor: number) => T);
    }
    export class AnimationManager<T extends object = {}, K extends string = string> {
        #private;
        constructor(animations: Record<K, Animation<T> | BoundIndeterminateAnimation<T>>);
        start(name: K): <B extends boolean>(time: number, overflowReturnsLastFrame: B) => B extends true ? T : srvsdbx_ErrorHandling.Maybe<T>;
        fetchInstance(name: K): [Omit<Animation<T>, "animationSkeleton"> & {
            animationSkeleton: Omit<Omit<AnimationSkeleton<T>, "keyframes"> & {
                keyframes: (TimeBasedKeyframe & {
                    data: MayBeFunctionWrapped<T, []>;
                })[];
            }, "keyframes"> & {
                keyframes: (Omit<TimeBasedKeyframe & {
                    data: MayBeFunctionWrapped<T, []>;
                }, "data"> & {
                    data: T;
                })[];
            };
        }, <B extends boolean>(time: number, overflowReturnsLastFrame: B) => B extends true ? T : srvsdbx_ErrorHandling.Maybe<T>];
        fetch(name: K): <B extends boolean>(time: number, overflowReturnsLastFrame: B) => B extends true ? T : srvsdbx_ErrorHandling.Maybe<T>;
        has(name: K): boolean;
        end(name: K): void;
        endAll(): void;
    }
    export {};
}
