// Particles
//#region
/**
 * A simple representation of a particle
 */
interface SimpleParticle extends SimpleImport {
    /**
     * A path to this particle's images
     */
    readonly images: string[],
    /**
     * The length of time this particle will exist for
     */
    readonly lifetime: MayBeFunctionWrapped<number>,
    /**
     * Pragmatically, a scale factor for this particle's physics: a value of 1 is normal 0.5 is half speed, etc
     */
    readonly drag: MayBeFunctionWrapped<number>,
    /**
     * The angular velocity at which this particle spins, in radians per second
     */
    readonly angularVelocity: MayBeFunctionWrapped<number>,
    /**
     * Information about the original size of this particle; `scale` applies itself to this
     */
    readonly baseSize: {
        /**
         * The "normal" width of this particle
         */
        readonly width: MayBeFunctionWrapped<Dimension>,
        /**
         * The "normal" height of this particle
         */
        readonly height: MayBeFunctionWrapped<Dimension>;
    },
    /**
     * Information about the scaling of this particle's image.
     */
    readonly scale: {
        /**
         * The scale this image starts at
         */
        readonly start: MayBeFunctionWrapped<number>,
        /**
         * The scale this image ends at
         */
        readonly end: MayBeFunctionWrapped<number>,
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp?: srvsdbx_Animation.EasingFunction;
    } | MayBeFunctionWrapped<number, [Particle]>,
    /**
     * Information about the opacity of this particle's image.
     */
    readonly alpha: {
        /**
         * The opacity this image starts at
         */
        readonly start: MayBeFunctionWrapped<number>,
        /**
         * The opacity this image ends at
         */
        readonly end: MayBeFunctionWrapped<number>,
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp?: srvsdbx_Animation.EasingFunction;
    } | MayBeFunctionWrapped<number, [Particle]>,
    /**
     * The color to tint this image. While it can have an alpha channel, it's better to use the `alpha` property to do this
     */
    readonly tint: MayBeFunctionWrapped<string>,
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     */
    readonly subLayer?: number;
};

/**
 * Represents the generalization of a type of particle
 */
