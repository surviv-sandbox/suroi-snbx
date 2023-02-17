/**
 * A simplified representation of an explosion object
 */
interface SimpleExplosion extends SimpleImport {
    /**
     * The maximum damage inflicted, not taking modifiers into account; base damage
     */
    readonly damage: number,
    /**
     * By how much this explosion's damage should be multiplied when affecting an obstacle
     */
    readonly obstacleMult: number,
    /**
     * The blast radii for this explosion. Unrelated to shrapnel
     */
    readonly radii: {
        /**
         * Objects closer to the explosion's epicenter than this value receive full damage with no falloff.
         */
        readonly min: number,
        /**
         * Objects farther from the explosion's epicenter than this value take no damage (shrapnel may still deal damage though)
         */
        readonly max: number;
    },
    /**
     * The *internal name* of the particle to spawn at this explosion's epicenter when the explosion spawns
     */
    readonly particle?: PrototypeReference<"particles">,
    /**
     * How "hard" this explosion shakes the screen. Explosions farther than 40 units from a player do not trigger screen shake, and the strength decreases with distance and time.
     */
    readonly shakeStrength?: MayBeFunctionWrapped<number>,
    /**
     * For how long the user's screen will shake following this explosion, assuming they were at its epicenter. Duration falls off with respect to distance,
     */
    readonly shakeDuration?: MayBeFunctionWrapped<number>,
    /**
     * Information about the decal this explosion leaves behind
     */
    readonly decal?: PrototypeReference<"decals">,
    /**
     * Information about the shrapnel this explosion spawns
     */
    readonly shrapnel?: {
        /**
         * How many pieces of shrapnel to spawn
         */
        readonly count: MayBeFunctionWrapped<number>,
        /**
         * The damage one piece inflicts, disregarding modifiers
         */
        readonly damage: number,
        /**
         * How fast, in surviv units per second, a piece of shrapnel travels
         */
        readonly velocity: number,
        /**
         * How far, in surviv units, a piece of shrapnel travels before despawning
         */
        readonly range: MayBeFunctionWrapped<number>,
        /**
         * A number by which the shrapnel's damage will be multiplied every 100 units
         */
        readonly falloff: number,
        /**
         * Information about the shrapnel's tracer
         */
        readonly tracer: {
            /**
             * The path to the tracer's image
             */
            readonly image: string,
            /**
             * The tracer's color
             */
            readonly color: string,
            /**
             * The tracer's width
             */
            readonly width: Dimension,
            /**
             * The tracer's height
             */
            readonly height: Dimension;
        };
    },
    /**
     * Information about the particles spawned when this explosions spawns
     */
    readonly scatter?: {
        /**
         * How many particles to spawn
         */
        readonly count: number,
        /**
         * Each particle's velocity
         */
        readonly velocity: MayBeFunctionWrapped<number>,
        /**
         * The internal name of the particle to spawn
         */
        readonly particleType: string;
    };
}

/**
 * Represents the generalization of a certain type of explosion
 */
