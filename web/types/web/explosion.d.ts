/**
 * A simplified representation of an explosion object
 */
interface SimpleExplosion extends SimpleImport {
    /**
     * The maximum damage inflicted, not taking modifiers into account; base damage
     */
    readonly damage: number;
    /**
     * By how much this explosion's damage should be multiplied when affecting an obstacle
     */
    readonly obstacleMult: number;
    /**
     * The blast radii for this explosion. Unrelated to shrapnel
     */
    readonly radii: {
        /**
         * Objects closer to the explosion's epicenter than this value receive full damage with no falloff.
         */
        readonly min: number;
        /**
         * Objects farther from the explosion's epicenter than this value take no damage (shrapnel may still deal damage though)
         */
        readonly max: number;
    };
    /**
     * The *internal name* of the particle to spawn at this explosion's epicenter when the explosion spawns
     */
    readonly particle?: PrototypeReference<"particles">;
    /**
     * How "hard" this explosion shakes the screen. Explosions farther than 40 units from a player do not trigger screen shake, and the strength decreases with distance and time.
     */
    readonly shakeStrength?: MayBeFunctionWrapped<number>;
    /**
     * For how long the user's screen will shake following this explosion, assuming they were at its epicenter. Duration falls off with respect to distance,
     */
    readonly shakeDuration?: MayBeFunctionWrapped<number>;
    /**
     * Information about the decal this explosion leaves behind
     */
    readonly decal?: PrototypeReference<"decals">;
    /**
     * Information about the shrapnel this explosion spawns
     */
    readonly shrapnel?: {
        /**
         * How many pieces of shrapnel to spawn
         */
        readonly count: MayBeFunctionWrapped<number>;
        /**
         * The damage one piece inflicts, disregarding modifiers
         */
        readonly damage: number;
        /**
         * How fast, in surviv units per second, a piece of shrapnel travels
         */
        readonly velocity: number;
        /**
         * How far, in surviv units, a piece of shrapnel travels before despawning
         */
        readonly range: MayBeFunctionWrapped<number>;
        /**
         * A number by which the shrapnel's damage will be multiplied every 100 units
         */
        readonly falloff: number;
        /**
         * Information about the shrapnel's tracer
         */
        readonly tracer: {
            /**
             * The path to the tracer's image
             */
            readonly image: string;
            /**
             * The tracer's color
             */
            readonly color: string;
            /**
             * The tracer's width
             */
            readonly width: Dimension;
            /**
             * The tracer's height
             */
            readonly height: Dimension;
        };
    };
    /**
     * Information about the particles spawned when this explosions spawns
     */
    readonly scatter?: {
        /**
         * How many particles to spawn
         */
        readonly count: number;
        /**
         * Each particle's velocity
         */
        readonly velocity: MayBeFunctionWrapped<number>;
        /**
         * The internal name of the particle to spawn
         */
        readonly particleType: string;
    };
}
/**
 * Represents the generalization of a certain type of explosion
 */
