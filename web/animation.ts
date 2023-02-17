/**
 * A namespace containing various types and functions related to animation
 */
namespace srvsdbx_Animation {
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
        readonly time: number,
        readonly delay?: never,
        readonly fraction?: never;
    };
    type DelayFrame = {
        readonly time?: never,
        /**
         * The time between this keyframe and the last
         */
        readonly delay: number,
        readonly fraction?: never;
    };
    type FractionFrame = {
        readonly time?: never,
        readonly delay?: never,
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
        duration: number,
        /**
         * The keyframes associated with this animation
         */
        readonly keyframes: (Keyframe & { data: MayBeFunctionWrapped<K>; })[],
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
     * Augments a function object to include a default binding and a function to bind it to a certain set of bounds.
     * The default binding runs from `[0, 1]`
     * @param fn The function to bind
     * @returns The same object with two additional properties: `default` refers to the default binding, and `bindToBounds` allows
     * one to create a version of this curve bound to an interval of one's choosing.
     */
    function addBindings(fn: (a: number, b: number, t: number) => number) {
        type Extended = typeof fn & {
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

        (fn as Extended).default = fn.bind(easingFunctions, 0, 1);
        (fn as Extended).bindToBounds = (a: number, b: number) => fn.bind(easingFunctions, a, b);

        return fn as Extended;
    }

    /**
     * A collection of functions for easing, based on [this helpful reference](https://easings.net) and others
     *
     * For all functions, `t = 0` is guaranteed to return `a`, and `t = 1` is guaranteed to return `b`
     */
    export const easingFunctions = {
        /**
         * Linearly interpolates between two numbers
         * @param a The start value
         * @param b The end value
         * @param t The interpolation value
         * @returns The number at the specified point.\
         * `t = 0` is guaranteed to return `a`, and `t = 1` is guaranteed to return `b`.
         */
        linterp: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * t;
            }
        }),
        /**
         * Interpolates between two numbers with a slow start tending towards a super-linear progression that in turn decelerates\
         * [Reference](https://easings.net/#easeInSine)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInSine: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (1 - Math.cos((t * Math.PI) / 2));
            }
        }),
        /**
         * Interpolates between two numbers with a fast start tending towards a sub-linear progression that in turn decelerates\
         * [Reference](https://easings.net/#easeOutSine)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeOutSine: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * Math.sin((t * Math.PI) / 2);
            }
        }),
        /**
         * Interpolates between two numbers with a slow start and slow end that accelerates in the middle\
         * [Reference](https://easings.net/#easeInOutSine)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInOutSine: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (-(Math.cos(Math.PI * t) - 1) / 2);
            }
        }),
        /**
         * Interpolates between two numbers with a quite slow start and inversely fast end\
         * [Reference](https://easings.net/#easeInCubic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInCubic: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t * t * t);
            }
        }),
        /**
         * Interpolates between two numbers with a quite fast start and inversely slow end\
         * [Reference](https://easings.net/#easeOutCubic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeOutCubic: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (1 - (1 - t) ** 3);
            }
        }),
        /**
         * Interpolates between two numbers with a slow start and end but very fast middle\
         * [Reference](https://easings.net/#easeInOutCubic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInOutCubic: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * (1 - t), 3) / 2);
            }
        }),
        /**
         * Interpolates between two numbers with a very slow start and inversely fast end\
         * [Reference](https://easings.net/#easeInQuintic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInQuintic: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t * t * t * t * t);
            }
        }),
        /**
         * Interpolates between two numbers with a very fast start and inversely slow end\
         * [Reference](https://easings.net/#easeOutQuintic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeOutQuintic: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (1 - (1 - t) ** 3);
            }
        }),
        /**
         * Interpolates between two numbers with a slow start and end but extremely fast middle\
         * [Reference](https://easings.net/#easeInOutQuintic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInOutQuintic: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t < 0.5 ? 16 * t * t * t : 1 - Math.pow(-2 * (1 - t), 5) / 2);
            }
        }),
        /**
         * Interpolates between two numbers with a sluggish start and almost instant end\
         * [Reference](https://easings.net/#https://easings.net/#easeInCirc)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInCirc: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (1 - Math.sqrt(1 - (t * t)));
            }
        }),
        /**
         * Interpolates between two numbers with an almost instant start but sluggish end\
         * [Reference](https://easings.net/#easeOutCirc)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeOutCirc: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * Math.sqrt(1 - (t - 1) ** 2);
            }
        }),
        /**
         * Interpolates between two numbers with a slow start and end but discontinuous middle\
         * [Reference](https://easings.net/#easeInOutCirc)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInOutCirc: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t < 0.5
                    ? (1 - Math.sqrt(1 - (2 * t) ** 2)) / 2
                    : (Math.sqrt(1 - (-2 * (1 - t)) ** 2) + 1) / 2);
            }
        }),
        /**
         * Interpolates between two numbers with a wave of increasing amplitude that overshoots\
         * [Reference](https://easings.net/#https://easings.net/#easeInElastic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInElastic: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * ((-2) ** (10 * (t - 1)) * Math.sin(20 * Math.PI * (t - 1.075) / 3));
            }
        }),
        /**
         * Interpolates between two numbers with a wave of decreasing amplitude that overshoots\
         * [Reference](https://easings.net/#easeOutElastic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeOutElastic: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * ((2 ** (-10 * t) * Math.sin(2 * Math.PI * (t * 10 + 0.75) / 3)) + 1);
            }
        }),
        /**
         * Interpolates between two numbers with a wave that circles around `a` with increasing amplitude before jumping to circling around `b`, decreasing in amplitude
         * [Reference](https://easings.net/#easeInOutElastic)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInOutElastic: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t < 0.5
                    ? -(2 ** (10 * (2 * t - 1)) * Math.sin(80 * Math.PI * (t - 0.5625) / 9)) / 2
                    : (2 ** (-10 * (2 * t + 1)) * Math.sin(80 * Math.PI * (t - 0.5625) / 9)) / 2 + 1);
            }
        }),
        /**
         * Interpolates between two numbers with a slow start and fast end\
         * [Reference](https://easings.net/#https://easings.net/#easeInQuad)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInQuad: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t * t);
            }
        }),
        /**
         * Interpolates between two numbers with a fast start but slow end\
         * [Reference](https://easings.net/#easeOutQuad)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeOutQuad: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (1 - (1 - t) ** 2);
            }
        }),
        /**
         * Interpolates between two numbers with a slightly slow start and end, and a slightly fast middle
         * [Reference](https://easings.net/#easeInOutQuad)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInOutQuad: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t < 0.5
                    ? 2 * t * t
                    : 1 - 2 * (1 - t) ** 2);
            }
        }),
        /**
         * Interpolates between two numbers with a quite slow start and quite fast end\
         * [Reference](https://easings.net/#https://easings.net/#easeInQuart)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInQuart: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t * t * t * t);
            }
        }),
        /**
         * Interpolates between two numbers with a fast start but slow end\
         * [Reference](https://easings.net/#easeOutQuart)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeOutQuart: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (1 - (1 - t) ** 4);
            }
        }),
        /**
         * Interpolates between two numbers with a quite slow start and end, and a very fast middle
         * [Reference](https://easings.net/#easeInOutQuart)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInOutQuart: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t < 0.5
                    ? 8 * t * t * t * t
                    : 1 - 8 * (1 - t) ** 4);
            }
        }),
        /**
         * Interpolates between two numbers with a quite slow start and quite fast end\
         * [Reference](https://easings.net/#https://easings.net/#easeInExpo)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInExpo: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (2 ** (-10 * (1 - t)));
            }
        }),
        /**
         * Interpolates between two numbers with a fast start but slow end\
         * [Reference](https://easings.net/#easeOutExpo)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeOutExpo: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (1 - 2 ** (10 * (1 - t)));
            }
        }),
        /**
         * Interpolates between two numbers with a quite slow start and end, and a very fast middle
         * [Reference](https://easings.net/#easeInOutExpo)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInOutExpo: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t < 0.5
                    ? 2 ** (10 * (2 * t - 1) - 1)
                    : 1 - 2 ** (-10 * (2 * t - 1) - 1));
            }
        }),
        /**
         * Interpolates between two numbers with a slow start, overshoot and fast end\
         * [Reference](https://easings.net/#https://easings.net/#easeInBack)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInBack: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * ((Math.sqrt(3) * (t - 1) + t) * t * t);
            }
        }),
        /**
         * Interpolates between two numbers with a fast start, overshoot and slow end\
         * [Reference](https://easings.net/#easeOutBack)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeOutBack: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (1 + ((Math.sqrt(3) + 1) * t - 1) * (t - 1) ** 2);
            }
        }),
        /**
         * Interpolates between two numbers with overshoots at the start and end and a very fast middle
         * [Reference](https://easings.net/#easeInOutBack)
         * @param a The start value
         * @param b The end value
         * @param t The interpolation factor
         */
        easeInOutBack: addBindings(function(a: number, b: number, t: number) {
            switch (t) {
                case 0: return a;
                case 1: return b;
                default: return a + (b - a) * (t < 0.5
                    ? 4 * t * t * (3.6 * t - 1.3)
                    : 4 * (t - 1) ** 2 * (3.6 * t - 2.3) + 1);
            }
        }),
        /**
         * Creates a [cubic bézier curve](https://en.wikipedia.org/wiki/Bézier_curve#Cubic_Bézier_curves) based on two control points.\
         * Use [this website](https://cubic-bezier.com/) to help you visualize your curve if needed.
         * @param p1x The x-component of the first control point. Must be within `[0, 1]`
         * @param p1y The y-component of the first control point
         * @param p2x The x-component of the second control point. Must be within `[0, 1]`
         * @param p2y The y-component of the second control point
         * @returns An interpolation function accepting two bounds and an interpolation factor.
         */
        cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
            if (!srvsdbx_Math.checkBounds(p1x, 0, 1) || !srvsdbx_Math.checkBounds(p2x, 0, 1))
                throw new RangeError("The control points' x components must lie within the range [0, 1]");

            const p1 = new srvsdbx_Geometry.Vector2D(p1x, p1y),
                p2 = new srvsdbx_Geometry.Vector2D(p2x, p2y);

            return addBindings(function(a: number, b: number, t: number) {
                switch (t) {
                    case 0: return a;
                    case 1: return b;
                    default: return p1.lerp(p2, t).scale(3 * (1 - t), true).plus({ x: t * t, y: t * t }, true).scale(t, true).y;
                    /*
                        (((1 - t)P1 + t * P2) * 3(1 - t) + P3 * t^2) * t
                         ^^^^^^^^^^^^^^^^^^^^ lerp

                        P3 = (1, 1)
                        therefore:
                        t^2 * P3 = (t^2, t^2)
                    */
                }
            });
        },
        /**
         * Generates a [bézier curve](https://en.wikipedia.org/wiki/Bézier_curve) of an arbitrary degree.
         * @param points A series of control points. Note that the curve's endpoints are locked at (0, 0) and (1, 1),
         * and that the x components of every control point must lie within `[0, 1]`.
         * @returns An interpolation function accepting two bounds and an interpolation factor
         */
        bezier(...points: srvsdbx_Geometry.Point2D[]) {
            switch (points.length) {
                case 0: return this.linterp;
                case 2: return this.cubicBezier(points[0].x, points[0].y, points[1].x, points[1].y);
                default: {
                    const invalidPoints = points.map((p, i) => [p, i] as const).filter(([p]) => !srvsdbx_Math.checkBounds(p.x, 0, 1));

                    if (invalidPoints.length)
                        throw new RangeError(
                            `Invalid control points for bézier curve; all control points must have x components within [0, 1], but the following points did not:\n  ${invalidPoints.map(([p, i]) => `${srvsdbx_Geometry.Vector2D.prototype.toString.call(p)} (index: ${i})`).join("\n  ")}`
                        );

                    // We omit the (0, 0) control point, because any operations performed on it return (0, 0) anyways
                    // That means shifting our indexes by one
                    const controlPoints = [
                        ...points.map(srvsdbx_Geometry.Vector2D.fromPoint2D),
                        new srvsdbx_Geometry.Vector2D(1, 1)
                    ],
                        coefficients = srvsdbx_ErrorHandling.passAlongOrThrow(srvsdbx_Math.getBinomialCoefficients(points.length));

                    return addBindings(function(a: number, b: number, t: number) {
                        switch (t) {
                            case 0: return a;
                            case 1: return b;
                            // Based on https://en.wikipedia.org/wiki/Bézier_curve#Explicit_definition
                            default: return controlPoints.reduce(
                                (acc, point, index) => acc.plus(point.scale(Number(coefficients[++index]) * (1 - t) ** (controlPoints.length - (index)) * t ** (index)), true),
                                //                                                              ^^ see the comment about omitting (0, 0)
                                srvsdbx_Geometry.Vector2D.zeroVec()
                            ).y;

                        };
                    });
                }
            }
        }
    } as const;

    /**
     * Represents a function that, when called, will return an animation
     */
    export type IndeterminateAnimation<T extends object = {}> = (interpolationFunction: ConstructorParameters<typeof Animation<T>>[1]) => Animation<T>;

    /**
     * Represents a function for generating animations whose interpolation function has already been specified
     */
    export type BoundIndeterminateAnimation<T extends object = {}, I extends IndeterminateAnimation<T> = IndeterminateAnimation<T>> = () => ReturnType<I>;

    /**
     * Represents a series of movements applied on an object
     */
    export class Animation<T extends object = {}> {
        /**
         * A simplified representation of this animation
         */
        readonly #animationSkeleton: Omit<AnimationSkeleton<T>, "keyframes"> & { keyframes: (TimeBasedKeyframe & { data: MayBeFunctionWrapped<T>; })[]; };
        /**
         * A simplified representation of this animation
         */
        get animationSkeleton() { return this.#animationSkeleton; }

        /**
         * The total duration of this animation
         */
        readonly #duration: number;
        /**
         * The total duration of this animation
         */
        get duration() { return this.#duration; }

        /**
         * A function that will be called in order to interpolate between two keyframes
         */
        readonly #interpolationFunction: (start: T, end: T, interpolationFactor: number) => T;
        /**
         * A function that will be called in order to interpolate between two keyframes
         */
        get interpolationFunction() { return this.#interpolationFunction; }

        /**
         * Creates a new animation whose only keyframe is the provided one. Serves to create an animation with no movement (effectively a still image)
         * @param data The keyframe's data
         */
        static createStillFrame<T extends object = {}>(data: T) {
            return new srvsdbx_Animation.Animation(
                {
                    duration: 0,
                    keyframes: [{ fraction: 0, data: data }]
                },
                () => data as T
            );
        }

        /**
         * Creates an animation whose keyframes are indeterminate
         * @param animationSkeleton A simplified representation of the animation that may be wrapped within a function
         * @returns A function whose only parameter is the same as the `Animation` constructor's second parameter.
         * This function evaluates the keyframes, thus creating an `Animation` object, and returns it.
         */
        static createIndeterminateAnimation<T extends object = {}>(animationSkeleton: MayBeFunctionWrapped<AnimationSkeleton<T>>): IndeterminateAnimation<T> {
            return interpolationFunction => {
                return new this(extractValue(animationSkeleton), interpolationFunction);
            };
        }

        /**
         * `*It's a constructor. It constructs.`
         * @param animationSkeleton A simplified representation of the animation this object is to represent
         * @param interpolationFunction A function that will be called in order to interpolate between two keyframes. The time value passed to it will have already been transformed in accordance to the specified easing function
         */
        constructor(animationSkeleton: AnimationSkeleton<T>, interpolationFunction: (start: T, end: T, interpolationFactor: number) => T) {
            this.#animationSkeleton = { ...animationSkeleton } as any;
            this.#interpolationFunction = interpolationFunction;

            const keyframes = animationSkeleton.keyframes,
                fractions = keyframes.filter(k => k.fraction !== void 0).length;

            if (fractions && fractions != keyframes.length) throw new Error("Cannot mix fractional keyframes with other types; an animation must either be entirely composed of fractional keyframes or have none.");

            // If none of the keyframes are specified as fractions, then we can re-calculate the animation's overall duration
            this.#duration = this.#animationSkeleton.duration = fractions
                ? animationSkeleton.duration
                : keyframes.reduce(
                    (acc, k) => k.delay !== void 0 ? acc + k.delay : Math.max(acc, k.time!),
                    0
                );

            this.#animationSkeleton.keyframes = (keyframes.map((k, i, a) => {
                switch (true) {
                    case k.time !== void 0: return k;
                    case k.delay !== void 0: return {
                        data: k.data,
                        easing: k.easing,
                        time: (a[i - 1]?.time ?? 0) + k.delay!
                    };
                    case k.fraction !== void 0: return {
                        data: k.data,
                        easing: k.easing,
                        time: animationSkeleton.duration * k.fraction!
                    };
                }
            }) as (TimeBasedKeyframe & { data: MayBeFunctionWrapped<T>; })[]).sort((a, b) => a.time - b.time);
        }
    }

    /**
     * A utility class for playing animations
     */
    export class AnimationManager<T extends object = {}, K extends string = string>{
        /**
         * An object whose keys are names by which to identify the animations (the values)
         */
        readonly #animations: Record<K, Animation<T> | BoundIndeterminateAnimation<T>>;

        /**
         * A map whose keys are the names of animations this manager has started, and whose values are "resolved" versions of those animations and a function to determine the state of the animated object at a given time
         */
        readonly #activeAnimations: Map<
            K,
            [
                Omit<
                    Animation<T>,
                    "animationSkeleton"
                > & {
                    animationSkeleton: Omit<
                        Animation<T>["animationSkeleton"],
                        "keyframes"
                    > & {
                        keyframes: (
                            Omit<
                                Animation<T>["animationSkeleton"]["keyframes"][number],
                                "data"
                            > & {
                                data: T;
                            }
                        )[];
                    };
                },
                ReturnType<AnimationManager<T, K>["start"]>
            ]
        >;

        /**
         * `It's a constructor. It constructs.`
         */
        constructor(animations: Record<K, Animation<T> | BoundIndeterminateAnimation<T>>) {
            this.#animations = { ...animations };
            this.#activeAnimations = new Map;
        }

        /**
         * Used internally to determine every keyframe of a given animation, creating an "instance" of that animation
         * @param animation The animation to determine
         * @returns A version of the animation whose keyframes are all non-dynamic
         */
        #resolveKeyframes(animation: Animation<T>) {
            return {
                animationSkeleton: {
                    duration: animation.animationSkeleton.duration,
                    repetition: animation.animationSkeleton.repetition,
                    keyframes: animation.animationSkeleton.keyframes.map(k => ({
                        time: k.time,
                        easing: k.easing,
                        data: extractValue(k.data)
                    }))
                },
                duration: animation.duration,
                interpolationFunction: animation.interpolationFunction
            };
        }

        /**
         * Animations can have "dynamic" keyframes that change, but evaluating such keyframes every draw often leads to broken results. To remedy this, we determine all the keyframes ahead of time for this instance of the animation.
         * @param name The name of the animation which is to be started
         * @returns A function that can be used to determine the state of the animated object at a specified time
         *
         * **Returned function:**\
         * Determines the state of the animated object at a specified time
         * @param time A time at which to evaluate the animation, in ms. `1` is 1ms after the animation's start, not the animation's end
         * @param overflowReturnsLastFrame Whether or not to return the last keyframe if a time beyond the animation's duration is passed
         * @returns The state of the animated object at the specified time, or `null` if the time is beyond the animation's duration
         */
        start(name: K) {
            const baseAnimation: Animation<T> = extractValue(this.#animations[name]),
                T = this;

            let animation = this.#resolveKeyframes(baseAnimation),
                iteration = 0;

            /**
             * Determines the state of the animated object at a specified time
             * @param time A time at which to evaluate the animation, in ms. `1` is 1ms after the animation's start, not the animation's end
             * @param overflowReturnsLastFrame Whether or not to return the last keyframe if a time beyond the animation's duration is passed
             * @returns The state of the animated object at the specified time, or `null` if the time is beyond the animation's duration
             */
            function evaluate<B extends boolean>(time: number, overflowReturnsLastFrame: B): B extends true ? T | undefined : srvsdbx_ErrorHandling.Maybe<T> {
                const keyframes = animation.animationSkeleton.keyframes,
                    l = keyframes.length,
                    last = keyframes.at(-1);

                // Modify the time value based on repetition
                const repetition = animation.animationSkeleton.repetition,
                    iterationLength = animation.duration + repetition?.delay!;

                if (
                    repetition && // repetition is enabled
                    time < iterationLength * repetition.iterations // the time is less than the overall duration
                ) {
                    let iter = Math.floor(time / iterationLength);

                    if (iter != iteration) { // If we're starting a new iteration, re-evaluate the animation's keyframes
                        iteration = iter;
                        animation = T.#resolveKeyframes(baseAnimation);
                    }

                    time %= iterationLength; // take the remainder of dividing the given time by a repetition's duration
                }

                if (time >= animation.duration) return overflowReturnsLastFrame ? last?.data : srvsdbx_ErrorHandling.Nothing as any;

                for (let i = 0; i < l; i++) {
                    const current = {
                        time: keyframes[i].time,
                        easing: keyframes[i].easing,
                        data: keyframes[i].data
                    };

                    if (current.time > time) {
                        const prev = keyframes[i ? i - 1 : keyframes.length - 1];
                        // If i is 0, then the previous keyframe is the last in the list

                        // If this is the first frame, there's nothing to interpolate, so just return the frame as-is,
                        // unless we're repeating, in which case we should interpolate between the current frame and the last one
                        return i || iteration != 0 ?
                            animation.interpolationFunction(
                                prev.data,
                                current.data,
                                (current.easing ??= srvsdbx_ErrorHandling.identity)((time - prev.time) / (current.time - prev.time))
                            )
                            : current.data;
                    }
                }

                return overflowReturnsLastFrame ? last?.data : srvsdbx_ErrorHandling.Nothing as any;
            };

            this.#activeAnimations.set(name, [animation, evaluate]);

            return evaluate;
        }

        /**
         * Fetches an animation instance's `evaluate` function, starting the animation if it isn't already
         * @param name The name of the animation to fetch
         */
        fetch(name: K) {
            return this.#activeAnimations.get(name)?.[1] ?? this.start(name);
        }

        /**
         * Given an animation's name, returns whether that animation is currently active
         * @param name The name of the animation to query
         */
        has(name: K) {
            return this.#activeAnimations.has(name);
        }

        /**
         * Removes an animation's instance from memory. Calling this isn't mandatory, but recommended
         * @param name The animation's name
         */
        end(name: K) {
            this.#activeAnimations.delete(name);
        }

        /**
         * Removes all active animations from memory
         */
        endAll() {
            this.#activeAnimations.clear();
        }
    }
}