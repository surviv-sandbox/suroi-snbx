/**
 * A class that represents some projectile. Abstract class
 *
 * surviv curiously handles projectiles by only keeping track of
 * its last position and its current one: collision is then done by
 * testing for intersections between that segment and any game bodies.
 * This means that tracer dimensions are purely cosmetic
 */
declare abstract class Projectile implements Destroyable {
    #private;
    /**
     * This projectile's id, picked from the same pool as every other id
     */
    get id(): bigint;
    /**
     * Represents the this projectile's start point (where it spawns)
     */
    get start(): srvsdbx_Geometry.Point2D;
    /**
     * Represents the projectile's endpoint (where it'll despawn)
     */
    get end(): srvsdbx_Geometry.Point2D;
    /**
     * The timestamp this projectile was created at
     */
    get created(): number;
    /**
     * Uses this projectile's speed and endpoints to calculate how long it'll live for
     */
    get lifetime(): number;
    /**
     * This projectile's position in 3D space
     */
    get position(): srvsdbx_Geometry.Point3D;
    set position(v: srvsdbx_Geometry.Point3D);
    /**
     * This object's z position
     *
     * `get`: This object's position
     *
     * `set`: If the provided value isn't `NaN`, changes this object's z position
     */
    get layer(): number;
    set layer(v: number);
    /**
     * What sublayer this projectile resides on. Objects on sublayers below 0 are drawn below a player on the same level,
     * while those with a sublayer greater than or equal to 0 are drawn above it.
     */
    get subLayer(): number;
    /**
     * This projectile's last position
     */
    get lastPosition(): srvsdbx_Geometry.Point2D;
    /**
     * The angle of the trajectory this projectile will take
     */
    get trajectory(): number;
    /**
     * This projectile's current angle
     */
    get angle(): number;
    /**
     * This projectile's angular velocity
     */
    get angularVelocity(): number;
    /**
     * The opacity of this projectile
     *
     * `get`: Retrieves this projectile's opacity
     *
     * `set`: Sets this projectile's opacity, except if the provided value is `NaN`
     */
    get alpha(): number;
    set alpha(v: number);
    /**
     * Whether this projectile has been destroyed
     */
    get destroyed(): boolean;
    /**
     * An event target on which listeners can be added
     */
    get events(): SandboxEventTarget<{
        /**
         * Represents a collision
         */
        collision: {
            /**
             * The actual `CollisionEvent` instance
             */
            event: CollisionEvent;
            /**
             * The `Generic` this object has collided with
             */
            args: [Generic<BaseGenericEvents>];
        };
        /**
         * Represents this projectile's destruction
         */
        destroy: {
            /**
             * The `Event` instance
             */
            event: Event;
            /**
             * Nothing
             */
            args: [];
        };
    }>;
    /**
     * `* It's a constructor. It constructs.`
     * @param body The matter.js body this object will use
     * @param emitter The `Gun` that spawned this object
     * @param trajectory Information about the trajectory this projectile will follow, conforming to this format:
     * - The starting position must always be given
     * - If the end point is given, specify either the projectile's speed or the time it should take to get from start to end
     * - Otherwise, specify a direction
     * - Out of the projectile's lifetime, its travel distance and speed, specify two
     * @param drawFunc A function that'll be invoked in order to draw this object
     */
    constructor(trajectory: {
        start: srvsdbx_Geometry.Point2D;
    } & ({
        end: srvsdbx_Geometry.Point2D;
    } & ({
        speed: number;
    } | {
        lifetime: number;
    }) | {
        direction: number;
    } & (// and
    {
        lifetime: number;
        speed: number;
    } | {
        lifetime: number;
        distance: number;
    } | {
        distance: number;
        speed: number;
    })) & {
        initialAngle?: number;
        spinVel?: number;
    }, drawFunc: (p5: import("p5")) => void, subLayer?: number);
    /**
     * Since this projectile's endpoints and speed are known, we can linearly interpolate between them
     */
    update(): void;
    /**
     * Calls the user-defined drawing function in order to draw this object
     * @param p5 The gamespace's p5 instance
     */
    draw(p5: import("p5")): void;
    /**
     * Sets this projectile's position. Ultimately, this does nothing, as the next `update` call will set it back on track. Does not affect `lastPosition`
     * @param pos The position the move this projectile to
     */
    setPosition(pos: srvsdbx_Geometry.Point2D): void;
    /**
     * Reflects a projectile in a certain direction. This method effectively creates a new projectile by changing
     * most of this one's fields, such as `start`, `end`, `lifetime`, `created` and `angle`.
     * @param origin From where the bullet is being reflected
     * @param direction The direction in which to reflect the projectile
     * @param source The game object which caused the bullet to be deviated. For one tick after being reflected,
     * this bullet cannot be reflected again by the same source. This is done to prevent floating point inaccuracies
     * from causing a bullet from "ping-ponging" within the same reflective surface at a high frequency
     */
    reflect(origin: srvsdbx_Geometry.Point2D, direction: number, source: Generic): srvsdbx_ErrorHandling.Result<undefined, string>;
    /**
     * Modifies the range of a projectile
     * @param range The new range. If this is shorter than the distance that has been traveled, the projectile is destroyed
     */
    modifyRange(range: number): srvsdbx_ErrorHandling.Result<undefined, string>;
    /**
     * Identical to `Generic.destroy`, but clears projectile-specific object fields
     */
    destroy(): void;
}
/**
 * Represents a bullet fired by a firearm
 */
