/**
 * A namespace containing various types and functions related to animation
 */
declare namespace srvsdbx_Animation {
    type KeyframeBase = {
        /**
         * A function used to modify the transition between the last keyframe and this one.
         * Note that this means that specifying `easing` on the first keyframe does nothing.
         * @param t A number between 0 and 1 specifying how far between the two keyframes the animation is
         */
        easing?: (t: number) => number;
    };
    type TimeFrame = {
        /**
         * A time after which this keyframe should be displayed, with 0 being the animation's start
         */
        readonly time: number;
        readonly delay?: never;
        readonly fraction?: never;
    };
    type DelayFrame = {
        readonly time?: never;
        /**
         * The time between this keyframe and the last
         */
        readonly delay: number;
        readonly fraction?: never;
    };
    type FractionFrame = {
        readonly time?: never;
        readonly delay?: never;
        /**
         * A number between 0 and 1 representing the time at which this keyframe should show
         */
        readonly fraction: number;
    };
    /**
     * Represents a keyframe in an animation
     */
    export type Keyframe = (TimeFrame | DelayFrame | FractionFrame) & KeyframeBase;
    type TimeBasedKeyframe = Omit<TimeFrame & KeyframeBase, "delay" | "fraction">;
    /**
     * Represents a certain animation
     */
    export type AnimationSkeleton<K extends object = {}> = {
        /**
         * The overall duration of the animation
         */
        duration: number;
        /**
         * The keyframes associated with this animation
         */
        readonly keyframes: (Keyframe & {
            data: MayBeFunctionWrapped<K>;
        })[];
        /**
         * Optionally specify if and how this animation should repeat itself
         */
        readonly repetition?: {
            /**
             * How many times this animation should repeat
             */
            readonly iterations: number;
            /**
             * How long to wait between repetitions
             */
            readonly delay: number;
        };
    };
    /**
     * Each keyframe of an animation contains, along with timing and easing information, data about the object to be animated. This type retrieves that data.
     */
    export type ExtractAnimationExtension<A extends AnimationSkeleton> = A extends AnimationSkeleton<infer K> ? K : never;
    /**
     * Represents a function used to interpolate (or ease) between two values
     */
    export type EasingFunction = (a: number, b: number, t: number) => number;
    /**
     * A collection of functions for easing, based on [this helpful reference](https://easings.net) and others
     *
     * For all functions, `t = 0` is guaranteed to return `a`, and `t = 1` is guaranteed to return `b`
     */
    export const easingFunctions: {
        /**
         * Linearly interpolates between two numbers
         * @param a The start value
         * @param b The end value
         * @param t The interpolation value
         * @returns The number at the specified point.\
         * `t = 0` is guaranteed to return `a`, and `t = 1` is guaranteed to return `b`.
         */
        readonly linterp: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a slow start tending towards a super-linear progression that in turn decelerates\
         * [Reference](https://easings.net/#easeInSine)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInSine: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a fast start tending towards a sub-linear progression that in turn decelerates\
         * [Reference](https://easings.net/#easeOutSine)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeOutSine: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a slow start and slow end that accelerates in the middle\
         * [Reference](https://easings.net/#easeInOutSine)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInOutSine: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a quite slow start and inversely fast end\
         * [Reference](https://easings.net/#easeInCubic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInCubic: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a quite fast start and inversely slow end\
         * [Reference](https://easings.net/#easeOutCubic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeOutCubic: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a slow start and end but very fast middle\
         * [Reference](https://easings.net/#easeInOutCubic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInOutCubic: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a very slow start and inversely fast end\
         * [Reference](https://easings.net/#easeInQuintic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInQuintic: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a very fast start and inversely slow end\
         * [Reference](https://easings.net/#easeOutQuintic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeOutQuintic: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a slow start and end but extremely fast middle\
         * [Reference](https://easings.net/#easeInOutQuintic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInOutQuintic: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a sluggish start and almost instant end\
         * [Reference](https://easings.net/#https://easings.net/#easeInCirc)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInCirc: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with an almost instant start but sluggish end\
         * [Reference](https://easings.net/#easeOutCirc)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeOutCirc: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a slow start and end but discontinuous middle\
         * [Reference](https://easings.net/#easeInOutCirc)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInOutCirc: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a wave of increasing amplitude that overshoots\
         * [Reference](https://easings.net/#https://easings.net/#easeInElastic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInElastic: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a wave of decreasing amplitude that overshoots\
         * [Reference](https://easings.net/#easeOutElastic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeOutElastic: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a wave that circles around `a` with increasing amplitude before jumping to circling around `b`, decreasing in amplitude
         * [Reference](https://easings.net/#easeInOutElastic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInOutElastic: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a slow start and fast end\
         * [Reference](https://easings.net/#https://easings.net/#easeInQuad)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInQuad: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a fast start but slow end\
         * [Reference](https://easings.net/#easeOutQuad)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeOutQuad: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a slightly slow start and end, and a slightly fast middle
         * [Reference](https://easings.net/#easeInOutQuad)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInOutQuad: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a quite slow start and quite fast end\
         * [Reference](https://easings.net/#https://easings.net/#easeInQuart)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInQuart: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a fast start but slow end\
         * [Reference](https://easings.net/#easeOutQuart)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeOutQuart: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a quite slow start and end, and a very fast middle
         * [Reference](https://easings.net/#easeInOutQuart)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInOutQuart: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a quite slow start and quite fast end\
         * [Reference](https://easings.net/#https://easings.net/#easeInExpo)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInExpo: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a fast start but slow end\
         * [Reference](https://easings.net/#easeOutExpo)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeOutExpo: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a quite slow start and end, and a very fast middle
         * [Reference](https://easings.net/#easeInOutExpo)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInOutExpo: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a slow start, overshoot and fast end\
         * [Reference](https://easings.net/#https://easings.net/#easeInBack)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInBack: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with a fast start, overshoot and slow end\
         * [Reference](https://easings.net/#easeOutBack)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeOutBack: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Interpolates between two numbers with overshoots at the start and end and a very fast middle
         * [Reference](https://easings.net/#easeInOutBack)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        readonly easeInOutBack: EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Creates a [cubic bézier curve](https://en.wikipedia.org/wiki/Bézier_curve#Cubic_Bézier_curves) based on two control points.\
         * Use [this website](https://cubic-bezier.com/) to help you visualize your curve if needed.
         * @param p1x The x-component of the first control point. Must be within `[0, 1]`
         * @param p1y The y-component of the first control point
         * @param p2x The x-component of the second control point. Must be within `[0, 1]`
         * @param p2y The y-component of the second control point
         * @returns An interpolation function accepting two bounds and an interpolation factor.
         * @throws {RangeError} If one of the control points is out-of-bounds
         */
        readonly cubicBezier: (p1x: number, p1y: number, p2x: number, p2y: number) => EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
        /**
         * Generates a [bézier curve](https://en.wikipedia.org/wiki/Bézier_curve) of an arbitrary degree.
         * @param points A series of control points. Note that the curve's endpoints are locked at (0, 0) and (1, 1),
         * and that the x components of every control point must lie within `[0, 1]`.
         * @returns An interpolation function accepting two bounds and an interpolation factor
         * @throws {RangeError} If one of the control points is out-of-bounds
         */
        readonly bezier: (...points: srvsdbx_Geometry.Point2D[]) => EasingFunction & {
            /**
             * A version of this interpolation function whose lower bound is 0 and whose upper bound is 1
             * @param t The interpolation factor
             */
            default(t: number): number;
            /**
             * A version of this interpolation function whose lower bound is `a` and whose upper bound is `b`
             * @param a The lower bound
             * @param b The upper bound
             * @returns A function describing the same curve as `fn`, interpolating from `a` to `b` whose parameter `t` is the interpolation factor.
             */
            bindToBounds(a: number, b: number): (t: number) => number;
        };
    };
    /**
     * Represents a function that, when called, will return an animation
     * @template T The type of data this animation will interpolate through
     */
    export type IndeterminateAnimation<T extends object = {}> = (interpolationFunction: ConstructorParameters<typeof Animation<T>>[1]) => Animation<T>;
    /**
     * Represents a function for generating animations whose interpolation function has already been specified
     * @template T The type of data this animation will interpolate through
     * @template I The indeterminate animation being bound
     */
    export type BoundIndeterminateAnimation<T extends object = {}, I extends IndeterminateAnimation<T> = IndeterminateAnimation<T>> = () => ReturnType<I>;
    /**
     * Represents a series of movements applied on an object
     * @template T The type of data this animation will interpolate through
     */
    export class Animation<T extends object = {}> {
        #private;
        /**
         * A simplified representation of this animation
         */
        get animationSkeleton(): Omit<AnimationSkeleton<T>, "keyframes"> & {
            keyframes: (TimeBasedKeyframe & {
                data: MayBeFunctionWrapped<T, []>;
            })[];
        };
        /**
         * The total duration of this animation
         */
        get duration(): number;
        /**
         * A function that will be called in order to interpolate between two keyframes
         */
        get interpolationFunction(): (start: T, end: T, interpolationFactor: number) => T;
        /**
         * Creates a new animation whose only keyframe is the provided one. Serves to create an animation with no movement (effectively a still image)
         * @param data The keyframe's data
         */
        static createStillFrame<T extends object = {}>(data: T): Animation<T>;
        /**
         * Creates an animation whose keyframes are indeterminate
         * @param animationSkeleton A simplified representation of the animation that may be wrapped within a function
         * @returns A function whose only parameter is the same as the `Animation` constructor's second parameter.
         * This function evaluates the keyframes, thus creating an `Animation` object, and returns it.
         */
        static createIndeterminateAnimation<T extends object = {}>(animationSkeleton: MayBeFunctionWrapped<AnimationSkeleton<T>>): IndeterminateAnimation<T>;
        /**
         * `*It's a constructor. It constructs.`
         * @param animationSkeleton A simplified representation of the animation this object is to represent
         * @param interpolationFunction A function that will be called in order to interpolate between two keyframes. The time value passed to it will have already been transformed in accordance to the specified easing function
         */
        constructor(animationSkeleton: AnimationSkeleton<T>, interpolationFunction: (start: T, end: T, interpolationFactor: number) => T);
    }
    /**
     * A utility class for playing animations
     * @template T The kind of data this animation will be interpolating through
     * @template K The names of the animations in this manager
     */
    export class AnimationManager<T extends object = {}, K extends string = string> {
        #private;
        /**
         * `It's a constructor. It constructs.`
         */
        constructor(animations: Record<K, Animation<T> | BoundIndeterminateAnimation<T>>);
        /**
         * Animations can have "dynamic" keyframes that change, but evaluating such keyframes every draw often leads to broken results.
         * To remedy this, we determine all the keyframes ahead of time for this instance of the animation.
         * @param name The name of the animation which is to be started
         * @returns A function that can be used to determine the state of the animated object at a specified time
         *
         * **Returned function:**
         *
         * Determines the state of the animated object at a specified time
         * @param time A time at which to evaluate the animation, in ms. `1` is 1ms after the animation's start, not the animation's end
         * @param overflowReturnsLastFrame Whether or not to return the last keyframe if a time beyond the animation's duration is passed
         * @returns The state of the animated object at the specified time, or `null` if the time is beyond the animation's duration
         */
        start(name: K): <B extends boolean>(time: number, overflowReturnsLastFrame: B) => B extends true ? T | undefined : srvsdbx_ErrorHandling.Maybe<T>;
        /**
         * Fetches an animation instance. If this animation isn't currently running, it will be started
         * @param name The name of the animation to fetch
         * @returns A pair whose first element is the resolved version of the animation and whose
         * second element is its `evaluate` function.
         */
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
        }, <B extends boolean>(time: number, overflowReturnsLastFrame: B) => B extends true ? T | undefined : srvsdbx_ErrorHandling.Maybe<T>];
        /**
         * Fetches an animation instance's `evaluate` function, starting the animation if it isn't already
         * @param name The name of the animation to fetch
         * @returns A function that, when called with a certain time value, will determine the state of
         * the animated object at that time
         */
        fetch(name: K): <B extends boolean>(time: number, overflowReturnsLastFrame: B) => B extends true ? T | undefined : srvsdbx_ErrorHandling.Maybe<T>;
        /**
         * Given an animation's name, returns whether that animation is currently active
         * @param name The name of the animation to query
         */
        has(name: K): boolean;
        /**
         * Removes an animation's instance from memory. Calling this isn't mandatory, but recommended
         * @param name The animation's name
         */
        end(name: K): void;
        /**
         * Removes all active animations from memory
         */
        endAll(): void;
    }
    export {};
}
