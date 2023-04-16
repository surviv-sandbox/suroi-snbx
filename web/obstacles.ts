/**
 * The types of obstacles that exist; either circular ones or boxy ones
 */
type ObstacleTypes = "circle" | "rectangle";

/**
 * A simplified representation of an obstacle
 */
interface SimpleObstacle<
    S extends ParticleEmitterState & { readonly obstacle: Obstacle<ObstacleTypes, S>; }
    = ParticleEmitterState & { readonly obstacle: Obstacle<ObstacleTypes, any>; }
> extends SimpleImport {
    /**
     * Information about this obstacle's hitbox
     */
    readonly hitbox: {
        /**
         * Whether this obstacle uses a circular hitbox or a rectangular one
         */
        readonly type: "circle";
        /**
         * The radius of this obstacle's hitbox
        */
        readonly radius: MayBeFunctionWrapped<number>;
    } | {
        /**
         * Whether this obstacle uses a circular hitbox or a rectangular one
         */
        readonly type: "rectangle";
        /**
         * The dimensions of this obstacle's hitbox
         */
        readonly dimensions: {
            /**
             * The hitbox's width, in surviv units
             */
            readonly width: MayBeFunctionWrapped<Dimension>,
            /**
             * The hitbox's height, in surviv units
             */
            readonly height: MayBeFunctionWrapped<Dimension>;
        };
    },
    /**
     * A function that will be called in order to determine this obstacle's scale factor
     *
     * Most obstacles shrink in size as they take damage
     * @param health A number between 0 and 1 representing the ratio between the obstacle's current health and its max health; 0 is none, 1 is full
     * @returns A scale factor that will affect the obstacle's hitbox and visual size
     */
    scale(health: number): number,
    /**
     * Optionally specify a variety of `ParticleEmitter` configurations
     *
     * Each configuration will be turned into a fully-fledged `ParticleEmitter`
     * attached to the obstacle
     *
     * *All units are in surviv units!*
     */
    readonly emitters?: (
        ParticleEmitter<S>["configuration"] & {
            /**
             * Whether or not this emitter should spawn particles
             */
            readonly shouldSpawn?: MayBeFunctionWrapped<boolean, [S]>;
            /**
             * The types of particles this emitter spawns
             */
            readonly particleTypes: PrototypeReference<"particles">[];
            /**
             * An initial state to pass to the particle emitter
             */
            readonly initialState: Omit<S, keyof ParticleEmitterState>;
        }
    )[],
    /**
     * Optionally specify a scale factor to apply to this obstacle's image, relative to its hitbox
     *
     * For instance, a value of 2 will make this obstacle's image twice as large as its hitbox at all times
     */
    readonly imageScale?: number,
    /**
     * Whether this obstacle can be destroyed by conventional means (bullets, explosions, melee)
     */
    readonly destroyable: boolean,
    /**
     * Whether this obstacle can only be destroyed by melee weapons marked as "armor-piercing" (e.g. Axe, Katana)
     */
    readonly armorPlated: boolean,
    /**
     * Whether this obstacle can only be destroyed by melee weapons marked as "stone-piercing" (e.g. Sledgehammer)
     */
    readonly stonePlated: boolean,
    /**
     * Whether this obstacle can be collided with
     */
    readonly collidable: CollisionLevel,
    /**
     * Whether this obstacle's hitbox reflects bullets
     */
    readonly reflective: boolean,
    /**
     * Whether projectiles striking this obstacle will have a hit added to their hit count. Considered `false` if omitted.
     *
     * For most projectiles, they despawn after one hit, so this property effectively controls
     * whether or not this obstacle will destroy projectiles on contact.
     *
     * For a projectile that despawns after 2 hits, for example, this obstacle would only count
     * as one of those hits if this property was `true`
     */
    readonly skipProjectileHitIncrement?: boolean,
    /**
     * Information about a type of particle spawned when this obstacle takes damage
     */
    readonly hitParticle: {
        /**
         * The internal name of the particle spawned when this obstacle takes damage
         */
        readonly particle: PrototypeReference<"particles">,
        /**
         * How many of this particle should be spawned
         */
        readonly count: MayBeFunctionWrapped<number>;
    },
    /**
     * Information about a type of particle spawned when this obstacle is destroyed
     */
    readonly destroyParticle: {
        /**
         * The internal name of the particle spawned when this obstacle is destroyed
         */
        readonly particle: PrototypeReference<"particles">,
        /**
         * How many of this particle should be spawned
         */
        readonly count: MayBeFunctionWrapped<number>;
    },
    /**
     * An explosion that will be spawned when this obstacle is destroyed
     */
    readonly destructionExplosion?: PrototypeReference<"explosions">,
    /**
     * Information about a decal spawned on this obstacle's death
     */
    readonly residue?: {
        /**
         * The internal name of a decal spawned when this obstacle is destroyed
         */
        readonly decal: PrototypeReference<"decals">,
        /**
         * Whether destruction decals will have a random orientation. `false` if omitted.
         */
        readonly noRotate?: boolean;
    },
    /**
     * Optionally specify the sublayer this obstacle should occupy
     *
     * All obstacles are drawn above the player, but certain obstacles, such as trees,
     * should be drawn over others, such as bushes
     */
    readonly subLayer?: number,
    /**
     * How much health this obstacle starts off with
     */
    readonly baseHP: number,
    /**
     * An array of images, one of which will be chosen to be this obstacle's in-game rendition
     */
    readonly images: string[];
};