declare class Bullet extends Projectile implements Destroyable {
    #private;
    /**
     * The maximum amount of times a bullet can be reflected
     * before being destroyed
     */
    static get MAX_REFLECTIONS(): number;
    /**
     * Each time this bullet is reflected, its range will be divided by
     * this amount. Note that this applied to the overall range and not the
     * remaining range, meaning that if the bullet's travel distance exceeds
     * its new range, it will immediately be destroyed
     */
    static get REFLECTION_RANGE_DECAY_FACTOR(): number;
    /**
     * The amount of damage this projectile will inflict
    */
    get damage(): number;
    /**
     * The amount by which this bullet's damage will be multiplied every 100 surviv units
     */
    get falloff(): number;
    /**
     * Various informations about this projectile's behavior
     */
    get properties(): ({
        readonly type: "explosive";
        readonly explosionType: string;
        readonly explodeOnContact: boolean;
        readonly heightPeak?: number | undefined;
    } | {
        readonly type: "bullet";
    }) & {
        readonly images: "none" | srvsdbx_AssetManagement.ImageSrcPair[];
        readonly spinVel?: MayBeFunctionWrapped<number, []> | undefined;
    };
    /**
     * Whether or not this projectile's type is `explosive`
     */
    get isExplosive(): boolean;
    /**
     * How many objects this projectile has struck
     */
    get hitCount(): number;
    /**
     * `* It's a constructor. It constructs.`
     * @param position A `Point2D` object dictating this object's starting position
     * @param end A `Point2D` object dictating this object's end point
     * @param speed A number indicating the speed—in units per millisecond—of this projectile
     * @param damage The amount of damage this projectile inflicts by default
     * @param drawFunction A function that will be invoked to draw this object
     * @param properties More information about this projectile's behavior
     * @param persistance Information about how this projectile behaves when striking a target
     * @param effectOnHit A status effect that will be applied to targets when struck
     * @param emitter The `Gun` that fired this bullet
     */
    constructor(position: srvsdbx_Geometry.Point2D, falloff: number, end: srvsdbx_Geometry.Point2D, speed: number, damage: number, drawFunction: (p5: import("p5")) => void, properties: Ammo["projectileInfo"], persistance: Required<GunPrototype["ballistics"]["persistance"] & {}>, effectsOnHit: PrototypeReference<"statusEffects">[] | undefined, emitter: Gun);
    /**
     * A generic drawing function for bullets originating from firearms
     * @param emitter The firearm that fired this bullet
     */
    static drawFromFirearm(emitter: Gun): (this: Bullet, p5: import("p5")) => void;
    /**
     * A generic drawing function for bullets originating from explosions (aka shrapnel)
     * @param emitter Information to be used to draw this shrapnel
     */
    static drawFromExplosion(emitter: ExplosionPrototype["shrapnel"] & {}): (this: Bullet, p5: import("p5")) => void;
    /**
     * Creates a piece of shrapnel (internally a special kind of `Bullet`)
     * @param pos This shrapnel's spawn point
     * @param shrapnelData Information about the shrapnel
     * @param emitter The `Gun` that's the root cause of this shrapnel
     */
    static makeShrapnel(pos: srvsdbx_Geometry.Point2D, shrapnelData: ExplosionPrototype["shrapnel"] & {}, emitter: Gun): Bullet;
    update(): void;
    /**
     * Identical to the method it overrides, save for the fact that it also modifies this bullet's statistics
     * @param origin From where the bullet is being reflected
     * @param direction The direction in which to reflect the projectile
     * @param source The game object which caused the bullet to be deviated. For one tick after being reflected,
     * this bullet cannot be reflected again by the same source. This is done to prevent floating point inaccuracies
     * from causing a bullet from "ping-ponging" within the same reflective surface at a high frequency
     */
    reflect(origin: srvsdbx_Geometry.Point2D, direction: number, source: Generic<BaseGenericEvents>): srvsdbx_ErrorHandling.Result<undefined, string>;
    /**
     * Identical to the method it overrides, but clears some internal fields
     */
    destroy(): void;
}