class ExplosionPrototype extends ImportedObject {
    /**
     * This explosion's base damage
     */
    #damage: number;
    /**
     * This explosion's base damage
     */
    get damage() { return this.#damage; }

    /**
     * By how much this explosion's damage should be multiplied when affecting an obstacle
     */
    #obstacleMult: number;
    /**
     * By how much this explosion's damage should be multiplied when affecting an obstacle
     */
    get obstacleMult() { return this.#obstacleMult; }

    /**
     * The blast radii for this explosion. Unrelated to shrapnel
     */
    readonly #radii: SimpleExplosion["radii"];
    /**
     * The blast radii for this explosion. Unrelated to shrapnel
     */
    get radii() { return this.#radii; }

    /**
     * The *internal name* of the particle to spawn at this explosion's epicenter when the explosion spawns
     */
    readonly #particle: SimpleExplosion["particle"];
    /**
     * The *internal name* of the particle to spawn at this explosion's epicenter when the explosion spawns
     */
    get particle() { return this.#particle; }

    /**
     * How "hard" this explosion shakes the screen. Explosions farther than 40 units from a player do not trigger screen shake, and the strength decreases with distance and time.
     */
    #shakeStrength: SimpleExplosion["shakeStrength"];
    /**
     * How "hard" this explosion shakes the screen. Explosions farther than 40 units from a player do not trigger screen shake, and the strength decreases with distance and time.
     */
    get shakeStrength() { return this.#shakeStrength; }

    /**
     * For how long the user's screen will shake following this explosion, assuming they were at its epicenter. Duration falls off with respect to distance,
     */
    #shakeDuration: SimpleExplosion["shakeDuration"];
    /**
     * For how long the user's screen will shake following this explosion, assuming they were at its epicenter. Duration falls off with respect to distance,
     */
    get shakeDuration() { return this.#shakeDuration; }

    /**
     * Information about the decal this explosion leaves behind
     */
    readonly #decal: SimpleExplosion["decal"];
    /**
     * Information about the decal this explosion leaves behind
     */
    get decal() { return this.#decal; }

    /**
     * Information about the shrapnel this explosion spawns
     */
    readonly #shrapnel: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleExplosion["shrapnel"] & {}> | undefined;
    /**
     * Information about the shrapnel this explosion spawns
     */
    get shrapnel() { return this.#shrapnel; }

    /**
     * Information about the particles spawned when this explosions spawns
     */
    readonly #scatter: SimpleExplosion["scatter"];
    /**
     * Information about the particles spawned when this explosions spawns
     */
    get scatter() { return this.#scatter; }

    /**
     * Takes a simplified representation of a explosion and converts it into a more rigorous one
     * @param obj The `SimpleParticle` object to parse
     * @returns A new `ParticlePrototype`
     */
    static async from(obj: SimpleExplosion): Promise<srvsdbx_ErrorHandling.Result<ExplosionPrototype, unknown[]>> {
        const errors: unknown[] = [],
            shrapnelImage = obj.shrapnel ? srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${obj.includePath}/${obj.shrapnel?.tracer?.image}`),
                srvsdbx_ErrorHandling.identity,
                errors.push
            ) : void 0;

        if (!errors.length) {
            const s = gamespace.PLAYER_SIZE;

            return {
                res: new ExplosionPrototype(
                    obj.name,
                    obj.displayName,
                    obj.includePath,
                    obj.namespace,
                    obj.targetVersion,
                    obj.damage,
                    obj.obstacleMult,
                    obj.radii,
                    obj.particle,
                    obj.shakeStrength !== void 0 ? () => extractValue(obj.shakeStrength!) * s : void 0,
                    obj.shakeDuration,
                    obj.decal,
                    obj.shrapnel ? {
                        count: obj.shrapnel.count,
                        damage: obj.shrapnel.damage,
                        falloff: obj.shrapnel.falloff,
                        range: obj.shrapnel.range,
                        velocity: obj.shrapnel.velocity,
                        tracer: {
                            width: obj.shrapnel.tracer.width,
                            height: obj.shrapnel.tracer.height,
                            color: obj.shrapnel.tracer.color,
                            image: shrapnelImage as srvsdbx_AssetManagement.ImageSrcPair
                        }
                    } : void 0,
                    obj.scatter
                )
            };
        }

        return { err: errors };
    }

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(
        name: typeof ImportedObject.prototype.name,
        displayName: typeof ImportedObject.prototype.displayName,
        includePath: typeof ImportedObject.prototype.includePath,
        namespace: typeof ImportedObject.prototype.namespace,
        targetVersion: typeof ImportedObject.prototype.targetVersion,
        damage: typeof ExplosionPrototype.prototype.damage,
        obstacleMult: typeof ExplosionPrototype.prototype.obstacleMult,
        radii: typeof ExplosionPrototype.prototype.radii,
        particle: typeof ExplosionPrototype.prototype.particle,
        shakeStrength: typeof ExplosionPrototype.prototype.shakeStrength,
        shakeDuration: typeof ExplosionPrototype.prototype.shakeDuration,
        decal: typeof ExplosionPrototype.prototype.decal,
        shrapnel: typeof ExplosionPrototype.prototype.shrapnel,
        scatter: typeof ExplosionPrototype.prototype.scatter
    ) {
        super(name, displayName, includePath, namespace, targetVersion);

        const size = gamespace.PLAYER_SIZE;

        function autoOrScale(dim: Dimension) {
            return dim == "auto" ? dim : dim * size;
        }

        this.#damage = damage;
        this.#obstacleMult = obstacleMult;
        this.#radii = {
            min: radii.min * size,
            max: radii.max * size
        };
        this.#particle = particle;
        this.#shakeStrength = shakeStrength;
        this.#shakeDuration = shakeDuration;
        this.#decal = decal;
        this.#shrapnel = shrapnel ? {
            count: shrapnel.count,
            damage: shrapnel.damage,
            falloff: shrapnel.falloff,
            range: () => extractValue(shrapnel.range) * size,
            velocity: shrapnel.velocity * 0.05,
            tracer: {
                width: autoOrScale(shrapnel.tracer.width),
                height: autoOrScale(shrapnel.tracer.height),
                color: shrapnel.tracer.color,
                image: shrapnel.tracer.image
            }
        } : void 0;
        this.#scatter = scatter ? {
            count: scatter.count,
            particleType: scatter.particleType,
            velocity: () => extractValue(scatter.velocity) * 0.05
        } : void 0;
    }
}

/**
 * Represents an explosion in the game world
 *
 * Pragmatically speaking, an `Explosion` is just an object that spawns a `Particle`, a `Decal` and some projectiles (shrapnel), and then applies damage to objects
 *
 * Over the span of its lifetime, it adds a shake effect to the player's camera
 */
class Explosion implements Destroyable {
    /**
     * The `ExplosionPrototype` this object is based on
     */
    readonly #prototype: ExplosionPrototype;
    /**
     * The `ExplosionPrototype` this object is based on
     */
    get prototype() { return this.#prototype; }

    /**
     * The location of this explosion
     */
    readonly #position: srvsdbx_Geometry.Point3D;
    /**
     * The location of this explosion
     */
    get position() { return this.#position; }

    /**
     * This explosion's id
     */
    #id = generateId();
    /**
     * This explosion's id
     */
    get id() { return this.#id; }

    /**
     * The duration of this explosion's screen shake effect
     */
    #duration: number;
    /**
     * The duration of this explosion's screen shake effect
     */
    get duration() { return this.#duration; }

    /**
     * The strength of this explosion's screen shake effect
     */
    #strength: number;
    /**
     * The strength of this explosion's screen shake effect
     */
    get strength() { return this.#strength; }

    /**
     * The timestamp at which this explosion was spawned
     */
    #created: number;
    /**
     * The timestamp at which this explosion was spawned
     */
    get created() { return this.#created; }

    /**
     * Whether or not this explosion object has reached the end of its life
     */
    #destroyed = false;
    /**
     * Whether or not this explosion object has reached the end of its life
     */
    get destroyed() { return this.#destroyed; }

    /**
     * `* It's a constructor. It constructs.`
     * @param proto The prototype to base this object is on
     * @param position The position this explosion occurs at
     * @param emitter The `Gun` that created this explosion
     */
    constructor(proto: ExplosionPrototype, position: srvsdbx_Geometry.Point3D, emitter: Gun, effectsOnHit?: PrototypeReference<"statusEffects">[]) {
        this.#prototype = proto;
        this.#position = srvsdbx_Geometry.Vector3D.clone(position);

        this.#created = gamespace.currentUpdate;
        this.#strength = extractValue(proto.shakeStrength) ?? 0;
        this.#duration = extractValue(proto.shakeDuration) ?? 0;

        if (this.#prototype.decal)
            new Decal(
                gamespace.prototypes.decals.get(this.#prototype.decal)!,
                this.#position,
                srvsdbx_Math.randomAngle()
            );

        if (this.#prototype.particle)
            new Particle(
                gamespace.prototypes.particles.get(this.#prototype.particle)!,
                this.#position,
                srvsdbx_Math.randomAngle()
            );

        const shrapnel = proto.shrapnel;
        if (shrapnel)
            for (let i = 0, count = extractValue(shrapnel.count); i < count; i++)
                Bullet.makeShrapnel(this.#position, shrapnel, emitter);

        const scatter = proto.scatter;
        if (scatter)
            for (let i = 0; i < scatter.count; i++) {
                const particle = new Particle(
                    gamespace.prototypes.particles.get(scatter.particleType)!,
                    this.#position,
                    srvsdbx_Math.randomAngle()
                );

                const velocity = srvsdbx_Geometry.Vector2D.fromPolarToPt(srvsdbx_Math.randomAngle(), extractValue(scatter.velocity));

                particle.velocityMap.set(
                    "intrinsic",
                    { x: velocity.x, y: velocity.y, z: 0 }
                );
            }

        gamespace.objects.players.forEach(player => {
            const dist = srvsdbx_Geometry.Vector2D.distBetweenPts(player.position, position) - player.radius /* distance from edge of player */,
                radii = proto.radii;

            if (dist >= radii.max) return;

            const damage = proto.damage * (
                dist <= radii.min
                    ? 1
                    : (1 - ((dist - radii.min) / (radii.max - radii.min)) ** 2)
            );

            player.applyDamage(damage);

            if (effectsOnHit?.length) {
                for (let i = 0, l = effectsOnHit.length; i < l; i++) {
                    const effect = gamespace.prototypes.statusEffects.get(effectsOnHit[i])!,
                        effectAlreadyApplied = [...player.statusEffects.values()].find(s => s.prototype == effect);

                    if (effectAlreadyApplied) effectAlreadyApplied.renew();
                    else player.statusEffects.add(new StatusEffect(effect, player));
                }
            }
        });

        gamespace.objects.explosions.set(this.#id, this);
    }

    /**
     * Just continuously reapplies the shake effect at varying strengths
     */
    update() {
        const interpolation = 1 - (gamespace.currentUpdate - this.#created) / (this.#duration ?? Infinity);

        if (interpolation <= 0) return this.destroy();

        if (this.#strength)
            gamespace.player?.addShake?.(
                `explosion${this.#id}`,
                this.#strength * +Decimal.clamp(interpolation, 0, 1),
                this.#position
            );
    }

    /**
     * Uniquely draws this explosion's damage radii for debug mode
     * @param p5 The gamespace's p5 instance
     */
    draw(p5: import("p5")) {
        if (this.#destroyed) return;

        gamespace.drawHitboxIfEnabled(
            p5,
            "AREA_OF_EFFECT",
            () => {
                p5.translate(this.#position.x, this.#position.y);
                const radii = this.#prototype.radii;
                p5.ellipse(0, 0, 2 * radii.min, 2 * radii.min, 50);
                p5.ellipse(0, 0, 2 * radii.max, 2 * radii.max, 50);
            }
        );
    }

    /**
     * Similar in spirit to `Generic.destroy`, this method clears any object attributes from this object to encourage the GC to clean up
     */
    destroy() {
        this.#destroyed = true;
        gamespace.objects.explosions.delete(this.#id);
        gamespace.player?.removeShake?.(`explosion${this.#id}`);
        //@ts-expect-error
        this.#position = this.#prototype = void 0;
    }
}