class ParticlePrototype extends ImportedObject {
    /**
     * The `ImageSrcPair` containing this particle's image
     */
    readonly #image: srvsdbx_AssetManagement.ImageSrcPair[];
    /**
     * The `ImageSrcPair` containing this particle's image
     */
    get image() { return this.#image; }

    /**
     * The length of time this particle will exist for
     */
    #lifetime: SimpleParticle["lifetime"];
    /**
     * The length of time this particle will exist for
     */
    get lifetime() { return this.#lifetime; }

    /**
     * Pragmatically, a scale factor for this particle's physics: a value of 1 is normal 0.5 is double speed, etc
     */
    #drag: SimpleParticle["drag"];
    /**
     * Pragmatically, a scale factor for this particle's physics: a value of 1 is normal 0.5 is double speed, etc
     */
    get drag() { return this.#drag; }

    /**
     * The angular velocity at which this particle spins
     */
    #angularVelocity: SimpleParticle["angularVelocity"];
    /**
     * The angular velocity at which this particle spins
     */
    get angularVelocity() { return this.#angularVelocity; }

    /**
     * Information about the original size of this particle; `scale` applies itself to this
     */
    #baseSize: SimpleParticle["baseSize"];
    /**
     * Information about the original size of this particle; `scale` applies itself to this
     */
    get baseSize() { return this.#baseSize; }

    /**
     * Information about the scaling of this particle's image
     */
    #scale: SimpleParticle["scale"];
    /**
     * Information about the scaling of this particle's image
     */
    get scale() { return this.#scale; }

    /**
     * Information about the opacity of this particle's image
     */
    #alpha: SimpleParticle["alpha"];
    /**
     * Information about the opacity of this particle's image
     */
    get alpha() { return this.#alpha; }

    /**
     * The color to tint this image
     */
    #tint: SimpleParticle["tint"];
    /**
     * The color to tint this image
     */
    get tint() { return this.#tint; }

    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     */
    #subLayer: SimpleParticle["subLayer"];
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     */
    get subLayer() { return this.#subLayer; }

    /**
     * Takes a simplified representation of a firearm and converts it into a more rigorous one
     * @param obj The `SimpleParticle` object to parse
     * @returns A new `ParticlePrototype`
     */
    static async from(obj: SimpleParticle): Promise<srvsdbx_ErrorHandling.Result<ParticlePrototype, srvsdbx_Errors.SandboxError[]>> {
        const errors: srvsdbx_Errors.SandboxError[] = [],
            images = await srvsdbx_AssetManagement.loadImageArray(obj.images, errors, `${obj.includePath}/`);

        if (!errors.length) {
            return {
                res: new ParticlePrototype(
                    obj.name,
                    obj.displayName,
                    obj.objectType,
                    obj.includePath,
                    obj.namespace,
                    obj.targetVersion,
                    images as srvsdbx_AssetManagement.ImageSrcPair[],
                    obj.lifetime,
                    obj.drag,
                    obj.angularVelocity,
                    obj.baseSize,
                    obj.scale,
                    obj.alpha,
                    obj.tint,
                    obj.subLayer,
                )
            };
        }

        return { err: errors };
    }

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(
        name: ImportedObject["name"],
        displayName: ImportedObject["displayName"],
        objectType: ImportedObject["objectType"],
        includePath: ImportedObject["includePath"],
        namespace: ImportedObject["namespace"],
        targetVersion: ImportedObject["targetVersion"],
        image: ParticlePrototype["image"],
        lifetime: ParticlePrototype["lifetime"],
        drag: ParticlePrototype["drag"],
        angularVelocity: ParticlePrototype["angularVelocity"],
        baseSize: ParticlePrototype["baseSize"],
        scale: ParticlePrototype["scale"],
        alpha: ParticlePrototype["alpha"],
        tint: ParticlePrototype["tint"],
        subLayer: ParticlePrototype["subLayer"],
    ) {
        super(name, displayName, objectType, targetVersion, namespace, includePath);

        const size = gamespace.PLAYER_SIZE;

        function autoOrScale(dim: Dimension) {
            return dim == "auto" ? dim : dim * size;
        }

        this.#image = image;
        this.#lifetime = lifetime;
        this.#drag = drag;
        this.#angularVelocity = angularVelocity;
        this.#baseSize = {
            width: () => autoOrScale(extractValue(baseSize.width)),
            height: () => autoOrScale(extractValue(baseSize.height))
        };
        this.#scale = scale;
        this.#alpha = alpha;
        this.#tint = tint;
        this.#subLayer = subLayer;
    }

    /**
     * Creates a new `Particle` from this prototypes
     * @param position The position to spawn this particle at
     * @param angle An angle for this particle to face
     * @returns The created particle
     */
    create(
        position: srvsdbx_Geometry.Point2D,
        angle: number
    ) {
        return new Particle(
            this,
            position,
            angle
        );
    }
}

/**
 * Represents a specific particle in the game world
 */
class Particle
    extends Generic
    implements Destroyable {
    /**
     * The timestamp this particle was created at
     */
    readonly #created = gamespace.currentUpdate;
    /**
     * The timestamp this particle was created at
     */
    get created() { return this.#created; }

    /**
     * The prototype this particle is based
     */
    readonly #prototype: ParticlePrototype;
    /**
     * The prototype this particle is based
     */
    get proto() { return this.#prototype; }

    /**
     * The lifetime determined for this specific particle
     */
    #lifetime: number;
    /**
     * The lifetime determined for this specific particle
     */
    get lifetime() { return this.#lifetime; }

    /**
     * Information about the size this specific particle starts at
     */
    readonly #baseSize: { readonly [K in keyof ParticlePrototype["baseSize"]]: ExtractWrapped<(ParticlePrototype["baseSize"] & {})[K]> };
    /**
     * Information about the size this specific particle starts at
     */
    get baseSize() { return this.#baseSize; }

    /**
     * Information about the scaling of this specific particle's image
     */
    readonly #scale: {
        /**
         * The scale this image starts at
         */
        readonly start: number,
        /**
         * The scale this image ends at
         */
        readonly end: number,
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp: srvsdbx_Animation.EasingFunction;
    } | MayBeFunctionWrapped<number, [Particle]>;
    /**
     * Information about the scaling of this specific particle's image
     */
    get scale() { return this.#scale; }

    /**
     * Information about the opacity of this specific particle's image
     */
    readonly #alpha: {
        /**
         * The opacity this image starts at
         */
        readonly start: number,
        /**
         * The opacity this image ends at
         */
        readonly end: number,
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp: srvsdbx_Animation.EasingFunction;
    } | MayBeFunctionWrapped<number, [Particle]>;
    /**
     * Information about the opacity of this specific particle's image
     */
    get alpha() { return this.#alpha; }

    /**
     * The color to tint this particle's image
     */
    #tint: string;
    /**
     * The color to tint this particle's image
     */
    get tint() { return this.#tint; }

    /**
     * The drag for this particle
     */
    #drag: number;
    /**
     * The drag for this particle
     */
    get drag() { return this.#drag; }

    /**
     * The angular drag for this particle
     */
    #rotDrag: number;
    /**
     * The angular drag for this particle
     */
    get rotDrag() { return this.#rotDrag; }

    /**
     * Either a scale factor that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    #forcedScale: srvsdbx_ErrorHandling.Maybe<number> = srvsdbx_ErrorHandling.Nothing;
    /**
     * Either a scale factor that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    get forcedScale() { return this.#forcedScale; }

    /**
     * Either an opacity that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    #forcedAlpha: srvsdbx_ErrorHandling.Maybe<number> = srvsdbx_ErrorHandling.Nothing;
    /**
     * Either an opacity that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    get forcedAlpha() { return this.#forcedAlpha; }

    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     */
    #subLayer: number;
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     *
     * - `get`: Retrieves this particle's sublayer
     *
     * - `set`: Sets this particle's sublayer to the given value if it is not `NaN`
     */
    get subLayer() { return this.#subLayer; }
    set subLayer(v) { !Number.isNaN(v) && (this.#subLayer = v); }

    /**
     * The angle this casing starts at
     */
    #initialAngle: number;

    /**
     * `* It's a constructor. It constructs.`
     * @param proto The prototype this particle is based
     * @param position At what position to spawn this particle
     */
    constructor(
        proto: ParticlePrototype,
        position: srvsdbx_Geometry.Point2D,
        angle: number
    ) {
        const image = pickRandomInArray(proto.image).asset,
            dimWidth = extractValue(proto.baseSize.width),
            dimHeight = extractValue(proto.baseSize.height),
            {
                width,
                height
            } = srvsdbx_AssetManagement.determineImageDimensions(
                image,
                {
                    width: dimWidth,
                    height: dimHeight
                }
            ),
            body = new srvsdbx_Geometry.Rectangle(
                srvsdbx_Geometry.Vector2D.zeroPoint(),
                width, height
            ),
            lifetime = extractValue(proto.lifetime);

        super(
            body,
            p5 => {
                if (this.destroyed) return;

                const body = this.body;

                p5.push();

                p5.translate(body.origin.x, body.origin.y);
                p5.rotate(this.angle);

                p5.noStroke();
                p5.noFill();

                p5.imageMode(p5.CENTER);
                p5.rectMode(p5.CENTER);

                const scaleFactor = this.getCalculatedScale();
                p5.scale(scaleFactor);

                const color = p5.color(this.tint);
                color.setAlpha(this.getCalculatedAlpha());

                p5.tint(color);

                p5.image(
                    image,
                    0, 0,
                    width, height
                );

                p5.pop();

                gamespace.drawDebug(
                    p5,
                    "PARTICLE",
                    () => {
                        p5.push();

                        p5.rectMode(p5.CENTER);
                        p5.translate(body.origin.x, body.origin.y);
                        p5.rotate(this.angle);
                        p5.scale(scaleFactor);

                        p5.rect(
                            0, 0,
                            width, height
                        );

                        p5.pop();

                    },
                    void 0,
                    this
                );
            },
            position,
            angle
        );

        this.#initialAngle = angle;

        this.collidable = CollisionLevels.NONE;

        this.#prototype = proto;
        this.#lifetime = lifetime;
        this.#baseSize = {
            width: dimWidth,
            height: dimHeight
        };

        this.#scale = typeof proto.scale == "object" ? {
            start: extractValue(proto.scale.start),
            end: extractValue(proto.scale.end),
            interp: proto.scale.interp ?? srvsdbx_Animation.easingFunctions.linterp
        } : proto.scale;

        this.#alpha = typeof proto.alpha == "object" ? {
            start: extractValue(proto.alpha.start),
            end: extractValue(proto.alpha.end),
            interp: proto.alpha.interp ?? srvsdbx_Animation.easingFunctions.linterp
        } : proto.alpha;

        this.#tint = extractValue(proto.tint);
        this.#drag = extractValue(proto.drag);
        this.#rotDrag = this.#drag / 2;

        this.#subLayer = proto.subLayer ?? 0;

        this.angularVelocityMap.set("intrinsic", extractValue(proto.angularVelocity));

        gamespace.objects.particles.set(this.id, this);
    }

    /**
     * A version of the method it overrides that allows time-scaling
     */
    override update() {
        if (this.destroyed) return;

        const deltaTime = gamespace.currentUpdate - gamespace.lastUpdate,
            age = gamespace.currentUpdate - this.#created,
            vel = this.compileVelocities();

        if (age >= this.#lifetime) return this.destroy();

        if (!this.parent) {
            this.body.translate({
                x: vel.x * deltaTime * this.#drag,
                y: vel.y * deltaTime * this.#drag
            });

            this.angle = srvsdbx_Math.normalizeAngle(this.#initialAngle + age * this.#rotDrag * this.compileAngularVelocities() / 1000, "radians");

            this.layer += vel.z * deltaTime;
        }
    }

    /**
     * Calculates the scale at which this particle would be drawn and returns it
    */
    getCalculatedScale() {
        return this.#forcedScale ?? (
            typeof this.#scale == "object" ?
                this.#scale.interp(
                    this.#scale.start,
                    this.#scale.end,
                    (gamespace.currentUpdate - this.#created) / this.#lifetime
                )
                : extractValue(this.#scale, this)
        );
    }

    /**
     * Force a scale value onto this particle, overriding default behavior
     * @param scale The scale factor to force
     */
    forceScale(scale: number) {
        if (!Number.isNaN(scale)) this.#forcedScale = scale;
    }

    /**
     * Undos a forced scale factor applied with `forceScale`
     */
    relaxScale() {
        this.#forcedScale = srvsdbx_ErrorHandling.Nothing;
    }

    /**
     * Calculates the opacity at which this particle would be drawn and returns it
     */
    getCalculatedAlpha() {
        return 255 * (this.#forcedAlpha ?? (
            typeof this.#alpha == "object" ?
                this.#alpha.interp(
                    this.#alpha.start,
                    this.#alpha.end,
                    (gamespace.currentUpdate - this.#created) / this.#lifetime
                )
                : extractValue(this.#alpha, this)
        ));
    }

    /**
     * Force an opacity onto this particle, overriding default behavior
     * @param alpha The opacity to force
     */
    forceAlpha(alpha: number) {
        if (!Number.isNaN(alpha)) this.#forcedAlpha = alpha;
    }

    /**
     * Undos a forced opacity applied with `forceAlpha`
     */
    relaxAlpha() {
        this.#forcedAlpha = srvsdbx_ErrorHandling.Nothing;
    }

    /**
     * Identical to the method it overrides, but clears particle-specific object fields
     */
    override destroy() {
        if (this.destroyed) return;
        gamespace.objects.particles.delete(this.id);
        super.destroy();

        // @ts-expect-error
        this.#prototype = this.#alpha = this.#scale = void 0;
    }
}

type ParticleEmitterState = {
    /**
     * The last timestamp this emitter spawned particles
     */
    lastParticleSpawn: number,
    /**
     * How many particles will be spawned next wave
     */
    spawnCount: number,
    /**
     * The amount of time that will be waited before spawning
     * the next wave
     */
    spawnDelay: number;
};

/**
 * Represents an emitter of particles
 *
 * A particle emitter is simply an object whose sole
 * purpose is to spawn particles, and to do so in
 * accordance to certain parameters: frequency, variance,
 * etc
 *
 * @template S The type of the state object
 */
class ParticleEmitter<
    S extends ParticleEmitterState = ParticleEmitterState
> implements Destroyable {
    /**
     * A `bigint` identifying this emitter
     */
    readonly #id = generateId();
    /**
     * A `bigint` identifying this emitter
     */
    get id() { return this.#id; }

    /**
     * The type of particles this emitter can spawn
     */
    readonly #types: ParticlePrototype[];
    /**
     * The type of particles this emitter can spawn
     */
    get types() { return this.#types; }

    /**
     * The timestamp this emitter was created
     */
    readonly #created = gamespace.currentUpdate;
    /**
     * The timestamp this emitter was created
     */
    get created() { return this.#created; }

    /**
     * This is used to store information that can
     * later be consulted in order to modify this emitter's
     * behavior.
     *
     * This can be used to have more control over the specifics
     * of the emitter
     */
    readonly #state: S;
    /**
     * This is used to store information that can
     * later be consulted in order to modify this emitter's
     * behavior.
     *
     * This can be used to have more control over the specifics
     * of the emitter
     */
    get state() { return this.#state; }

    /**
     * An object storing configuration information about this emitter
     */
    readonly #configuration: {
        /**
         * How long after a particle's spawn this emitter should wait
         * before spawning another
         */
        readonly spawnDelay: MayBeFunctionWrapped<number, [S]>,
        /**
         * The number of particles to spawn on the next update
         */
        readonly spawnCount: MayBeFunctionWrapped<number, [S]>,
        /**
         * Either a point at which to spawn particles, or a shape representing
         * an area in which particles may be spawned
         *
         * (0, 0) corresponds to this emitter's position, and all units are in pixels
         */
        readonly area: MayBeFunctionWrapped<srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Shape, [S]>,
        /**
         * Information about the particles that are to be spawned
         */
        readonly particleProperties: MayBeFunctionWrapped<{
            /**
             * The angle this particles should start at
             */
            readonly angle?: MayBeFunctionWrapped<number>;
            /**
             * Optionally specify a scale factor to apply, *overriding the particle's
             * default one*
             */
            readonly scale?: MayBeFunctionWrapped<number>,
            /**
             * Optionally specify an opacity to apply, *overriding the particle's
             * default one*
             */
            readonly alpha?: MayBeFunctionWrapped<number>,
            /**
             * Optionally specify a velocity to apply
             */
            readonly velocity?: MayBeFunctionWrapped<srvsdbx_Geometry.Point2D>,
            /**
             * Optionally specify an angular velocity
             */
            readonly angularVelocity?: MayBeFunctionWrapped<number>;
        }, [S]>;
    };
    /**
     * An object storing configuration information about this emitter
     */
    get configuration() { return this.#configuration; }

    /**
     * The instance of the configuration currently being used
     */
    #currentConfig!: {
        [K in keyof ParticleEmitter["configuration"]]: ExtractWrapped<ParticleEmitter["configuration"][K]>
    };

    /**
     * This emitter's position
     */
    #position: srvsdbx_Geometry.Point3D;
    /**
     * This emitter's position
     */
    get position() { return this.#position; }

    /**
     * Whether this emitter has been destroyed
     */
    #destroyed = false;
    /**
     * Whether this emitter has been destroyed
     */
    get destroyed() { return this.#destroyed; }

    /**
     * Whether this emitter is currently enabled (active)
     */
    #enabled = true;
    /**
     * Whether this emitter is currently enabled (active)
     */
    get enabled() { return this.#enabled; }
    /**
     * Enables this emitter's spawning functionality
     */
    enable() { this.#enabled = true; }
    /**
     * Disables this emitter's spawning functionality
     */
    disable() { this.#enabled = false; }
    /**
     * Toggles this emitter's spawning functionality; if it was enabled, this
     * method disables it and vice versa
     */
    toggle() { this.#enabled = !this.#enabled; }

    /**
     * `* It's a constructor. It constructs.`
     *
     * Creates a new particle emitter
     * @param particleTypes The types of particles this emitter can spawn
     * @param configuration An object specifying different settings for this
     * emitter
     * @param state A "state" object that can be used in order to store
     * additional information that can then serve in controlling this emitter
     * more finely
     */
    constructor(
        position: srvsdbx_Geometry.Point3D,
        particleTypes: ParticlePrototype[],
        configuration: ParticleEmitter<S>["configuration"],
        state?: Omit<S, keyof ParticleEmitterState>
    ) {
        this.#position = position;
        this.#types = particleTypes;
        this.#configuration = configuration;

        this.#state = {
            ...(state ?? {}),
            lastParticleSpawn: 0,
            spawnDelay: 0,
            spawnCount: 1
        } as S;

        gamespace.objects.emitters.set(this.#id, this);
    }

    /**
     * Used internally to extract usable values out of the config
     */
    #reifyConfiguration() {
        const config = this.#configuration;

        return this.#currentConfig = {
            spawnDelay: extractValue(config.spawnDelay, this.#state),
            spawnCount: extractValue(config.spawnCount, this.#state),
            area: extractValue(config.area, this.#state),
            particleProperties: (() => {
                const props = extractValue(config.particleProperties, this.#state);

                return {
                    alpha: extractValue(props.alpha),
                    angle: extractValue(props.angle),
                    scale: extractValue(props.scale),
                    angularVelocity: extractValue(props.angularVelocity),
                    velocity: extractValue(props.velocity)
                };
            })()
        };
    }

    /**
     * Draws this particle emitter
     *
     * Only visible in debug mode, the area in which this emitter spawns
     * particles will be drawn
     * @param p5 The p5 instance to draw to
     */
    draw(p5: import("p5")) {
        const area = (this.#currentConfig ??= this.#reifyConfiguration()).area;

        gamespace.drawHitboxIfEnabled(
            p5,
            this.enabled ? "AREA_OF_EFFECT" : "DEFAULT",
            () => {
                p5.translate(this.#position.x, this.#position.y);

                if ("x" in area) {
                    p5.translate(area.x, area.y);

                    p5.rectMode(p5.CENTER);
                    p5.rotate(Math.PI / 4);
                    p5.rect(0, 0, 5, 20);
                    p5.rotate(Math.PI / 2);
                    p5.rect(0, 0, 5, 20);
                }

                if (area instanceof srvsdbx_Geometry.Rectangle) {
                    p5.rotate(area.angle);
                    p5.rect(area.origin.x, area.origin.y, area.width, area.height);
                }

                if (area instanceof srvsdbx_Geometry.Circle) {
                    p5.ellipse(area.origin.x, area.origin.y, 2 * area.radius, 2 * area.radius, 50);
                }
            });
    }

    /**
     * Updates this emitter's logic, spawning particles as needed
     */
    update() {
        if (!this.#enabled) return;

        if (gamespace.currentUpdate - this.#state.lastParticleSpawn >= this.#state.spawnDelay) {
            const newConfig = this.#reifyConfiguration(),
                area = newConfig.area;

            for (let i = 0; i < newConfig.spawnCount; i++) {
                const spawnPoint = srvsdbx_Geometry.Vector3D.plus(
                    this.#position,
                    srvsdbx_Geometry.Vector3D.fromPoint2D(
                        "x" in area
                            ? area
                            : area instanceof srvsdbx_Geometry.Rectangle
                                ? (() => {
                                    const base = new srvsdbx_Geometry.Vector2D(
                                        Math.random() * area.width,
                                        Math.random() * area.height
                                    );

                                    base.direction += area.angle;

                                    return base.plus(area.origin, true).toPoint2D();
                                })()
                                : srvsdbx_Geometry.Vector2D.fromPolarToPt(
                                    srvsdbx_Math.randomAngle(),
                                    srvsdbx_Math.bounds_random(0, area.radius)
                                )
                    )
                ),
                    properties = newConfig.particleProperties,

                    particle = pickRandomInArray(this.#types).create(spawnPoint, properties.angle ?? 0);

                if (properties.angularVelocity) particle.angularVelocityMap.set("emitter", properties.angularVelocity);
                if (properties.velocity) particle.velocityMap.set("emitter", { x: properties.velocity.x, y: properties.velocity.y, z: 0 });
                if (properties.alpha) particle.forceAlpha(properties.alpha);
                if (properties.scale) particle.forceScale(properties.scale);
            }

            this.#state.spawnDelay = newConfig.spawnDelay;
            this.#state.spawnCount = newConfig.spawnCount;
            this.#state.lastParticleSpawn = gamespace.currentUpdate;
        }
    }

    destroy() {
        if (this.#destroyed) return;
        gamespace.objects.emitters.delete(this.#id);
        this.#destroyed = true;

        //@ts-expect-error
        this.#configuration = this.#currentConfig = this.#position = this.#types = this.#state = void 0;
    }
}

//#endregion

// Decals
//#region
/**
 * A simplified representation of a decal
 */
interface SimpleDecal extends SimpleImport {
    /**
     * A path to the decal's image
     */
    readonly image: string;
    /**
     * The size of this decal
     */
    readonly size: {
        /**
         * The decal's width
         */
        readonly width: MayBeFunctionWrapped<Dimension>,
        /**
         * The decal's height
         */
        readonly height: MayBeFunctionWrapped<Dimension>;
    };
    /**
     * The color to tint this decal
     */
    readonly tint: MayBeFunctionWrapped<string>;
}

/**
 * Represents the generalization of a certain type of decal
 */
class DecalPrototype extends ImportedObject {
    /**
     * A path to the decal's image
     */
    readonly #image: srvsdbx_AssetManagement.ImageSrcPair;
    /**
     * A path to the decal's image
     */
    get image() { return this.#image; }

    /**
     * The size of this decal
     */
    readonly #size: {
        /**
         * The decal's width
         */
        readonly width: MayBeFunctionWrapped<Dimension>,
        /**
         * The decal's height
         */
        readonly height: MayBeFunctionWrapped<Dimension>;
    };
    /**
     * The size of this decal
     */
    get size() { return this.#size; }

    /**
     * The color to tint this decal
     */
    #tint: MayBeFunctionWrapped<string>;
    /**
     * The color to tint this decal
     */
    get tint() { return this.#tint; }

    /**
     * Takes a simplified representation of a decal and converts it into a more rigorous one
     * @param obj The `SimpleDecal` object to parse
     * @returns A new `DecalPrototype`
     */
    static async from(obj: SimpleDecal): Promise<srvsdbx_ErrorHandling.Result<DecalPrototype, srvsdbx_Errors.SandboxError[]>> {
        const errors: srvsdbx_Errors.SandboxError[] = [],
            image = srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${obj.includePath}/${obj.image}`),
                srvsdbx_ErrorHandling.identity,
                e => errors.push(e)
            );

        if (!errors.length) {
            return {
                res: new DecalPrototype(
                    obj.name,
                    obj.displayName,
                    obj.objectType,
                    obj.targetVersion,
                    obj.namespace,
                    obj.includePath,
                    image as srvsdbx_AssetManagement.ImageSrcPair,
                    obj.size,
                    obj.tint
                )
            };
        }

        return { err: errors };
    }

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(
        name: ImportedObject["name"],
        displayName: ImportedObject["displayName"],
        objectType: ImportedObject["objectType"],
        targetVersion: ImportedObject["targetVersion"],
        namespace: ImportedObject["namespace"],
        includePath: ImportedObject["includePath"],
        image: DecalPrototype["image"],
        size: DecalPrototype["size"],
        tint: DecalPrototype["tint"],
    ) {
        super(name, displayName, objectType, targetVersion, namespace, includePath);

        const pSize = gamespace.PLAYER_SIZE;

        function autoOrScale(dim: Dimension) {
            return dim == "auto" ? dim : dim * pSize;
        }

        this.#image = image;
        this.#size = {
            width: () => autoOrScale(extractValue(size.width)),
            height: () => autoOrScale(extractValue(size.height))
        };
        this.#tint = tint;
    }

    /**
     * Creates a new `Decal` from this prototypes
     * @param position The position to spawn this decal at
     * @param angle An angle for this decal to face
     * @returns The created decal
     */
    create(
        position: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point3D,
        angle: number
    ) {
        return new Decal(
            this,
            position,
            angle
        );
    }
}

/**
 * Represents a decal in the game world
 */
class Decal implements Destroyable {
    /**
     * The `DecalPrototype` this object is based on
     */
    readonly #prototype: DecalPrototype;
    /**
     * The `DecalPrototype` this object is based on
     */
    get prototype() { return this.#prototype; }

    /**
     * The position of this decal
     */
    #position: srvsdbx_Geometry.Point3D;
    /**
     * The position of this decal
     */
    get position() { return this.#position; }

    /**
     * The angle of this decal
     */
    #angle: number;
    /**
     * The angle of this decal
     */
    get angle() { return this.#angle; }

    /**
     * The dimensions of this decal
     */
    readonly #dimensions: {
        /**
         * The decal's width
         */
        readonly width: Dimension,
        /**
         * The decal's height
         */
        readonly height: Dimension;
    };
    /**
     * The position of this decal
     */
    get dimensions() { return this.#dimensions; }

    /**
     * The actual dimensions of this decal, after all calculations have been done
     */
    readonly #finalDimensions: {
        /**
         * Its width
         */
        readonly width: number,
        /**
         * Its height
         */
        readonly height: number;
    };

    /**
     * This decal's tint
     */
    #tint: string;
    /**
     * This decal's tint
     */
    get tint() { return this.#position; }

    /**
     * This decal's id
     */
    #id = generateId();
    /**
     * This decal's id
     */
    get id() { return this.#id; }

    /**
     * Whether or not this decal has been destroyed
     */
    #destroyed = false;
    /**
     * Whether or not this decal has been destroyed
     */
    get destroyed() { return this.#destroyed; }

    /**
     * `* It's a constructor. It constructs.`
     * @param prototype The `DecalPrototype` this decal is based on
     */
    constructor(
        prototype: DecalPrototype,
        position: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point3D,
        angle: number
    ) {
        this.#prototype = prototype;
        const clone = srvsdbx_Geometry.Vector2D.clone(position);
        this.#position = { x: clone.x, y: clone.y, z: (position as srvsdbx_Geometry.Point3D).z ?? 0 };
        this.#angle = angle;

        this.#dimensions = {
            width: extractValue(prototype.size.width),
            height: extractValue(prototype.size.height)
        };

        this.#finalDimensions = srvsdbx_AssetManagement.determineImageDimensions(this.#prototype.image.asset, this.#dimensions);

        this.#tint = extractValue(prototype.tint);

        gamespace.objects.decals.set(this.#id, this);
    }

    /**
     * Draws this decal
     * @param p5 The gamespace's p5 instance
     */
    draw(p5: import("p5")) {
        p5.push();

        p5.translate(this.#position.x, this.#position.y);
        p5.rotate(this.#angle);

        p5.tint(this.#tint);

        p5.image(
            this.#prototype.image.asset,
            0,
            0,
            this.#finalDimensions.width,
            this.#finalDimensions.height
        );

        p5.pop();

        gamespace.drawDebug(
            p5,
            "DECAL",
            () => {
                p5.push();

                p5.rectMode(p5.CENTER);
                p5.translate(this.#position.x, this.#position.y);
                p5.rotate(this.#angle);

                p5.rect(0, 0, this.#finalDimensions.width, this.#finalDimensions.height);

                p5.pop();

            },
            void 0,
            {
                position: this.#position,
                angle: this.#angle,
                compileVelocities() {
                    return srvsdbx_Geometry.Vector3D.zeroVector();
                },
                compileAngularVelocities() {
                    return 0;
                },
            } as any
        );
    }

    /**
     * Similar in spirit to `Generic.destroy`, this method clears any object attributes from this object to encourage the GC to clean up
     */
    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true;

        // @ts-expect-error
        this.#dimensions = this.#finalDimensions = this.#position = this.#prototype = void 0;
        gamespace.objects.decals.delete(this.id);
    }
}
//#endregion