declare class ExplosionPrototype extends ImportedObject {
    #private;
    /**
     * This explosion's base damage
     */
    get damage(): number;
    /**
     * By how much this explosion's damage should be multiplied when affecting an obstacle
     */
    get obstacleMult(): number;
    /**
     * The blast radii for this explosion. Unrelated to shrapnel
     */
    get radii(): {
        /**
         * Objects closer to the explosion's epicenter than this value receive full damage with no falloff.
         */
        readonly min: number;
        /**
         * Objects farther from the explosion's epicenter than this value take no damage (shrapnel may still deal damage though)
         */
        readonly max: number;
    };
    /**
     * The *internal name* of the particle to spawn at this explosion's epicenter when the explosion spawns
     */
    get particle(): string | undefined;
    /**
     * How "hard" this explosion shakes the screen. Explosions farther than 40 units from a player do not trigger screen shake, and the strength decreases with distance and time.
     */
    get shakeStrength(): MayBeFunctionWrapped<number, []> | undefined;
    /**
     * For how long the user's screen will shake following this explosion, assuming they were at its epicenter. Duration falls off with respect to distance,
     */
    get shakeDuration(): MayBeFunctionWrapped<number, []> | undefined;
    /**
     * Information about the decal this explosion leaves behind
     */
    get decal(): string | undefined;
    /**
     * Information about the shrapnel this explosion spawns
     */
    get shrapnel(): srvsdbx_AssetManagement.ConvertPathsToImages<{
        /**
         * How many pieces of shrapnel to spawn
         */
        readonly count: MayBeFunctionWrapped<number, []>;
        /**
         * The damage one piece inflicts, disregarding modifiers
         */
        readonly damage: number;
        /**
         * How fast, in surviv units per second, a piece of shrapnel travels
         */
        readonly velocity: number;
        /**
         * How far, in surviv units, a piece of shrapnel travels before despawning
         */
        readonly range: MayBeFunctionWrapped<number, []>;
        /**
         * A number by which the shrapnel's damage will be multiplied every 100 units
         */
        readonly falloff: number;
        /**
         * Information about the shrapnel's tracer
         */
        readonly tracer: {
            /**
             * The path to the tracer's image
             */
            readonly image: string;
            /**
             * The tracer's color
             */
            readonly color: string;
            /**
             * The tracer's width
             */
            readonly width: Dimension;
            /**
             * The tracer's height
             */
            readonly height: Dimension;
        };
    }> | undefined;
    /**
     * Information about the particles spawned when this explosions spawns
     */
    get scatter(): {
        /**
         * How many particles to spawn
         */
        readonly count: number;
        /**
         * Each particle's velocity
         */
        readonly velocity: MayBeFunctionWrapped<number, []>;
        /**
         * The internal name of the particle to spawn
         */
        readonly particleType: string;
    } | undefined;
    /**
     * Takes a simplified representation of a explosion and converts it into a more rigorous one
     * @param obj The `SimpleParticle` object to parse
     * @returns A new `ParticlePrototype`
     */
    static from(obj: SimpleExplosion): Promise<srvsdbx_ErrorHandling.Result<ExplosionPrototype, SandboxError[]>>;
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name: typeof ImportedObject.prototype.name, displayName: typeof ImportedObject.prototype.displayName, objectType: typeof ImportedObject.prototype.objectType, includePath: typeof ImportedObject.prototype.includePath, namespace: typeof ImportedObject.prototype.namespace, targetVersion: typeof ImportedObject.prototype.targetVersion, damage: typeof ExplosionPrototype.prototype.damage, obstacleMult: typeof ExplosionPrototype.prototype.obstacleMult, radii: typeof ExplosionPrototype.prototype.radii, particle: typeof ExplosionPrototype.prototype.particle, shakeStrength: typeof ExplosionPrototype.prototype.shakeStrength, shakeDuration: typeof ExplosionPrototype.prototype.shakeDuration, decal: typeof ExplosionPrototype.prototype.decal, shrapnel: typeof ExplosionPrototype.prototype.shrapnel, scatter: typeof ExplosionPrototype.prototype.scatter);
}
/**
 * Represents an explosion in the game world
 *
 * Pragmatically speaking, an `Explosion` is just an object that spawns a `Particle`, a `Decal` and some projectiles (shrapnel), and then applies damage to objects
 *
 * Over the span of its lifetime, it adds a shake effect to the player's camera
 */
declare class Explosion implements Destroyable {
    #private;
    /**
     * The `ExplosionPrototype` this object is based on
     */
    get prototype(): ExplosionPrototype;
    /**
     * The location of this explosion
     */
    get position(): srvsdbx_Geometry.Point3D;
    /**
     * This explosion's id
     */
    get id(): bigint;
    /**
     * The duration of this explosion's screen shake effect
     */
    get duration(): number;
    /**
     * The strength of this explosion's screen shake effect
     */
    get strength(): number;
    /**
     * The timestamp at which this explosion was spawned
     */
    get created(): number;
    /**
     * Whether or not this explosion object has reached the end of its life
     */
    get destroyed(): boolean;
    /**
     * `* It's a constructor. It constructs.`
     * @param proto The prototype to base this object is on
     * @param position The position this explosion occurs at
     * @param emitter The `Gun` that created this explosion
     */
    constructor(proto: ExplosionPrototype, position: srvsdbx_Geometry.Point3D, emitter: Gun, effectsOnHit?: PrototypeReference<"statusEffects">[]);
    /**
     * Just continuously reapplies the shake effect at varying strengths
     */
    update(): void;
    /**
     * Uniquely draws this explosion's damage radii for debug mode
     * @param p5 The gamespace's p5 instance
     */
    draw(p5: import("p5")): void;
    /**
     * Similar in spirit to `Generic.destroy`, this method clears any object attributes from this object to encourage the GC to clean up
     */
    destroy(): void;
}