/**
 * Represents a certain type of obstacle
 */
class ObstaclePrototype<
    T extends ObstacleTypes = ObstacleTypes,
    S extends ParticleEmitterState & { readonly obstacle: Obstacle<ObstacleTypes, S>; }
    = ParticleEmitterState & { readonly obstacle: Obstacle<ObstacleTypes, any>; }
> extends ImportedObject {
    /**
     * The amount of HP obstacles of this type start off with
    */
    #baseHP: number;
    /**
     * The amount of HP obstacles of this type start off with
    */
    get baseHP() { return this.#baseHP; }

    /**
     * Whether or not this obstacle can be destroyed by players
     * or other sources of damage
     */
    #destroyable: boolean;
    /**
     * Whether or not this obstacle can be destroyed by players
     * or other sources of damage
     */
    get destroyable() { return this.#destroyable; }

    /**
     * Whether this obstacle can be collided with
     */
    readonly #collidable: CollisionLevel;
    /**
     * Whether this obstacle can be collided with
     */
    get collidable() { return this.#collidable; }

    /**
     * Whether projectiles striking this obstacle will have a hit added to their hit count. Considered `false` if omitted.
     *
     * For most projectiles, they despawn after one hit, so this property effectively controls
     * whether or not this obstacle will destroy projectiles on contact.
     *
     * For a projectile that despawns after 2 hits, for example, this obstacle would only count
     * as one of those hits if this property was `true`
     */
    #skipProjectileHitCount: boolean;
    /**
     * Whether projectiles striking this obstacle will have a hit added to their hit count. Considered `false` if omitted.
     *
     * For most projectiles, they despawn after one hit, so this property effectively controls
     * whether or not this obstacle will destroy projectiles on contact.
     *
     * For a projectile that despawns after 2 hits, for example, this obstacle would only count
     * as one of those hits if this property was `true`
     */
    get skipProjectileHitCount() { return this.#skipProjectileHitCount; }

    /**
     * Information about this obstacle's hitbox
     */
    readonly #hitbox: SimpleObstacle["hitbox"] & ({ type: T; });
    /**
     * Information about this obstacle's hitbox
     */
    get hitbox() { return this.#hitbox; }

    /**
     * A set of images that this obstacle uses
     */
    readonly #images: srvsdbx_AssetManagement.ImageSrcPair[];
    /**
     * A set of images that this obstacle uses
     */
    get images() { return this.#images; }

    /**
     * Optionally specify a variety of `ParticleEmitter` configurations
     *
     * Each configuration will be turned into a fully-fledged `ParticleEmitter`
     * attached to the obstacle
     *
     * *All units are in surviv units!*
     */
    readonly #emitters: SimpleObstacle<S>["emitters"] & {};
    /**
     * Optionally specify a variety of `ParticleEmitter` configurations
     *
     * Each configuration will be turned into a fully-fledged `ParticleEmitter`
     * attached to the obstacle
     *
     * *All units are in surviv units!*
     */
    get emitters() { return this.#emitters; }

    /**
     * Whether this obstacle can only be destroyed by melee weapons marked as "armor-piercing" (e.g. Axe, Katana)
     */
    #armorPlated: boolean;
    /**
     * Whether this obstacle can only be destroyed by melee weapons marked as "armor-piercing" (e.g. Axe, Katana)
     */
    get armorPlated() { return this.#armorPlated; }

    /**
     * Whether this obstacle can only be destroyed by melee weapons marked as "stone-piercing" (e.g. Sledgehammer)
     */
    #stonePlated: boolean;
    /**
     * Whether this obstacle can only be destroyed by melee weapons marked as "stone-piercing" (e.g. Sledgehammer)
     */
    get stonePlated() { return this.#stonePlated; }

    /**
    * The internal name of a particle spawned when this obstacle takes damage
    */
    readonly #hitParticle: SimpleObstacle["hitParticle"];
    /**
    * The internal name of a particle spawned when this obstacle takes damage
    */
    get hitParticle() { return this.#hitParticle; }

    /**
     * The internal name of a particle spawned when this obstacle is destroyed
     */
    readonly #destroyParticle: SimpleObstacle["destroyParticle"];
    /**
     * The internal name of a particle spawned when this obstacle is destroyed
     */
    get destroyParticle() { return this.#destroyParticle; }

    /**
     * The internal name of an explosion spawned when this obstacle is destroyed
     */
    readonly #destructionExplosion: SimpleObstacle["destructionExplosion"];
    /**
     * The internal name of an explosion spawned when this obstacle is destroyed
     */
    get destructionExplosion() { return this.#destructionExplosion; }

    /**
     * The internal name of a decal spawned when this obstacle is destroyed
     */
    readonly #residue?: SimpleObstacle["residue"];
    /**
     * The internal name of a decal spawned when this obstacle is destroyed
     */
    get residue() { return this.#residue; }

    /**
     * A scale factor to apply to this obstacle's image, relative to its hitbox
     */
    readonly #imageScale: number;
    /**
     * A scale factor to apply to this obstacle's image, relative to its hitbox
     */
    get imageScale() { return this.#imageScale; }

    /**
     * Whether this obstacle's hitbox reflects bullets
     */
    readonly #reflective: boolean;
    /**
     * Whether this obstacle's hitbox reflects bullets
     */
    get reflective() { return this.#reflective; }

    /**
     * Optionally specify the sublayer this obstacle should occupy
     *
     * All obstacles are drawn above the player, but certain obstacles, such as trees,
     * should be drawn over others, such as bushes
     */
    readonly #subLayer: number;
    /**
     * Optionally specify the sublayer this obstacle should occupy
     *
     * All obstacles are drawn above the player, but certain obstacles, such as trees,
     * should be drawn over others, such as bushes
     */
    get subLayer() { return this.#subLayer; }

    /**
     * A function that will be called in order to determine this obstacle's scale factor
     *
     * Most obstacles shrink in size as they take damage
     * @param health A number between 0 and 1 representing the ratio between the obstacle's current health and its max health; 0 is none, 1 is full
     * @returns A scale factor that will affect the obstacle's hitbox and visual size
     */
    readonly #scale: SimpleObstacle["scale"];
    /**
     * A function that will be called in order to determine this obstacle's scale factor
     *
     * Most obstacles shrink in size as they take damage
     * @param health A number between 0 and 1 representing the ratio between the obstacle's current health and its max health; 0 is none, 1 is full
     * @returns A scale factor that will affect the obstacle's hitbox and visual size
     */
    get scale() { return this.#scale; }

    /**
     * Converts a `SimpleObstacle` object into a more rigorous one
     * @param obj The object to convert
     */
    static async from(obj: SimpleObstacle): Promise<srvsdbx_ErrorHandling.Result<ObstaclePrototype, srvsdbx_Errors.SandboxError[]>> {
        const errors: srvsdbx_Errors.SandboxError[] = [],
            worldImages = await srvsdbx_AssetManagement.loadImageArray(obj.images, errors, `${obj.includePath}/`);

        if (errors.length) return { err: errors };

        return {
            res: new ObstaclePrototype(
                obj.name,
                obj.objectType,
                obj.targetVersion,
                obj.namespace,
                obj.includePath,
                obj.hitbox,
                worldImages as srvsdbx_AssetManagement.ImageSrcPair[],
                obj.scale,
                obj.emitters ?? [],
                obj.hitParticle,
                obj.destroyParticle,
                obj.destructionExplosion,
                obj.residue,
                obj.collidable,
                obj.destroyable,
                obj.armorPlated,
                obj.stonePlated,
                obj.reflective,
                obj.skipProjectileHitIncrement ?? false,
                obj.baseHP,
                obj.imageScale ?? 1,
                obj.subLayer ?? -1
            )
        };
    }

    /**
     * `* It's a constructor. It constructs`
     */
    constructor(
        name: ImportedObject["name"],
        objectType: ImportedObject["objectType"],
        targetVersion: ImportedObject["targetVersion"],
        namespace: ImportedObject["namespace"],
        includePath: ImportedObject["includePath"],
        hitbox: ObstaclePrototype<T>["hitbox"],
        images: ObstaclePrototype["images"],
        scale: ObstaclePrototype["scale"],
        emitters: ObstaclePrototype<T, S>["emitters"],
        hitParticle: ObstaclePrototype["hitParticle"],
        destroyParticle: ObstaclePrototype["destroyParticle"],
        destructionExplosion: ObstaclePrototype["destructionExplosion"],
        residue: ObstaclePrototype["residue"],
        collidable: CollisionLevel,
        destroyable: boolean,
        armorPlated: boolean,
        stonePlated: boolean,
        reflective: boolean,
        skipProjectileHitCount: boolean,
        baseHP: number,
        imageScale: number,
        subLayer: number
    ) {
        super(
            name,
            name,
            objectType,
            targetVersion,
            namespace,
            includePath
        );

        this.#hitbox = hitbox;
        this.#images = images;
        this.#scale = scale;

        const scalePoint = (point: srvsdbx_Geometry.Point2D) => srvsdbx_Geometry.Vector2D.scale(point, gamespace.PLAYER_SIZE);

        this.#emitters = emitters.map(emitter => ({
            spawnDelay: emitter.spawnDelay,
            spawnCount: emitter.spawnCount,
            particleTypes: emitter.particleTypes,
            shouldSpawn: emitter.shouldSpawn,
            area(state) {
                const base = extractValue(emitter.area, state);

                if ("x" in base) return scalePoint(base);

                else if (
                    base instanceof srvsdbx_Geometry.Rectangle
                    || base instanceof srvsdbx_Geometry.Circle
                ) {
                    base.scale(gamespace.PLAYER_SIZE);
                    base.moveTo(scalePoint(base.origin));
                }

                return base;
            },
            particleProperties(state) {
                const base = extractValue(emitter.particleProperties, state);

                return {
                    alpha: base.alpha,
                    scale: base.scale,
                    angle: base.angle,
                    angularVelocity: base.angularVelocity,
                    velocity: base.velocity
                };
            },
            initialState: emitter.initialState
        }));
        this.#hitParticle = hitParticle;
        this.#destroyParticle = destroyParticle;
        this.#destructionExplosion = destructionExplosion;
        this.#residue = residue;
        this.#collidable = collidable;
        this.#destroyable = destroyable;
        this.#armorPlated = armorPlated;
        this.#stonePlated = stonePlated;
        this.#reflective = reflective;
        this.#skipProjectileHitCount = skipProjectileHitCount;
        this.#baseHP = baseHP;
        this.#imageScale = imageScale;
        this.#subLayer = subLayer;
    }

    /**
     * A method to conveniently create a new obstacle from its prototype
     * @param position The position to spawn the obstacle at
     * @returns A new obstacle of the desired type
     */
    create(position: srvsdbx_Geometry.Point2D): Obstacle<T, S> {
        return new Obstacle<T, S>(
            this,
            position
        );
    }
}

/**
 * Represents an obstacle
 */
class Obstacle<
    T extends ObstacleTypes = ObstacleTypes,
    S extends ParticleEmitterState & { readonly obstacle: Obstacle<ObstacleTypes, S>; }
    = ParticleEmitterState & { readonly obstacle: Obstacle<ObstacleTypes, any>; }
> extends Generic<{
    collision: [Generic, srvsdbx_Geometry.Point2D[]],
    /**
     * This obstacle's destruction
     *
     * This event is fired whenever this object's health reaches 0
     */
    death: [];
}>
    implements Destroyable {
    //@ts-expect-error
    declare body: T extends "rectangle" ? srvsdbx_Geometry.Rectangle : srvsdbx_Geometry.Circle;
    // Typescript whines about accessor this instance property that, but the IntelliSense works so

    /**
     * This obstacle's original hitbox, used to keep scaling consistent
     */
    readonly #originalBody: T extends "rectangle" ? srvsdbx_Geometry.Rectangle : srvsdbx_Geometry.Circle;

    /**
     * The obstacle prototype this object is based on
     */
    #prototype: ObstaclePrototype<T, S>;
    /**
     * The obstacle prototype this object is based on
     */
    get prototype() { return this.#prototype; }

    /**
     * The health of this obstacle
     */
    #health: number;
    /**
     * The health of this obstacle
     */
    get health() { return this.#health; }

    /**
     * The radius of this obstacle, **in regular pixels**, if applicable.
     *
     * Does not take into account scaling by damage
     */
    #radius: T extends "circle" ? number : undefined;
    /**
     * The radius of this obstacle, **in regular pixels**, if applicable.
     *
     * Does not take into account scaling by damage
     */
    get radius() { return this.#radius; }

    /**
     * The dimensions of this obstacle, **in regular pixels**, if applicable.
     *
     * Does not take into account scaling by damage
     */
    #dimensions: T extends "rectangle" ? {
        /**
         * The width of this obstacle, **in regular pixels**, if applicable
         */
        readonly width: number,
        /**
         * The height of this obstacle, **in regular pixels**, if applicable
         */
        readonly height: number;
    } : undefined;
    /**
     * The dimensions of this obstacle, **in regular pixels**, if applicable.
     *
     * Does not take into account scaling by damage
     */
    get dimensions() { return this.#dimensions; }

    /**
     * The scale factor currently being applied to this obstacle.
     *
     * This value changes—and usually decreases—as the obstacle takes damage
     */
    #scale!: number;
    /**
     * The scale factor currently being applied to this obstacle.
     *
     * This value changes—and usually decreases—as the obstacle takes damage
     */
    get scale() { return this.#scale; }

    /**
     * The image used by this obstacle
     */
    #image: srvsdbx_AssetManagement.ImageSrcPair["asset"];
    /**
     * The image used by this obstacle
     */
    get image() { return this.#image; }

    /**
     * The sublayer to draw this obstacle on
     */
    #subLayer: number;
    /**
     * The sublayer to draw this obstacle on
     */
    get subLayer() { return this.#subLayer; }

    /**
     * A reference to the `ParticleEmitter`s attached to this obstacle
     * and the functions that decide if they should be enabled
     */
    #emitters: [MayBeFunctionWrapped<boolean, [S]>, ParticleEmitter<S>][];

    /**
     * `* It's a constructor. It constructs`
     */
    constructor(
        prototype: ObstaclePrototype<T, S>,
        position: srvsdbx_Geometry.Point2D
    ) {
        const hitbox = prototype.hitbox;

        let radius: number | undefined,
            dimensions: { width: number, height: number; } | undefined,
            image = pickRandomInArray(prototype.images).asset;

        super(
            (() => {
                const isCircle = hitbox.type == "circle";

                if (isCircle)
                    return new srvsdbx_Geometry.Circle(
                        srvsdbx_Geometry.Vector2D.zeroPoint(),
                        radius = gamespace.PLAYER_SIZE * extractValue((hitbox as ObstaclePrototype<"circle">["hitbox"]).radius)
                    );

                const dim = srvsdbx_AssetManagement.determineImageDimensions(
                    image,
                    {
                        width: extractValue((hitbox as ObstaclePrototype<"rectangle">["hitbox"]).dimensions.width),
                        height: extractValue((hitbox as ObstaclePrototype<"rectangle">["hitbox"]).dimensions.height)
                    }
                );

                dim.width *= gamespace.PLAYER_SIZE;
                dim.height *= gamespace.PLAYER_SIZE;

                dimensions = dim;

                return new srvsdbx_Geometry.Rectangle(
                    srvsdbx_Geometry.Vector2D.zeroPoint(),
                    dim.width, dim.height
                );
            })(),
            p5 => {
                const image = this.#image;

                p5.push();
                p5.translate(this.position.x, this.position.y);

                const { width, height } = this.#dimensions ?? { width: 2 * this.#radius!, height: 2 * this.#radius! },
                    imageScale = this.#prototype.imageScale;

                p5.scale(this.#scale * imageScale);

                p5.image(
                    image,
                    0, 0,
                    width, height
                );

                const drawHitbox = (hitbox: boolean) => {
                    if (this.#prototype.hitbox.type == "circle") {
                        p5.ellipse(
                            0, 0,
                            width / (hitbox ? imageScale : 1),
                            height / (hitbox ? imageScale : 1),
                            50
                        );
                    } else {
                        p5.beginShape();
                        p5.scale(1 / (this.#scale * (hitbox ? 1 : imageScale)));
                        p5.translate(-this.position.x, -this.position.y);

                        for (let i = 0, vertices = (this as Obstacle<"rectangle", S>).body.vertices, l = vertices.length; i < l; i++)
                            p5.vertex(vertices[i].x, vertices[i].y);

                        p5.endShape("close");
                    }
                };

                gamespace.drawDebug(
                    p5,
                    this.collidable.getHitboxName(),
                    () => drawHitbox(true),
                    void 0,
                    this
                );

                if (imageScale != 1)
                    gamespace.drawHitboxIfEnabled(
                        p5,
                        "DEFAULT",
                        () => drawHitbox(false)
                    );

                p5.pop();
            },
            position
        );

        this.#originalBody = this.body.clone() as any;
        this.#radius = radius as T extends "circle" ? number : never;
        this.#dimensions = dimensions as T extends "rectangle" ? { width: number, height: number; } : never;
        this.#image = image;
        this.#prototype = prototype;
        this.#health = prototype.baseHP;
        this.collidable = this.#prototype.collidable;
        this.#setScale(prototype.scale(1));

        this.events.once("death", () => {
            const prototype = gamespace.prototypes.particles.get(this.#prototype.destroyParticle.particle);

            for (
                let i = 0, limit = extractValue(this.#prototype.destroyParticle.count);
                i < limit;
                prototype.create(
                    srvsdbx_Geometry.Vector2D.fromPoint2D(this.position)
                        .plus({
                            direction: srvsdbx_Math.randomAngle(),
                            magnitude: srvsdbx_Math.bounds_random(0, (this.#radius ?? (this.#dimensions!.width + this.#dimensions!.height) / 2)),
                        }),
                    srvsdbx_Math.randomAngle()
                ),
                i++
            );

            if (this.#prototype.residue)
                gamespace.prototypes.decals.get(this.#prototype.residue.decal)
                    .create(
                        this.position,
                        this.#prototype.residue.noRotate ? 0 : srvsdbx_Math.randomAngle()
                    );

            if (this.#prototype.destructionExplosion)
                gamespace.prototypes.explosions.get(this.#prototype.destructionExplosion)
                    .create(this.position);
        });

        this.#subLayer = this.#prototype.subLayer;

        this.#emitters = this.#prototype.emitters.map(
            emitterConfig => [
                emitterConfig.shouldSpawn ?? true,
                new ParticleEmitter<S>(
                    this.position,
                    emitterConfig.particleTypes.map(gamespace.prototypes.particles.get),
                    emitterConfig,
                    {
                        ...emitterConfig.initialState,
                        obstacle: this
                    }
                )
            ]
        );

        this.#updateEmitters();

        gamespace.objects.obstacles.set(this.id, this);
    }

    /**
     * Updates this obstacle's emitters, namely, whether they're active
     * or not
     */
    #updateEmitters() {
        this.#emitters.map(
            ([run, emitter]) => extractValue(run, emitter.state)
                ? emitter.enable()
                : emitter.disable()
        );
    }

    override update() {
        this.#updateEmitters();
        super.update();
    }

    /**
     * Used internally to set this obstacle's scale, readjusting the hitbox in the process
     * @param amount The scale factor to set
     */
    #setScale(amount: number) {
        if (Number.isNaN(amount)) return;

        this.#scale = amount;

        if (this.body instanceof srvsdbx_Geometry.Rectangle) {
            this.body.width = (this.#originalBody as srvsdbx_Geometry.Rectangle).width * amount;
            this.body.height = (this.#originalBody as srvsdbx_Geometry.Rectangle).height * amount;
        } else {
            this.body.radius = (this.#originalBody as srvsdbx_Geometry.Circle).radius * amount;
        }
    }

    /**
     * Applies damage to this obstacle, taking into account obstacle multiplies
     * @param source The bullet striking this obstacle
     */
    applyBulletDamage(source: Bullet) {
        this.applyDamage(source.damage * source.multipliers.obstacle);
    }

    /**
     * Applies damage to this obstacle as-is
     * @param source The bullet striking this obstacle
     */
    applyDamage(amount: number) {
        this.#health -= amount;
        this.#setScale(this.#prototype.scale(this.#health / this.#prototype.baseHP));

        if (this.#health <= 0) {
            this.events.dispatchEvent("death");
            this.destroy();
        }
    }

    override destroy() {
        if (this.destroyed) return;
        for (const emitter of this.#emitters)
            emitter[1].destroy();

        gamespace.objects.obstacles.delete(this.id);
        super.destroy();

        //@ts-expect-error
        this.#dimensions = this.#prototype = void 0;
    }
}